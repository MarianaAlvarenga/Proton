<?php
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
        isset($data['tamanio']) &&
        isset($data['largo_pelo']) &&
        isset($data['especie']) &&
        isset($data['sexo']) &&
        isset($data['color']) 
    ) {
        $id = intval($data['id_mascota']);
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

        $query = "UPDATE mascota SET nombre_mascota = ?, fecha_nacimiento = ?, raza = ?, peso = ?, tamanio = ?, largo_pelo = ?, especie = ?,
                 sexo = ?, color = ?, detalle = ? WHERE id_mascota = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssssssssi", $nombre_mascota, $fecha_nacimiento, $raza, $peso, $tamanio, $largo_pelo, $especie, 
                        $sexo, $color, $detalle, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Mascota actualizada correctamente"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al actualizar la mascota: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Datos incompletos para actualizar la mascota"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}

$conn->close();
?>
