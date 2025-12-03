<?php
require_once '../includes/session_config.php';

header("Content-Type: application/json; charset=UTF-8");

require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]);
    exit();
}
$conn->set_charset('utf8');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (empty($data['id_peluquero']) || empty($data['fecha']) || empty($data['hora_inicio']) || empty($data['hora_fin'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

try {
    $cliente_id = null;
    $id_usuario = null;

    // Si viene el mail del cliente (cuando reserva el admin)
    if (!empty($data['email_cliente'])) {
        $stmt = $conn->prepare("SELECT id_usuario FROM usuario WHERE email = ? AND rol = 1");
        $stmt->bind_param("s", $data['email_cliente']);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $cliente_id = $row['id_usuario'];
        }
        $stmt->close();
    } else {
        // Si no, el que reserva es el cliente logueado
        $cliente_id = $data['id'];
    }

    // Si el que reserva es admin, guardamos su id_usuario
    if (!empty($data['userRole']) && $data['userRole'] == 4) {
        $id_usuario = $data['id'];
    }

    if (empty($cliente_id)) {
        throw new Exception("No se encontró el cliente.");
    }

    $stmt = $conn->prepare("
        INSERT INTO turno (fecha, hora_inicio, hora_fin, cliente_id, id_peluquero, id_usuario)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssiii", $data['fecha'], $data['hora_inicio'], $data['hora_fin'], $cliente_id, $data['id_peluquero'], $id_usuario);
    $stmt->execute();
    $stmt->close();

    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Turno reservado correctamente"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al reservar turno: " . $e->getMessage()]);
}

$conn->close();
?>
