<?php
require_once '../includes/session_config.php';

header("Content-Type: application/json");

require_once '../includes/db.php';
$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]));
}

// 🔥 FORM DATA — NO JSON
$data = $_POST;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (
        isset($data['nombre']) &&
        isset($data['apellido']) &&
        isset($data['email']) &&
        isset($data['telefono']) &&
        isset($data['rol']) &&
        isset($data['id_usuario'])
        // 🔥 Eliminé especialidades porque NO siempre aplica y NO viene en FormData
    ) {
        $id = intval($data['id_usuario']);
        $nombre = $conn->real_escape_string($data['nombre']);
        $apellido = $conn->real_escape_string($data['apellido']);
        $email = $conn->real_escape_string($data['email']);
        $telefono = $conn->real_escape_string($data['telefono']);
        $rol = intval($data['rol']);

        // 🔥 Inicializamos esta variable SIEMPRE
        $contrasenia = null;

        // 🔥 Solo actualizar si viene una nueva contraseña
        if (isset($data['contrasenia']) && !empty(trim($data['contrasenia']))) {
            $hashedPass = password_hash($data['contrasenia'], PASSWORD_BCRYPT);
            $contrasenia = $conn->real_escape_string($hashedPass);
        }

        // 🔥 Eliminado console.log() (NO existe en PHP y rompe todo)
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
            // 🔹 Actualizar especialidades peluquero
            if ($rol === 3 && isset($data['especialidad'])) {
                $conn->query("DELETE FROM peluquero_ofrece_servicio WHERE peluquero_id_usuario = $id");

                $especialidades = is_array($data['especialidad']) ? $data['especialidad'] : [$data['especialidad']];
                foreach ($especialidades as $esp) {
                    $espId = intval($esp);
                    if ($espId <= 0) continue;
                    $conn->query("INSERT INTO peluquero_ofrece_servicio (peluquero_id_usuario, servicio_id_servicio) VALUES ($id, $espId)");
                }
            }

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
