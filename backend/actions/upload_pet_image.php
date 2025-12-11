<?php
require_once '../includes/session_config.php';

header("Content-Type: application/json");


// Habilitar logging de errores
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/upload_errors.log');

require_once __DIR__ . '/../includes/db.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido, debe ser POST", 405);
    }

    if (empty($_FILES['image'])) {
        throw new Exception("No se recibió archivo 'image'", 400);
    }
    if (empty($_POST['petId'])) {
        throw new Exception("No se recibió 'petId'", 400);
    }

    $file = $_FILES['image'];
    $petId = (int)$_POST['petId'];

    if ($petId <= 0) {
        throw new Exception("petId inválido", 400);
    }

    error_log("Inicio subida imagen para petId: $petId");
    error_log("Archivo recibido: " . print_r($file, true));

    // Validar tipo
    $allowedTypes = ['image/jpeg', 'image/png'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception("Tipo de archivo no permitido. Solo JPEG y PNG", 400);
    }

    // Validar error de upload PHP
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Error en la carga del archivo: código " . $file['error'], 400);
    }

    // Configuración carpeta uploads
    $uploadDir = realpath(__DIR__ . '/../uploads') . DIRECTORY_SEPARATOR;
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception("No se pudo crear directorio uploads", 500);
        }
    }

    // Generar nombre único para la imagen
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('petimg_', true) . '.' . $extension;
    $targetPath = $uploadDir . $filename;

    error_log("Guardando archivo en: $targetPath");

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        error_log("move_uploaded_file falló para archivo temporal: " . $file['tmp_name']);
        throw new Exception("Error al guardar archivo en servidor", 500);
    }

    // Conectar base
    $conn = new mysqli($servername, $username, $password, $dbname, $port);
    if ($conn->connect_error) {
        error_log("Error de conexión a BD: " . $conn->connect_error);
        unlink($targetPath);
        throw new Exception("Error de conexión a base de datos", 500);
    }

    // Preparar consulta
    $stmt = $conn->prepare("UPDATE mascota SET img_url = ? WHERE id_mascota = ?");
    if (!$stmt) {
        error_log("Error preparando consulta: " . $conn->error);
        unlink($targetPath);
        throw new Exception("Error preparando consulta SQL", 500);
    }

    $stmt->bind_param("si", $filename, $petId);

    if (!$stmt->execute()) {
        error_log("Error ejecutando consulta: " . $stmt->error);
        unlink($targetPath);
        throw new Exception("Error ejecutando consulta SQL", 500);
    }

    if ($stmt->affected_rows === 0) {
        error_log("No se actualizó registro para mascota $petId");
        unlink($targetPath);
        throw new Exception("No se encontró la mascota para actualizar", 404);
    }

    $stmt->close();
    $conn->close();

    error_log("Imagen subida y DB actualizada correctamente para petId $petId");

    echo json_encode([
        'success' => true,
        'img_url' => $filename,
        'message' => 'Imagen actualizada correctamente'
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    error_log("ERROR en upload_pet_image.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
}
