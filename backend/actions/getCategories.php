<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Configuración de la base de datos
$host = 'localhost:3307';
$dbname = 'proton'; // Cambia esto por el nombre de tu base de datos
$username = 'root';           // Usuario de la base de datos
$password = '';               // Contraseña de la base de datos (por defecto en XAMPP suele estar vacía)

// Crear conexión
$conn = new mysqli($host, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta SQL para obtener las categorías
$sql = "SELECT nombre_categoria FROM categoria"; // Cambia 'categoria' y 'nombre_categoria' según tu base de datos
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $categories = [];

    // Procesar los resultados en un arreglo
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }

    // Establecer encabezados para indicar que la respuesta es JSON
    header('Content-Type: application/json');
    echo json_encode($categories);
} else {
    // No hay resultados
    echo json_encode([]);
}

// Cerrar conexión
$conn->close();
?>
