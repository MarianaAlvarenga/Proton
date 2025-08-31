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
        isset($data['nombre']) &&
        isset($data['apellido']) &&
        isset($data['email']) &&
        isset($data['telefono']) &&
        isset($data['rol']) &&
        isset($data['id_usuario'])
    ) {
        $id = intval($data['id_usuario']);
        $nombre = $conn->real_escape_string($data['nombre']);
        $apellido = $conn->real_escape_string($data['apellido']);
        $email = $conn->real_escape_string($data['email']);
        $telefono = $conn->real_escape_string($data['telefono']);
        $rol = intval($data['rol']);

        $contrasenia = null;
        if (isset($data['contrasenia']) && !empty($data['contrasenia'])) {
            $hashedPass = password_hash($data['contrasenia'], PASSWORD_BCRYPT);
            $contrasenia = $conn->real_escape_string($hashedPass);
        }

        if ($contrasenia !== null) {
            $query = "UPDATE usuario SET nombre = ?, apellido = ?, email = ?, telefono = ?, rol = ?, contrasenia = ? WHERE id_usuario = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssssisi", $nombre, $apellido, $email, $telefono, $rol, $contrasenia, $id);
        } else {
            $query = "UPDATE usuario SET nombre = ?, apellido = ?, email = ?, telefono = ?, rol = ? WHERE id_usuario = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssssii", $nombre, $apellido, $email, $telefono, $rol, $id);
        }

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al actualizar el usuario: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Datos incompletos para actualizar el usuario"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}

$conn->close();
?>
