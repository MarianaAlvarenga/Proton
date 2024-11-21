<?php
// Configuración de la base de datos
$host = 'localhost:3307';
$dbname = 'proton'; // Cambia esto por tu base de datos
$username = 'root';           // Usuario por defecto en XAMPP
$password = '';               // Contraseña por defecto vacía

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener los productos
$sql = "SELECT codigo_producto, nombre_producto AS ProductName, precio_producto AS ProductPrice, image_url AS ProductImage FROM products";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $products = [];

    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($products);
} else {
    echo json_encode([]);
}

$conn->close();
?>
