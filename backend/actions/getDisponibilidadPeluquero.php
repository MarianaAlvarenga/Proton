<?php
require_once '../includes/session_config.php';
header("Content-Type: application/json");


require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([]);
    exit();
}
$conn->set_charset('utf8');

$id_usuario = intval($_GET['id_usuario'] ?? 0);
if (!$id_usuario) { 
    echo json_encode([]); 
    exit(); 
}

// Tabla 'turnos' con columnas: fecha_disponible, hora_inicial, hora_final, estado
$sql = "SELECT fecha_disponible, hora_inicial, hora_final 
        FROM turnos 
        WHERE peluquero_id_usuario = ? AND estado = 'disponible'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

$eventos = [];
while ($row = $result->fetch_assoc()) {
    $eventos[] = [
        "title" => "Disponible",
        "start" => $row['fecha_disponible'] . 'T' . $row['hora_inicial'],
        "end"   => $row['fecha_disponible'] . 'T' . $row['hora_final']
    ];
}

echo json_encode($eventos);

$stmt->close();
$conn->close();
