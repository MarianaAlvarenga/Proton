<?php
// Configuración de cabeceras
require_once '../includes/session_config.php';
// Parámetros de conexión a la base de datos
require_once '../includes/db.php';

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}


// Verifica el método de la solicitud
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
    exit;
}

// Recibir los datos del formulario
$nombre_producto = $_POST['nombre_producto'] ?? null;
$descripcion_producto = $_POST['descripcion_producto'] ?? null;
$stock_producto = $_POST['stock_producto'] ?? null;
$punto_reposicion = $_POST['punto_reposicion'] ?? null;
$categoria_id_categoria = $_POST['categoria_id_categoria'] ?? null;
$precio_producto = $_POST['precio_producto'] ?? null;
$codigo_producto = "";
$image = $_FILES['image_url'] ?? null;

// Validar que todos los campos requeridos estén presentes
if (!$nombre_producto || !$stock_producto || !$punto_reposicion || !$precio_producto || !$categoria_id_categoria ) {
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
    exit;
}

// Manejo de la imagen
$image_url = null; // Inicializamos como null en caso de que no se suba una imagen

if ($image && $image['tmp_name']) {
    // Verificar el tipo de archivo y su tamaño
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    if (in_array($image['type'], $allowed_types)) {
        $upload_dir = '../uploads/'; // Carpeta donde se guardarán las imágenes
        $file_name = uniqid() . '_' . basename($image['name']);
        $target_file = $upload_dir . $file_name;

        // Verificar si la carpeta de destino existe, si no, crearla
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        if (move_uploaded_file($image['tmp_name'], $target_file)) {
            $image_url = 'http://localhost:8080/Proton/backend/uploads/' . $file_name; // Ruta relativa para guardar en la base de datos
        } else {
            echo json_encode(["success" => false, "message" => "Error al mover el archivo de imagen."]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "message" => "Tipo de archivo no permitido."]);
        exit;
    }
}

// Insertar el producto en la base de datos
try {
    $query = "INSERT INTO producto (nombre_producto, descripcion_producto, stock_producto, punto_reposicion, categoria_id_categoria, precio_producto, codigo_producto, image_url)
              VALUES (:nombre_producto, :descripcion_producto, :stock_producto, :punto_reposicion, :categoria_id_categoria, :precio_producto, :codigo_producto, :image_url)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':nombre_producto', $nombre_producto);
    $stmt->bindParam(':descripcion_producto', $descripcion_producto);
    $stmt->bindParam(':stock_producto', $stock_producto);
    $stmt->bindParam(':punto_reposicion', $punto_reposicion);
    $stmt->bindParam(':categoria_id_categoria', $categoria_id_categoria);
    $stmt->bindParam(':precio_producto', $precio_producto);
    $stmt->bindParam(':codigo_producto', $codigo_producto);
    $stmt->bindParam(':image_url', $image_url);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Producto agregado exitosamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al agregar el producto."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error en la base de datos: " . $e->getMessage()]);
}
