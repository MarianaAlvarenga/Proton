<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once __DIR__ . '/../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if (!isset($_GET['petId'])) {
    http_response_code(400);
    die(json_encode(["error" => "Se requiere petId"]));
}

$petId = (int)$_GET['petId'];
if ($petId <= 0) {
    http_response_code(400);
    die(json_encode(["error" => "petId inválido"]));
}

$stmt = $conn->prepare("SELECT img_url FROM mascota WHERE id_mascota = ?");
$stmt->bind_param("i", $petId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(["img_url" => $row['img_url']]);
} else {
    echo json_encode(["img_url" => null]);
}

$stmt->close();
$conn->close();
?>