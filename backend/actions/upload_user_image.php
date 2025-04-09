<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// Habilitar logging de errores
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/upload_errors.log');

require_once __DIR__ . '/../includes/db.php';

try {
    // Validaciones básicas
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido", 405);
    }

    if (empty($_FILES['image']) || empty($_POST['userId'])) {
        throw new Exception("Datos incompletos", 400);
    }

    // Configuración de directorio (USANDO RUTAS ABSOLUTAS)
    $uploadDir = realpath(__DIR__ . '/../uploads') . DIRECTORY_SEPARATOR;
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception("No se pudo crear directorio uploads", 500);
        }
    }

    // Procesar imagen
    $file = $_FILES['image'];
    $userId = (int)$_POST['userId'];
    $allowedTypes = ['image/jpeg', 'image/png'];
    
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception("Solo se permiten JPEG y PNG", 400);
    }

    // Generar nombre único
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $targetPath = $uploadDir . $filename;

    // Debug: Verificar antes de mover
    error_log("Intentando mover archivo a: $targetPath");

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception("Error al guardar archivo", 500);
    }

    // Actualizar base de datos
    $conn = new mysqli($servername, $username, $password, $dbname, $port);
    if ($conn->connect_error) {
        unlink($targetPath);
        throw new Exception("Error de conexión a BD", 500);
    }

    $stmt = $conn->prepare("UPDATE usuario SET img_url = ? WHERE id_usuario = ?");
    if (!$stmt) {
        unlink($targetPath);
        throw new Exception("Error preparando consulta", 500);
    }

    $stmt->bind_param("si", $filename, $userId);
    
    if (!$stmt->execute()) {
        unlink($targetPath);
        throw new Exception("Error ejecutando consulta", 500);
    }

    // Éxito
    echo json_encode([
        'success' => true,
        'img_url' => $filename,
        'message' => 'Imagen actualizada'
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    error_log("ERROR: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
}