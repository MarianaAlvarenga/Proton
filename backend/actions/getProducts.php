<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Configuración de la base de datos
$host = 'localhost:3307';
$dbname = 'proton';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Cantidad de productos por página
$itemsPerPage = 4;

// Verificar parámetros de búsqueda y categoría
$searchQuery = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
$categoryFilter = isset($_GET['category']) ? intval($_GET['category']) : 0;
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;

// Calcular el inicio para la consulta
$offset = ($page - 1) * $itemsPerPage;

// Construir la cláusula WHERE
$whereClauses = [];
if (!empty($searchQuery)) {
    $whereClauses[] = "nombre_producto LIKE '%$searchQuery%'";
}
if ($categoryFilter > 0) {
    $whereClauses[] = "categoria_id_categoria = $categoryFilter";
}
$whereClause = count($whereClauses) > 0 ? "WHERE " . implode(" AND ", $whereClauses) : "";

// Consulta para obtener los productos
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

    // Obtener el total de productos con los filtros aplicados
    $countSql = "SELECT COUNT(*) AS total FROM producto $whereClause";
    $countResult = $conn->query($countSql);
    $totalProducts = $countResult->fetch_assoc()['total'];
    $totalPages = ceil($totalProducts / $itemsPerPage);

    // Respuesta JSON
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
    // Respuesta si no hay resultados
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
