<?php
// Encabezados CORS
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cambiar para producción
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // Encabezados permitidos

// Manejar preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
header("Content-Type: application/json");

$host = "localhost:3307";
$dbname = "proton";
$user = "root";
$password = "";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Obtener datos del producto desde la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'];
$precio = $data['precio_producto'];
$reposicion = $data['punto_reposicion'];
$stock = $data['stock_producto'];
$descripcion = $data['descripcion_producto'];
$categoria_id = $data['categoria'];

// Insertar producto en la base de datos
$sql = "INSERT INTO producto (nombre_producto, descripcion_producto, stock_producto, punto_reposicion, categoria, precio_producto) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssiiii", $nombre, $descripcion, $stock, $reposicion, $categoria, $precio);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al insertar el producto"]);
}

$stmt->close();
$conn->close();
?>
