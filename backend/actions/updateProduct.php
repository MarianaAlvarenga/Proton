<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Configuración de la base de datos
$host = 'localhost:3307';
$dbname = 'proton'; // Cambia esto por tu base de datos
$username = 'root'; // Usuario por defecto en XAMPP
$password = '';     // Contraseña por defecto vacía

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibir los datos del formulario
    $codigo_producto = $_POST['codigo_producto'];
    $nombre_producto = $_POST['nombre_producto'];
    $descripcion_producto = $_POST['descripcion_producto'];
    $stock_producto = $_POST['stock_producto'];
    $punto_reposicion = $_POST['punto_reposicion'];
    $categoria_id_categoria = $_POST['categoria_id_categoria'];
    $precio_producto = $_POST['precio_producto'];

    // Verificar que los datos no estén vacíos
    if (empty($codigo_producto) || empty($nombre_producto) || empty($descripcion_producto) || empty($stock_producto) || empty($punto_reposicion) || empty($categoria_id_categoria) || empty($precio_producto)) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
        exit;
    }

    // Preparar la consulta SQL para actualizar el producto
    $sql = "UPDATE producto 
            SET nombre_producto = ?, 
                descripcion_producto = ?, 
                stock_producto = ?, 
                punto_reposicion = ?, 
                categoria_id_categoria = ?, 
                precio_producto = ? 
            WHERE codigo_producto = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Error al preparar la consulta: " . $conn->error]);
        exit;
    }

    // Vincular los parámetros
    $stmt->bind_param("ssiiiii", $nombre_producto, $descripcion_producto, $stock_producto, $punto_reposicion, $categoria_id_categoria, $precio_producto, $codigo_producto);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Producto actualizado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el producto: " . $stmt->error]);
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
}
?>