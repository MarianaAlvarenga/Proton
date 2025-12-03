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

try {
    // 🔹 Solo traer las especialidades (servicio)
    $query = "SELECT id_servicio, nombre FROM servicio ORDER BY nombre";
    $result = $conn->query($query);

    $especialidades = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $especialidades[] = $row;
        }
    }

    http_response_code(200);
    echo json_encode($especialidades);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error al obtener especialidades: " . $e->getMessage()]);
}

$conn->close();
?>
