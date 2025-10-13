<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // <-- CAMBIAR URL DEL FRONTEND SI NO ES LOCALHOST
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

if (empty($data->id_peluquero) || empty($data->fecha) || empty($data->hora_inicio) || empty($data->hora_fin)) {
    http_response_code(400);
    echo json_encode(["message" => "Datos incompletos"]);
    exit();
}

try {
    // Obtener ID del cliente si existe
    $cliente_id = null;
    if (!empty($data->email_cliente)) {
        $query = "SELECT id_usuario FROM usuario WHERE email = ? AND rol = 1";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $data->email_cliente);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $cliente_id = $result->fetch_assoc()['id_usuario'];
        }
        $stmt->close();
    }

    // Insertar turno
    $stmt = $conn->prepare("INSERT INTO turno (fecha, hora_inicio, hora_fin, cliente_id, id_peluquero) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssii", $data->fecha, $data->hora_inicio, $data->hora_fin, $cliente_id, $data->id_peluquero);
    $stmt->execute();
    $stmt->close();

    http_response_code(200);
    echo json_encode(["message" => "Turno reservado correctamente"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error al reservar turno: " . $e->getMessage()]);
}

$conn->close();
?>
