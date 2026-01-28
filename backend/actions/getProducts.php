<?php
require_once '../includes/session_config.php';

// Configuración de la base de datos
require_once '../includes/db.php';
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer el conjunto de caracteres
$conn->set_charset('utf8');

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

        if (!empty($product['image_url'])) {
            $product['image_url'] = basename($product['image_url']);
        }

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

    $sql = "SELECT codigo_producto AS id, nombre_producto, precio_producto, stock_producto, punto_reposicion, image_url 
            FROM producto 
            $whereClause 
            LIMIT $itemsPerPage OFFSET $offset";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $products = [];
        while ($row = $result->fetch_assoc()) {

            if (!empty($row['image_url'])) {
                $row['image_url'] = basename($row['image_url']);
            }

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