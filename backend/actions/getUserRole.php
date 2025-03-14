<?php
header("Access-Control-Allow-Origin: http://localhost:3000");

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuración de base de datos
$host = "localhost:3306";
$dbname = "proton";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al conectar con la base de datos."
    ]);
    exit;
}

// Manejo de sesión


var_dump($_SESSION); // Esto te ayudará a ver si 'user_id' está en la sesión
error_log(session_save_path());
error_log(json_encode($_SESSION));


if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Usuario no autenticado."
    ]);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // Consulta para obtener el rol del usuario
    $stmt = $pdo->prepare("SELECT rol FROM usuario WHERE id_usuario = :id");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $userRole = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userRole) {
        echo json_encode([
            "success" => true,
            "role" => (int) $userRole['rol'] // Devuelve el ID del rol como número
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Rol no encontrado."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener el rol: " . $e->getMessage()
    ]);
}
?>
