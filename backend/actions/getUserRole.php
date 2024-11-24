<?php


header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejo de solicitudes preflight (opcional)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
// Conexión a la base de datos
$host = "localhost:3307";
$dbname = "proton";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al conectar con la base de datos: " . $e->getMessage()
    ]);
    exit;
}

// Verificar si el usuario está autenticado (ejemplo: utilizando sesiones)
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Usuario no autenticado"
        "debug" => $_SESSION // Agregar esto para inspeccionar la sesión

    ]);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // Consulta para obtener el rol del usuario
    $stmt = $pdo->prepare("SELECT rol FROM usuario WHERE id = :id");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $userRole = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userRole) {
        echo json_encode([
            "success" => true,
            "role" => $userRole['rol'] // Devuelve el ID del rol
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Rol no encontrado para este usuario"
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener el rol del usuario: " . $e->getMessage()
    ]);
}
