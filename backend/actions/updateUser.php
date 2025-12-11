<?php
require_once '../includes/session_config.php';

header("Content-Type: application/json");

require_once '../includes/db.php';
$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 📌 AHORA SE LEE DE $_POST (porque usás FormData en React)
    if (
        isset($_POST['nombre']) &&
        isset($_POST['apellido']) &&
        isset($_POST['email']) &&
        isset($_POST['telefono']) &&
        isset($_POST['rol']) &&
        isset($_POST['id_usuario'])
    ) {

        $id = intval($_POST['id_usuario']);
        $nombre = $conn->real_escape_string($_POST['nombre']);
        $apellido = $conn->real_escape_string($_POST['apellido']);
        $email = $conn->real_escape_string($_POST['email']);
        $telefono = $conn->real_escape_string($_POST['telefono']);
        $rol = intval($_POST['rol']);

        // 🔹 Contraseña opcional
        $contrasenia = null;
        if (isset($_POST['contrasenia']) && !empty(trim($_POST['contrasenia']))) {
            $hashedPass = password_hash($_POST['contrasenia'], PASSWORD_BCRYPT);
            $contrasenia = $conn->real_escape_string($hashedPass);
        }

        // 🔹 Query dinámica (con o sin contraseña)
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

            // 🔹 Manejo de especialidades si es peluquero
            if ($rol === 3 && isset($_POST['especialidad'])) {

                // La especialidad llega como JSON desde React
                $especialidades = json_decode($_POST['especialidad'], true);

                if (!is_array($especialidades)) {
                    $especialidades = [];
                }

                // borrar las anteriores
                $conn->query("DELETE FROM peluquero_ofrece_servicio WHERE peluquero_id_usuario = $id");

                // insertar las nuevas
                foreach ($especialidades as $esp) {
                    $espId = intval($esp);
                    if ($espId > 0) {
                        $conn->query("INSERT INTO peluquero_ofrece_servicio (peluquero_id_usuario, servicio_id_servicio) VALUES ($id, $espId)");
                    }
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
