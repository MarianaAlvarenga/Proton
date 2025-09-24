<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
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
