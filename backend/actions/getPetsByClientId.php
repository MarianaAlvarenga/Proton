<?php
// Configuración de cookies para CORS - DEBE IR ANTES DE session_start()
require_once '../includes/session_config.php';


// Headers para evitar caché y asegurar respuesta JSON
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');

require_once '../includes/db.php';

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Obtener userId de la sesión o del parámetro GET
$userId = $_SESSION['user_id'] ?? $_GET['userId'] ?? null;

if (!$userId) {
    die(json_encode(["success" => false, "message" => "Usuario no autenticado"]));
}

try {
    $stmt = $pdo->prepare("SELECT * FROM mascota WHERE id_usuario = :id");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $mascotas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "mascotas" => $mascotas]);
    exit;
} catch (PDOException $e) {
    die(json_encode(["success" => false, "message" => "Error al obtener mascotas"]));
}
?>