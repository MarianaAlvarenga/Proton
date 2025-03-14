<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Configuración de la base de datos
$host = 'localhost:3306';
$dbname = 'proton';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si se solicita un producto específico por ID
$productId = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($productId) {
    // Consulta para obtener un solo producto por ID
    $sql = "SELECT codigo_producto AS id, nombre_producto, descripcion_producto, stock_producto, punto_reposicion, categoria_id_categoria, precio_producto, image_url 
            FROM producto 
            WHERE codigo_producto = $productId";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $product = $result->fetch_assoc();
        header('Content-Type: application/json');
        echo json_encode($product);
    } else {
        header('Content-Type: application/json');
        echo json_encode(["error" => "Producto no encontrado"]);
    }
} else {
    // Lógica original para obtener múltiples productos con paginación
    $itemsPerPage = 16;
    $searchQuery = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    $categoryFilter = isset($_GET['category']) ? intval($_GET['category']) : 0;
    $page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;
    $offset = ($page - 1) * $itemsPerPage;

    $whereClauses = [];
    if (!empty($searchQuery)) {
        $whereClauses[] = "nombre_producto LIKE '%$searchQuery%'";
    }
    if ($categoryFilter > 0) {
        $whereClauses[] = "categoria_id_categoria = $categoryFilter";
    }
    $whereClause = count($whereClauses) > 0 ? "WHERE " . implode(" AND ", $whereClauses) : "";

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

        $countSql = "SELECT COUNT(*) AS total FROM producto $whereClause";
        $countResult = $conn->query($countSql);
        $totalProducts = $countResult->fetch_assoc()['total'];
        $totalPages = ceil($totalProducts / $itemsPerPage);

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
}

$conn->close();
?>