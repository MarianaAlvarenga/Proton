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

// Cantidad de productos por página
$itemsPerPage = 4;

// Verificar si se recibe el parámetro de búsqueda
$searchQuery = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';

// Verificar si se recibe el parámetro de número de página
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;

// Calcular el inicio para la consulta
$offset = ($page - 1) * $itemsPerPage;

// Si hay un término de búsqueda, usarlo en la consulta
$whereClause = "";
if (!empty($searchQuery)) {
    $whereClause = "WHERE nombre_producto LIKE '%$searchQuery%'";
}

// Consulta para obtener los productos con paginación y filtro de búsqueda
$sql = "SELECT codigo_producto AS id, nombre_producto, precio_producto, image_url 
        FROM producto 
        $whereClause 
        LIMIT $itemsPerPage OFFSET $offset";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $products = [];

    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    // Consulta adicional para obtener el total de productos (con el filtro aplicado)
    $countSql = "SELECT COUNT(*) AS total FROM producto $whereClause";
    $countResult = $conn->query($countSql);
    $totalProducts = $countResult->fetch_assoc()['total'];
    $totalPages = ceil($totalProducts / $itemsPerPage);

    // Respuesta con datos y metadatos de paginación
    header('Content-Type: application/json');
    echo json_encode([
        'products' => $products,
        'pagination' => [
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'itemsPerPage' => $itemsPerPage,
            'totalItems' => $totalProducts
        ]
    ]);
} else {
    // Respuesta si no hay productos que coincidan
    header('Content-Type: application/json');
    echo json_encode([
        'products' => [],
        'pagination' => [
            'currentPage' => $page,
            'totalPages' => 0,
            'itemsPerPage' => $itemsPerPage,
            'totalItems' => 0
        ]
    ]);
}

$conn->close();
?>
