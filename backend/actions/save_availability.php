<?php
require_once '../includes/session_config.php';

header("Content-Type: application/json; charset=UTF-8");



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

if (empty($data->id_peluquero) || empty($data->disponibilidad)) {
    http_response_code(400);
    echo json_encode(["message" => "Datos incompletos"]);
    exit();
}

try {
    $conn->begin_transaction();

    foreach ($data->disponibilidad as $disp) {
        $fecha = $disp->fecha_disponible;
        $hora_inicio = $disp->hora_inicial;
        $hora_fin = $disp->hora_final;

        // Insertar día disponible
        $stmt = $conn->prepare("INSERT INTO dias_disponibles (fecha_disponible) VALUES (?)");
        $stmt->bind_param("s", $fecha);
        $stmt->execute();
        $id_dias_disponibles = $stmt->insert_id;
        $stmt->close();

        // Insertar horario disponible
        $stmt = $conn->prepare("INSERT INTO horas_disponibles (hora_inicial, hora_final) VALUES (?, ?)");
        $stmt->bind_param("ss", $hora_inicio, $hora_fin);
        $stmt->execute();
        $id_horario_disponible = $stmt->insert_id;
        $stmt->close();

        // Relacionar días con horarios
        $stmt = $conn->prepare("INSERT INTO dias_horas_disponibles (id_dias_disponibles, id_horario_disponible) VALUES (?, ?)");
        $stmt->bind_param("ii", $id_dias_disponibles, $id_horario_disponible);
        $stmt->execute();
        $stmt->close();

        // Relacionar peluquero con días
        $stmt = $conn->prepare("INSERT INTO tiene_dias (id_usuario, id_dias_disponibles) VALUES (?, ?)");
        $stmt->bind_param("ii", $data->id_peluquero, $id_dias_disponibles);
        $stmt->execute();
        $stmt->close();
    }

    $conn->commit();
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Disponibilidad guardada correctamente"]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al guardar disponibilidad: " . $e->getMessage()]);
}

$conn->close();
?>
