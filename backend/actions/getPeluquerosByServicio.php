<?php
// ---- CORS ----
require_once '../includes/session_config.php';


// ---- Contenido JSON ----
header("Content-Type: application/json");

// ---- Conexión a la DB ----
require_once '../includes/db.php'; // tu archivo de conexión

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$conn->set_charset('utf8');

// ---- Obtener parámetro ----
$id_servicio = intval($_GET['id_servicio'] ?? 0);

if (!$id_servicio) {
    echo json_encode([]);
    exit();
}

// ---- Query ----
$sql = "SELECT u.id_usuario, u.nombre, u.apellido
        FROM usuario u
        JOIN peluquero_ofrece_servicio ps ON u.id_usuario = ps.peluquero_id_usuario
        WHERE ps.servicio_id_servicio = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["message" => "Error en la preparación de la consulta: " . $conn->error]);
    exit();
}

$stmt->bind_param("i", $id_servicio);
$stmt->execute();

$result = $stmt->get_result();
$peluqueros = [];

while ($row = $result->fetch_assoc()) {
    $peluqueros[] = $row;
}

echo json_encode($peluqueros);

// ---- Cerrar conexión ----
$stmt->close();
$conn->close();
