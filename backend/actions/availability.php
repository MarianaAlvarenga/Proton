<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: false");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../includes/db.php';
include_once '../includes/availability-controller.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$conn->set_charset('utf8');

$json = file_get_contents('php://input');
$data = json_decode($json);

if (!empty($data->id_peluquero) && !empty($data->disponibilidades)) {
    $disponibilidades = json_decode(json_encode($data->disponibilidades), true);

    foreach ($disponibilidades as &$disp) {
        if (!empty($disp['esRango']) && $disp['esRango']) {
            $disp['fecha_inicio'] = date('Y-m-d', strtotime($disp['fecha_inicio']));
            $disp['fecha_fin'] = date('Y-m-d', strtotime($disp['fecha_fin']));
        } else {
            $disp['fecha_disponible'] = date('Y-m-d', strtotime($disp['fecha_disponible']));
        }
    }

    $controller = new AvailabilityController($conn);

    try {
        $conn->begin_transaction();

        // 🔹 Guardar en tablas de disponibilidad
        $controller->saveAvailability($data->id_peluquero, $disponibilidades);

        // 🔹 Guardar también en tabla turno
        foreach ($disponibilidades as $disp) {
            if (!empty($disp['esRango']) && $disp['esRango']) {
                $fechaInicio = new DateTime($disp['fecha_inicio']);
                $fechaFin = new DateTime($disp['fecha_fin']);
                while ($fechaInicio <= $fechaFin) {
                    $fechaStr = $fechaInicio->format('Y-m-d');
                    $query = "INSERT INTO turno (id_peluquero, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)";
                    $stmt = $conn->prepare($query);
                    $stmt->bind_param("isss", $data->id_peluquero, $fechaStr, $disp['hora_inicial'], $disp['hora_final']);
                    $stmt->execute();
                    $fechaInicio->modify('+1 day');
                }
            } else {
                $query = "INSERT INTO turno (id_peluquero, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("isss", $data->id_peluquero, $disp['fecha_disponible'], $disp['hora_inicial'], $disp['hora_final']);
                $stmt->execute();
            }
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(["message" => "Disponibilidades y turnos guardados correctamente.", "data" => $disponibilidades]);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["message" => "Error al guardar disponibilidades y turnos: " . $e->getMessage()]);
    }
}

$conn->close();
?>
