<?php
require_once '../includes/session_config.php';
require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener el correo electrónico desde la solicitud
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
// Verificar si el correo electrónico está registrado
$sql = "SELECT * FROM usuario WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $response = ["exists" => true];
} else {
    $response = ["exists" => false];
}

// Devolver la respuesta en formato JSON
echo json_encode($response);

$conn->close();
?>