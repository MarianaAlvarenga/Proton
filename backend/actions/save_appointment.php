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

$data = json_decode(file_get_contents('php://input'), true);

if (
    empty($data['id_peluquero']) ||
    empty($data['fecha']) ||
    empty($data['hora_inicio']) ||
    empty($data['hora_fin']) ||
    empty($data['userRole'])
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

try {
    // 👤 Cliente
    if ($data['userRole'] == 1) {
        $cliente_id = $data['id'];
    } else {
        if (empty($data['email_cliente'])) {
            throw new Exception("Cliente inválido.");
        }

        $stmt = $conn->prepare("SELECT id_usuario FROM usuario WHERE email = ? AND rol = 1");
        $stmt->bind_param("s", $data['email_cliente']);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$row) {
            throw new Exception("Cliente inválido.");
        }

        $cliente_id = $row['id_usuario'];
    }

    // 💾 Insertar turno
    $stmt = $conn->prepare("
        INSERT INTO turno (fecha, hora_inicio, hora_fin, cliente_id, id_peluquero)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "sssii",
        $data['fecha'],
        $data['hora_inicio'],
        $data['hora_fin'],
        $cliente_id,
        $data['id_peluquero']
    );
    $stmt->execute();
    $stmt->close();

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
