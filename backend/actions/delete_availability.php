<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Error de conexión: " . $conn->connect_error]);
    exit();
}
$conn->set_charset('utf8');

$json = file_get_contents('php://input');
$data = json_decode($json);

if (empty($data->id_peluquero) || empty($data->fecha_disponible) || empty($data->hora_inicial) || empty($data->hora_final)) {
    http_response_code(400);
    echo json_encode(["message" => "Datos incompletos"]);
    exit();
}

$id_peluquero = intval($data->id_peluquero);
$fecha_disponible = $data->fecha_disponible;
$hora_inicial = $data->hora_inicial;
$hora_final = $data->hora_final;

try {
    $conn->begin_transaction();

    // 🔹 Borrar de turno solo el horario específico
    $stmt = $conn->prepare("DELETE FROM turno WHERE id_peluquero = ? AND fecha = ? AND hora_inicio = ? AND hora_fin = ?");
    $stmt->bind_param("isss", $id_peluquero, $fecha_disponible, $hora_inicial, $hora_final);
    $stmt->execute();

    // 🔹 Buscar el id del día
    $stmt = $conn->prepare("SELECT id_dias_disponibles FROM dias_disponibles WHERE fecha_disponible = ?");
    $stmt->bind_param("s", $fecha_disponible);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $id_dia = $row['id_dias_disponibles'];

        // 🔹 Borrar solo el horario seleccionado de dias_horas_disponibles
        $stmt = $conn->prepare("DELETE dhd FROM dias_horas_disponibles dhd
                                JOIN horas_disponibles hd ON dhd.id_horario_disponible = hd.id_horario_disponible
                                WHERE dhd.id_dias_disponibles = ? 
                                AND TIME(hd.hora_inicial) = ? 
                                AND TIME(hd.hora_final) = ?");
        $stmt->bind_param("iss", $id_dia, $hora_inicial, $hora_final);
        $stmt->execute();

        // 🔹 Borrar horas_disponibles si ya no tiene relaciones
        $stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM dias_horas_disponibles WHERE id_horario_disponible = (
                                    SELECT id_horario_disponible FROM horas_disponibles WHERE TIME(hora_inicial) = ? AND TIME(hora_final) = ?
                                )");
        $stmt->bind_param("ss", $hora_inicial, $hora_final);
        $stmt->execute();
        $countHoras = $stmt->get_result()->fetch_assoc()['cnt'];
        if ($countHoras == 0) {
            $stmt = $conn->prepare("DELETE FROM horas_disponibles WHERE TIME(hora_inicial) = ? AND TIME(hora_final) = ?");
            $stmt->bind_param("ss", $hora_inicial, $hora_final);
            $stmt->execute();
        }

        // 🔹 Solo borrar relación peluquero-día si ya no quedan horarios
        $stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM dias_horas_disponibles WHERE id_dias_disponibles = ?");
        $stmt->bind_param("i", $id_dia);
        $stmt->execute();
        $countDias = $stmt->get_result()->fetch_assoc()['cnt'];
        if ($countDias == 0) {
            // borrar relación peluquero-día
            $stmt = $conn->prepare("DELETE FROM tiene_dias WHERE id_usuario = ? AND id_dias_disponibles = ?");
            $stmt->bind_param("ii", $id_peluquero, $id_dia);
            $stmt->execute();

            // borrar día si no tiene más relaciones
            $stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM tiene_dias WHERE id_dias_disponibles = ?");
            $stmt->bind_param("i", $id_dia);
            $stmt->execute();
            $countRel = $stmt->get_result()->fetch_assoc()['cnt'];
            if ($countRel == 0) {
                $stmt = $conn->prepare("DELETE FROM dias_disponibles WHERE id_dias_disponibles = ?");
                $stmt->bind_param("i", $id_dia);
                $stmt->execute();
            }
        }
    }

    $conn->commit();
    http_response_code(200);
    echo json_encode(["message" => "Horario eliminado correctamente"]);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["message" => "Error al eliminar horario: " . $e->getMessage()]);
}

$conn->close();
?>
