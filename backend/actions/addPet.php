<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/db.php';
$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (
        isset($data['nombre_mascota']) &&
        isset($data['fecha_nacimiento']) &&
        isset($data['raza']) &&
        isset($data['especie']) &&
        isset($data['sexo']) &&
        isset($data['id_usuario'])
    ) {
        // Campos esperados (según tu tabla)
        $id_usuario = intval($data['id_usuario']);
        $nombre_mascota = $conn->real_escape_string($data['nombre_mascota']);
        $fecha_nacimiento = $conn->real_escape_string($data['fecha_nacimiento']);
        $raza = $conn->real_escape_string($data['raza']);
        $peso = $conn->real_escape_string($data['peso']);
        $tamanio = $conn->real_escape_string($data['tamanio']);
        $largo_pelo = $conn->real_escape_string($data['largo_pelo']);
        $especie = $conn->real_escape_string($data['especie']);
        $sexo = $conn->real_escape_string($data['sexo']);
        $color = $conn->real_escape_string($data['color']);
        $detalle = $conn->real_escape_string($data['detalle']);
        $img_url = $conn->real_escape_string($data['img_url']);
    } else {
        echo json_encode(["success" => false, "message" => "Datos incompletos para actualizar el usuario"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}

if (!$id_usuario) {
    echo json_encode(['success' => false, 'message' => 'id_usuario es requerido']);
    exit;
}

// Insertar en la tabla mascota
try {
    // Insertar en la tabla mascota con MySQLi
    $sql = "INSERT INTO mascota (id_usuario, nombre_mascota, fecha_nacimiento, raza, peso, tamanio, largo_pelo, especie, sexo, color, detalle, img_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param(
        "isssssssssss",
        $id_usuario,
        $nombre_mascota,
        $fecha_nacimiento,
        $raza,
        $peso,
        $tamanio,
        $largo_pelo,
        $especie,
        $sexo,
        $color,
        $detalle,
        $img_url
    );

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Mascota agregada correctamente',
            'id_mascota' => $stmt->insert_id,
            'img_url' => $img_url
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al insertar: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    exit;

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al insertar: ' . $e->getMessage()]);
    exit;
}