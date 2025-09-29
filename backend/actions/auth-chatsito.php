<?php
// Configuración de cookies para CORS
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);
session_start();

// 🔹 Mostrar errores para debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos: " . $conn->connect_error]);
    exit;
}
$conn->set_charset('utf8');

$input = file_get_contents("php://input");
$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "Error en el formato JSON: " . json_last_error_msg()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($data['action'])) {
        switch ($data['action']) {
            case 'register':
                registerUser($data, $conn);
                break;
            case 'login':
                loginUser($data, $conn);
                break;
            default:
                echo json_encode(["success" => false, "message" => "Acción no válida"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Acción no especificada"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}

$conn->close();

function registerUser($data, $conn) {
    if (!isset($data['rol'])) {
        echo json_encode(["success" => false, "message" => "Campo 'rol' no especificado"]);
        return;
    }

    $rol = intval($data['rol']);
    $camposRequeridos = ['nombre', 'apellido', 'email', 'telefono', 'contrasenia'];
    foreach ($camposRequeridos as $campo) {
        if (empty($data[$campo])) {
            echo json_encode(["success" => false, "message" => "El campo '$campo' es obligatorio"]);
            return;
        }
    }

    $email = $conn->real_escape_string(trim($data['email']));
    $checkEmailQuery = "SELECT id_usuario FROM usuario WHERE email = '$email'";
    $result = $conn->query($checkEmailQuery);
    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "El email ya está registrado"]);
        return;
    }

    $nombre = $conn->real_escape_string(trim($data['nombre']));
    $apellido = $conn->real_escape_string(trim($data['apellido']));
    $telefono = $conn->real_escape_string(trim($data['telefono']));
    $hashedPassword = password_hash($data['contrasenia'], PASSWORD_BCRYPT);

    $insertQuery = "INSERT INTO usuario (nombre, apellido, telefono, email, rol, contrasenia) 
                    VALUES ('$nombre', '$apellido', '$telefono', '$email', '$rol', '$hashedPassword')";
    if ($conn->query($insertQuery) === TRUE) {
        $newUserId = $conn->insert_id;

        // Si es peluquero, insertar especialidades
        if ($rol === 3) {
            if (!isset($data['especialidad']) || empty($data['especialidad'])) {
                $conn->query("DELETE FROM usuario WHERE id_usuario = $newUserId");
                echo json_encode(["success" => false, "message" => "Los peluqueros deben seleccionar al menos una especialidad"]);
                return;
            }

            $especialidades = is_array($data['especialidad']) ? $data['especialidad'] : [$data['especialidad']];
            foreach ($especialidades as $esp) {
                $espId = intval($esp);
                if ($espId <= 0) {
                    $conn->query("DELETE FROM usuario WHERE id_usuario = $newUserId");
                    echo json_encode(["success" => false, "message" => "ID de especialidad inválido: $esp"]);
                    return;
                }

                $insertRelacion = "INSERT INTO peluquero_ofrece_servicio (peluquero_id_usuario, servicio_id_servicio) 
                                   VALUES ($newUserId, $espId)";
                if (!$conn->query($insertRelacion)) {
                    $conn->query("DELETE FROM usuario WHERE id_usuario = $newUserId");
                    echo json_encode(["success" => false, "message" => "Error al asignar especialidad: " . $conn->error]);
                    return;
                }
            }
        }

        echo json_encode([
            "success" => true,
            "message" => "Usuario registrado correctamente",
            "id_usuario" => $newUserId
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar el usuario: " . $conn->error]);
    }
}

function loginUser($data, $conn) {
    if (empty($data['email']) || empty($data['contrasenia'])) {
        echo json_encode(["success" => false, "message" => "Email y contraseña son obligatorios"]);
        return;
    }

    $email = $conn->real_escape_string($data['email']);
    $password = $data['contrasenia'];

    $query = "SELECT id_usuario, nombre, apellido, email, rol, contrasenia FROM usuario WHERE email = '$email'";
    $result = $conn->query($query);
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
        return;
    }

    $user = $result->fetch_assoc();
    if (password_verify($password, $user['contrasenia'])) {
        $_SESSION['user_id'] = $user['id_usuario'];
        $_SESSION['user_name'] = $user['nombre'];
        $_SESSION['user_role'] = $user['rol'];

        unset($user['contrasenia']);

        echo json_encode([
            "success" => true,
            "message" => "Inicio de sesión exitoso",
            "user" => [
                "id_usuario" => $user['id_usuario'],
                "rol" => $user['rol'],
                "nombre" => $user['nombre']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
}
?>
