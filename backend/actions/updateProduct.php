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
    $codigo_producto = $_POST['codigo_producto'];
    $nombre_producto = $_POST['nombre_producto'];
    $descripcion_producto = $_POST['descripcion_producto'];
    $stock_producto = $_POST['stock_producto'];
    $punto_reposicion = $_POST['punto_reposicion'];
    $categoria_id_categoria = $_POST['categoria_id_categoria'];
    $precio_producto = $_POST['precio_producto'];

    // Lógica para actualizar el producto en la base de datos
    $sql = "UPDATE producto SET nombre_producto = ?, descripcion_producto = ?, stock_producto = ?, punto_reposicion = ?, categoria_id_categoria = ?, precio_producto = ? WHERE codigo_producto = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssiiiii", $nombre_producto, $descripcion_producto, $stock_producto, $punto_reposicion, $categoria_id_categoria, $precio_producto, $codigo_producto);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Producto actualizado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el producto."]);
    }

    $stmt->close();
    $conn->close();
}
?>
