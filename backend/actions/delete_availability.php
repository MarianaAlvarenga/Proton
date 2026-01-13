<?php
require_once '../includes/session_config.php';
require_once '../includes/db.php';

header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli($servername, $username, $password, $dbname, $port);
$conn->set_charset('utf8');

$data = json_decode(file_get_contents('php://input'), true);

if (
    empty($data['id_peluquero']) ||
    empty($data['fecha']) ||
    empty($data['hora_inicio']) ||
    empty($data['hora_fin'])
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

try {
    $stmt = $conn->prepare("
        DELETE dhd
        FROM dias_horas_disponibles dhd
        JOIN dias_disponibles dd ON dd.id_dias_disponibles = dhd.id_dias_disponibles
        JOIN horas_disponibles hd ON hd.id_horario_disponible = dhd.id_horario_disponible
        WHERE dhd.id_usuario = ?
          AND dd.fecha_disponible = ?
          AND hd.hora_inicial = ?
          AND hd.hora_final = ?
    ");
    $stmt->bind_param(
        "isss",
        $data['id_peluquero'],
        $data['fecha'],
        $data['hora_inicio'],
        $data['hora_fin']
    );
    $stmt->execute();

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
