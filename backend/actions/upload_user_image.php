<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Debug: Verificar headers enviados
error_log("Headers enviados: " . print_r(headers_list(), true));

require_once __DIR__ . '/../includes/db.php';

// VERIFICAR MÉTODO
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Método no permitido']));
}

// OBTENER DATOS
$userId = (int)($_POST['userId'] ?? 0);
$file = $_FILES['image'] ?? null;

// VALIDACIONES BÁSICAS
if ($userId <= 0 || !$file || $file['error'] !== UPLOAD_ERR_OK) {
    ob_end_clean();
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'Datos inválidos']));
}

try {
    // CONFIGURAR CARPETA DE SUBIDAS
    $uploadDir = __DIR__ . '../uploads';
    if (!file_exists($uploadDir) {
        mkdir($uploadDir, 0777, true);
    }

    // GENERAR NOMBRE ÚNICO
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    if (!in_array($extension, $allowedExtensions)) {
        throw new Exception('Formato de imagen no permitido');
    }

    $fileName = uniqid() . '.' . $extension;
    $targetPath = $uploadDir . $fileName;

    // MOVER ARCHIVO
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception('Error al guardar el archivo');
    }

    // ACTUALIZAR BD
    $stmt = $conn->prepare("UPDATE usuario SET img_url = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception('Error preparando consulta: ' . $conn->error);
    }

    $stmt->bind_param("si", $fileName, $userId);
    
    if (!$stmt->execute()) {
        unlink($targetPath); // Eliminar archivo si falla la BD
        throw new Exception('Error ejecutando consulta: ' . $stmt->error);
    }

    // RESPUESTA EXITOSA
    ob_end_clean();
    echo json_encode([
        'success' => true,
        'img_url' => $fileName
    ]);

} catch (Exception $e) {
    // LIMPIAR BUFFER Y ENVIAR ERROR
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>