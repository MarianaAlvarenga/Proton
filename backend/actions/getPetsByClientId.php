<?php
session_start(); // Moverlo después de los headers

error_log("🔍 Session ID: " . session_id());
error_log("📢 Contenido de \$_SESSION: " . json_encode($_SESSION));

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../includes/db.php';

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

// Debug: Verificar si la sesión contiene user_id
error_log("Sesión activa: " . json_encode($_SESSION));
error_log("Session ID: " . session_id());

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Usuario no autenticado"]);
    exit;
}

$userId = $_SESSION['user_id'];


try {
    $stmt = $pdo->prepare("SELECT * FROM mascota WHERE id_usuario = :id");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $mascotas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "mascotas" => $mascotas]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error al obtener mascotas: " . $e->getMessage()]);
}
?>
