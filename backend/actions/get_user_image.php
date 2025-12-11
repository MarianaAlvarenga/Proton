<?php
require_once '../includes/session_config.php';

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');


require_once __DIR__ . '/../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if (!isset($_GET['userId'])) {
    http_response_code(400);
    die(json_encode(["error" => "Se requiere userId"]));
}

$userId = (int)$_GET['userId'];
if ($userId <= 0) {
    http_response_code(400);
    die(json_encode(["error" => "userId inválido"]));
}

$stmt = $conn->prepare("SELECT img_url FROM usuario WHERE id_usuario = ?");
$stmt->bind_param("i", $userId);
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