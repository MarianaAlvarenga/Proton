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

    // ───── Validar error de subida ─────
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Error en la carga del archivo: código " . $file['error'], 400);
    }

    // ───── Validar tipo MIME REAL ─────
    $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception("Tipo de archivo no permitido. Solo JPEG y PNG", 400);
    }

    // ───── Configurar carpeta uploads (MODO VIEJO) ─────
    $uploadDir = realpath(__DIR__ . '/../uploads');

    if ($uploadDir === false) {
        if (!mkdir(__DIR__ . '/../uploads', 0755, true)) {
            throw new Exception("No se pudo crear directorio uploads", 500);
        }
        $uploadDir = realpath(__DIR__ . '/../uploads');
    }

    if (!is_writable($uploadDir)) {
        throw new Exception("El directorio uploads no tiene permisos de escritura", 500);
    }

    $uploadDir .= DIRECTORY_SEPARATOR;

    // ───── Generar nombre único ─────
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (empty($extension)) {
        $extension = ($mimeType === 'image/png') ? 'png' : 'jpg';
    }

    $filename = uniqid('petimg_', true) . '.' . $extension;
    $targetPath = $uploadDir . $filename;

    error_log("Guardando archivo en: $targetPath");

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception("Error al guardar archivo en servidor", 500);
    }

    chmod($targetPath, 0644);

    // ───── Conexión BD ─────
    $conn = new mysqli($servername, $username, $password, $dbname, $port);
    if ($conn->connect_error) {
        unlink($targetPath);
        throw new Exception("Error de conexión a base de datos", 500);
    }

    $conn->set_charset('utf8');

    // ───── Guardar SOLO filename en BD (MODO VIEJO) ─────
    $stmt = $conn->prepare("UPDATE mascota SET img_url = ? WHERE id_mascota = ?");
    if (!$stmt) {
        unlink($targetPath);
        throw new Exception("Error preparando consulta SQL", 500);
    }

    $stmt->bind_param("si", $filename, $petId);

    if (!$stmt->execute()) {
        $stmt->close();
        $conn->close();
        unlink($targetPath);
        throw new Exception("Error ejecutando consulta SQL", 500);
    }

    if ($stmt->affected_rows === 0) {
        $stmt->close();
        $conn->close();
        unlink($targetPath);
        throw new Exception("No se encontró la mascota para actualizar", 404);
    }

    $stmt->close();
    $conn->close();

    error_log("Imagen subida correctamente para mascota $petId");

    echo json_encode([
        'success' => true,
        'img_url' => $filename,
        'message' => 'Imagen actualizada correctamente'
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() >= 400 ? $e->getCode() : 500);
    error_log("ERROR en upload_pet_image.php: " . $e->getMessage());

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
}
