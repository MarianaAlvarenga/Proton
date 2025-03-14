<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Configuración de conexión a la base de datos
$servername = "localhost";
$username = "root";  // Cambia según tu configuración
$password = "";      // Cambia según tu configuración
$dbname = "proton";  // Nombre de tu base de datos
$port = 3306;        // Puerto definido en tu configuración XAMPP

$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]));
}

// Leer datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (
        isset($data['nombre']) &&
        isset($data['apellido']) &&
        isset($data['email']) &&
        isset($data['telefono']) &&
        isset($data['rol']) &&
        isset($data['id_usuario']) // Verifica que el ID esté presente
    ) {
        $id = intval($data['id_usuario']);
        $nombre = $conn->real_escape_string($data['nombre']);
        $apellido = $conn->real_escape_string($data['apellido']);
        $email = $conn->real_escape_string($data['email']);
        $telefono = $conn->real_escape_string($data['telefono']);
        $rol = intval($data['rol']);

        // Consulta para actualizar los datos del usuario
        $query = "UPDATE usuario SET nombre = ?, apellido = ?, email = ?, telefono = ?, rol = ? WHERE id_usuario = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssii", $nombre, $apellido, $email, $telefono, $rol, $id);

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
