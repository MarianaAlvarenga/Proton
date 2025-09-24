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


header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$conn->set_charset('utf8');

$data = json_decode(file_get_contents("php://input"), true);

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
}

$conn->close();

function registerUser($data, $conn) {
    if (empty($data['nombre']) || empty($data['apellido']) || empty($data['email']) || empty($data['telefono']) || empty($data['contrasenia']) || empty($data['especialidad'])) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios"]);
        return;
    }

    $email = $conn->real_escape_string($data['email']);
    $checkEmailQuery = "SELECT * FROM usuario WHERE email = '$email'";
    $result = $conn->query($checkEmailQuery);

    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "El email ya está registrado"]);
        return;
    }

    $nombre = $conn->real_escape_string($data['nombre']);
    $apellido = $conn->real_escape_string($data['apellido']);
    $telefono = $conn->real_escape_string($data['telefono']);
    $rol = isset($data['rol']) ? intval($data['rol']) : 1;
    $hashedPassword = password_hash($data['contrasenia'], PASSWORD_BCRYPT);

    $insertQuery = "INSERT INTO usuario (nombre, apellido, telefono, email, rol, contrasenia) VALUES ('$nombre', '$apellido', '$telefono', '$email', '$rol', '$hashedPassword')";

if ($conn->query($insertQuery) === TRUE) {
    $newUserId = $conn->insert_id; // <-- ID del usuario recién creado

    // 🔹 Si el rol corresponde a "peluquero", insertamos en peluquero_ofrece_servicio
    if ($rol == 3 && !empty($data['especialidad'])) { // <-- asumí que rol=2 es peluquero
        $especialidad = intval($data['especialidad']);
        $insertRelacion = "INSERT INTO peluquero_ofrece_servicio (peluquero_id_usuario, servicio_id_servicio) 
                           VALUES ($newUserId, $especialidad)";
        if (!$conn->query($insertRelacion)) {
            echo json_encode(["success" => false, "message" => "Error al asignar especialidad: " . $conn->error]);
            return;
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