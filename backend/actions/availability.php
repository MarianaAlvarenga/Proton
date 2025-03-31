<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: false");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../includes/db.php';
include_once '../includes/availability-controller.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$conn->set_charset('utf8');

$json = file_get_contents('php://input');
$data = json_decode($json);

if(!empty($data->id_peluquero) && !empty($data->disponibilidades)) {
    $disponibilidades = json_decode(json_encode($data->disponibilidades), true);
    
    $controller = new AvailabilityController($conn);
    $response = $controller->saveAvailability($data->id_peluquero, $disponibilidades);
    
    http_response_code($response['status']);
    echo json_encode($response);
} else {
    http_response_code(400);
    echo json_encode(["message" => "Datos incompletos."]);
}

$conn->close();
?>