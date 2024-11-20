<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root"; // Cambia según tu configuración
$password = ""; // Cambia según tu configuración
$dbname = "proton";
$port = 3307; // Puerto definido en tu configuración XAMPP

$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]));
}

// Leer datos del cuerpo de la solicitud
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
    // Validar datos
    if (empty($data['nombre']) || empty($data['apellido']) || empty($data['email']) || empty($data['telefono']) || empty($data['contrasenia'])) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios"]);
        return;
    }

    // Verificar si el email ya existe
    $email = $conn->real_escape_string($data['email']);
    $checkEmailQuery = "SELECT * FROM usuario WHERE email = '$email'";
    $result = $conn->query($checkEmailQuery);

    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "El email ya está registrado"]);
        return;
    }

    // Insertar usuario
    $nombre = $conn->real_escape_string($data['nombre']);
    $apellido = $conn->real_escape_string($data['apellido']);
    $telefono = $conn->real_escape_string($data['telefono']);
    $rol = 1; // Rol por defecto
    $hashedPassword = password_hash($data['contrasenia'], PASSWORD_BCRYPT);

    $insertQuery = "INSERT INTO usuario (nombre, apellido, telefono, email, rol, contrasenia) VALUES ('$nombre', '$apellido', '$telefono', '$email', '$rol', '$hashedPassword')";

    if ($conn->query($insertQuery) === TRUE) {
        echo json_encode(["success" => true, "message" => "Usuario registrado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar el usuario: " . $conn->error]);
    }
}

function loginUser($data, $conn) {
    // Validar datos
    if (empty($data['email']) || empty($data['contrasenia'])) {
        echo json_encode(["success" => false, "message" => "Email y contraseña son obligatorios"]);
        return;
    }

    $email = $conn->real_escape_string($data['email']);
    $password = $data['contrasenia'];

    // Verificar usuario
    $query = "SELECT * FROM usuario WHERE email = '$email'";
    $result = $conn->query($query);

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
        return;
    }

    $user = $result->fetch_assoc();

    if (password_verify($password, $user['contrasenia'])) {
        echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso", "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
}
?>