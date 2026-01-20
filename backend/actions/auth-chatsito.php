<?php
require_once '../includes/session_config.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos: " . $conn->connect_error]);
    exit;
}
$conn->set_charset('utf8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 🚨 si llega FormData, no usamos php://input
    if (empty($_POST)) {
    $rawData = file_get_contents("php://input");
    $jsonData = json_decode($rawData, true);

    if (json_last_error() === JSON_ERROR_NONE && is_array($jsonData)) {
        $_POST = $jsonData;
    }
}

    $action = $_POST['action'] ?? $_GET['action'] ?? null;

/* 👇 si no llega acción, asumimos LOGIN (esto pasa solo cuando el front manda JSON simple desde el formulario de login) */
if (!$action) {
    $action = "login";
}

if ($action === 'register') {
    registerUser($_POST, $conn);
} elseif ($action === 'login') {
    loginUser($_POST, $conn);
} elseif ($action === 'update') {
    updateUser($_POST, $conn); // 👈 por si también lo manejás en este archivo
} else {
    echo json_encode(["success" => false, "message" => "Acción no válida"]);
}
}

$conn->close();

function guardarImagen($id_usuario) {
    if (!isset($_FILES["img"]) || $_FILES["img"]["error"] !== UPLOAD_ERR_OK) {
        return null;
    }

    $dir = "../uploads/users/";
    if (!file_exists($dir)) mkdir($dir, 0777, true);

    $ext = pathinfo($_FILES["img"]["name"], PATHINFO_EXTENSION);
    $fileName = "user_" . $id_usuario . "." . $ext;
    $path = $dir . $fileName;

    move_uploaded_file($_FILES["img"]["tmp_name"], $path);

    return "https://annotation-tue-static-inc.trycloudflare.com/backend/uploads/users/" . $fileName;
}

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

        $imgUrl = guardarImagen($newUserId);
        if ($imgUrl) {
            $conn->query("UPDATE usuario SET img_url='$imgUrl' WHERE id_usuario=$newUserId");
        }

        if ($rol === 3) {
            $especialidades = json_decode($data['especialidad'], true);

            if (!$especialidades || count($especialidades) === 0) {
                $conn->query("DELETE FROM usuario WHERE id_usuario = $newUserId");
                echo json_encode(["success" => false, "message" => "Peluqueros deben seleccionar al menos una especialidad"]);
                return;
            }

            foreach ($especialidades as $esp) {
                $espId = intval($esp);
                $conn->query("INSERT INTO peluquero_ofrece_servicio (peluquero_id_usuario, servicio_id_servicio) VALUES ($newUserId, $espId)");
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

    $query = "SELECT id_usuario, nombre, apellido, email, rol, contrasenia, img_url FROM usuario WHERE email = '$email'";
    $result = $conn->query($query);
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
        return;
    }

    $user = $result->fetch_assoc();
    if (password_verify($password, $user['contrasenia'])) {
        $_SESSION["currentUserId"] = $user["id_usuario"];
        $_SESSION["currentUserRole"] = $user["rol"];
        $_SESSION["currentUserName"] = $user["nombre"];

        unset($user['contrasenia']);

        echo json_encode([
            "success" => true,
            "message" => "Inicio de sesión exitoso",
            "user" => $user
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
}
?>
