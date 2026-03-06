<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../includes/db.php";

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}
$conn->set_charset("utf8");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["servicios"])) {
    http_response_code(400);
    echo json_encode(["error" => "No llegaron servicios"]);
    exit;
}

foreach ($data["servicios"] as $servicio) {
    if (!isset($servicio["id_servicio"], $servicio["precio"])) {
        continue;
    }

    $id = (int)$servicio["id_servicio"];
    $precio = (float)$servicio["precio"];

    $stmt = $conn->prepare(
        "UPDATE servicio SET precio = ? WHERE id_servicio = ?"
    );

    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit;
    }

    $stmt->bind_param("di", $precio, $id);
    $stmt->execute();
}

echo json_encode(["success" => true]);
