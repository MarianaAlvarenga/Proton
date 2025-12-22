<?php
require_once '../includes/session_config.php';
header("Content-Type: application/json");
require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// ✔️ SOLO validamos lo indispensable
$id = intval($data['id_mascota'] ?? 0);
$nombre_mascota = $data['nombre_mascota'] ?? '';

if ($id <= 0 || $nombre_mascota === '') {
    echo json_encode([
        "success" => false,
        "message" => "ID o nombre inválido"
    ]);
    exit;
}

// ✔️ Campos opcionales (pueden venir vacíos)
$fecha_nacimiento = $data['fecha_nacimiento'] ?? null;
$raza = $data['raza'] ?? null;
$peso = $data['peso'] !== '' ? $data['peso'] : null;
$tamanio = $data['tamanio'] ?? null;
$largo_pelo = $data['largo_pelo'] ?? null;
$especie = $data['especie'] ?? null;
$sexo = $data['sexo'] ?? null;
$color = $data['color'] ?? null;
$detalle = $data['detalle'] !== '' ? $data['detalle'] : null;

$query = "
    UPDATE mascota SET
        nombre_mascota = ?,
        fecha_nacimiento = ?,
        raza = ?,
        peso = ?,
        tamanio = ?,
        largo_pelo = ?,
        especie = ?,
        sexo = ?,
        color = ?,
        detalle = ?
    WHERE id_mascota = ?
";

$stmt = $conn->prepare($query);
$stmt->bind_param(
    "ssssssssssi",
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
    $id
);

$stmt->execute();

// 🔥 CLAVE para debug real
if ($stmt->affected_rows >= 0) {
    echo json_encode([
        "success" => true,
        "message" => "Mascota actualizada"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
