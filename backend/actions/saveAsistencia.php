<?php
require_once '../includes/session_config.php';
require_once '../includes/db.php';

header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit();
}
$conn->set_charset('utf8');

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data['id_turno']) ||
    !isset($data['asistio'])
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

$id_turno = intval($data['id_turno']);
$estado   = $data['asistio'] ? 'asistio' : 'no_asistio';
$hora_llegada = $data['hora_llegada'] ?? null;
$hora_fin     = $data['hora_finalizacion'] ?? null;
$obs          = $data['observaciones'] ?? null;

/* Verificar si ya existe asistencia */
$check = $conn->prepare("SELECT id_asistencia FROM asistencia WHERE id_turno = ?");
$check->bind_param("i", $id_turno);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    // UPDATE
    $stmt = $conn->prepare("
        UPDATE asistencia
        SET estado = ?, hora_de_llegada = ?, hora_de_finalizacion = ?, observaciones = ?
        WHERE id_turno = ?
    ");
    $stmt->bind_param("ssssi", $estado, $hora_llegada, $hora_fin, $obs, $id_turno);
} else {
    // INSERT
    $stmt = $conn->prepare("
        INSERT INTO asistencia (id_turno, estado, hora_de_llegada, hora_de_finalizacion, observaciones)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("issss", $id_turno, $estado, $hora_llegada, $hora_fin, $obs);
}

$stmt->execute();

echo json_encode(["success" => true]);

$stmt->close();
$conn->close();
