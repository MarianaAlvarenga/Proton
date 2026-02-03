<?php
// 🔓 CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// 🧠 Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../config/db.php";


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
        "UPDATE especialidades SET precio = ? WHERE id_servicio = ?"
    );

    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit;
    }

    $stmt->bind_param("di", $precio, $id);
    $stmt->execute();
}

echo json_encode(["success" => true]);
