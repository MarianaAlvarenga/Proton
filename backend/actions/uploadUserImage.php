<?php
require_once '../includes/session_config.php';


// Habilitar logging de errores
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/upload_errors.log');

// Verificar si el archivo de includes/db.php existe
if (!file_exists(__DIR__ . '/../includes/db.php')) {
    error_log("ERROR: No se encuentra el archivo db.php en la ruta: " . __DIR__ . '/../includes/db.php');
    echo json_encode([
        'success' => false,
        'message' => 'Error de configuración del servidor'
    ]);
    exit;
}

require_once __DIR__ . '/../includes/db.php';

// Función para enviar respuesta JSON consistente
function sendJsonResponse($success, $message, $data = []) {
    $response = array_merge(['success' => $success, 'message' => $message], $data);
    echo json_encode($response);
    exit;
}

try {
    // Validar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido", 405);
    }

    // Verificar si se están enviando datos multipart/form-data
    if (empty($_FILES) && empty($_POST)) {
        // Intentar leer como JSON si no hay form-data
        $input = file_get_contents("php://input");
        if (!empty($input)) {
            $data = json_decode($input, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                throw new Exception("Este endpoint espera datos multipart/form-data, no JSON", 400);
            }
        }
        throw new Exception("Datos incompletos: se esperaban archivos y datos POST", 400);
    }

    // Validar datos requeridos
    if (empty($_FILES['image'])) {
        throw new Exception("No se ha seleccionado ninguna imagen", 400);
    }

    if (empty($_POST['userId'])) {
        throw new Exception("ID de usuario no especificado", 400);
    }

    // Validar archivo
    $file = $_FILES['image'];
    $userId = (int)$_POST['userId'];

    // Verificar errores de subida
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido',
            UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo del formulario',
            UPLOAD_ERR_PARTIAL => 'El archivo fue solo parcialmente subido',
            UPLOAD_ERR_NO_FILE => 'No se seleccionó ningún archivo',
            UPLOAD_ERR_NO_TMP_DIR => 'Falta el directorio temporal',
            UPLOAD_ERR_CANT_WRITE => 'Error al escribir el archivo en el disco',
            UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida del archivo'
        ];
        $errorMsg = $uploadErrors[$file['error']] ?? 'Error desconocido al subir el archivo';
        throw new Exception($errorMsg, 400);
    }

    // Validar tipo de archivo
    $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception("Solo se permiten imágenes JPEG y PNG. Tipo recibido: " . $mimeType, 400);
    }

    // Validar tamaño (2MB máximo)
    if ($file['size'] > 2 * 1024 * 1024) {
        throw new Exception("La imagen no debe exceder 2MB", 400);
    }

    // Configurar directorio de uploads
    $uploadDir = realpath(__DIR__ . '/../uploads/usuarios');

    if ($uploadDir === false) {
        // Intentar crear el directorio si no existe
        $uploadDir = __DIR__ . '/../uploads';
        if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
            throw new Exception("No se pudo crear el directorio de uploads", 500);
        }
        $uploadDir = realpath($uploadDir);
    }

    if (!is_writable($uploadDir)) {
        throw new Exception("El directorio de uploads no tiene permisos de escritura", 500);
    }

    $uploadDir .= DIRECTORY_SEPARATOR;

    // Generar nombre único para el archivo
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (empty($extension)) {
        // Determinar extensión basada en MIME type
        $extension = $mimeType === 'image/jpeg' ? 'jpg' : 'png';
    }
    
    $filename = uniqid('img_') . '.' . $extension;
    $targetPath = $uploadDir . $filename;

    // Mover archivo subido
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception("Error al guardar la imagen en el servidor", 500);
    }

    // Establecer permisos adecuados
    chmod($targetPath, 0644);

    // Conectar a la base de datos y actualizar
    $conn = new mysqli($servername, $username, $password, $dbname, $port);
    
    if ($conn->connect_error) {
        // Limpiar archivo subido si hay error de BD
        if (file_exists($targetPath)) {
            unlink($targetPath);
        }
        throw new Exception("Error de conexión a la base de datos: " . $conn->connect_error, 500);
    }

    $conn->set_charset('utf8');

    // Verificar que el usuario existe
    $checkUser = $conn->prepare("SELECT id_usuario FROM usuario WHERE id_usuario = ?");
    $checkUser->bind_param("i", $userId);
    $checkUser->execute();
    $checkUser->store_result();

    if ($checkUser->num_rows === 0) {
        $checkUser->close();
        $conn->close();
        if (file_exists($targetPath)) {
            unlink($targetPath);
        }
        throw new Exception("El usuario especificado no existe", 404);
    }
    $checkUser->close();

    // Actualizar la imagen del usuario
    $stmt = $conn->prepare("UPDATE usuario SET img_url = ? WHERE id_usuario = ?");
    if (!$stmt) {
        $conn->close();
        if (file_exists($targetPath)) {
            unlink($targetPath);
        }
        throw new Exception("Error preparando la consulta: " . $conn->error, 500);
    }

    $relativePath = "usuarios/" . $filename;
$stmt->bind_param("si", $relativePath, $userId);

    
    if (!$stmt->execute()) {
        $stmt->close();
        $conn->close();
        if (file_exists($targetPath)) {
            unlink($targetPath);
        }
        throw new Exception("Error ejecutando la consulta: " . $stmt->error, 500);
    }

    $stmt->close();
    $conn->close();

    // Log de éxito
    error_log("Imagen subida exitosamente para usuario $userId: $filename");

    // Éxito
    sendJsonResponse(true, 'Imagen actualizada correctamente', [
        'img_url' => $relativePath,
'full_url' => "http://localhost:8080/Proton/backend/uploads/$relativePath"

    ]);

} catch (Exception $e) {
    // Log del error
    error_log("ERROR en uploadUserImage.php: " . $e->getMessage() . " en " . $e->getFile() . ":" . $e->getLine());
    
    // Enviar respuesta de error
    http_response_code($e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500);
    sendJsonResponse(false, $e->getMessage(), ['error_code' => $e->getCode()]);
}
?>