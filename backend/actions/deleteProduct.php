<?php
// Parámetros de conexión a la base de datos
$host = 'localhost:3307';
$db = 'proton';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["success" => false, "message" => "Error en la conexión: " . $e->getMessage()]));
}

// Configuración de cabeceras
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Responder a solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Verifica el método de la solicitud
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
    exit;
}

// Recibir los datos del formulario
// Leer los datos JSON enviados desde el cliente

// Asegúrate de que estás leyendo los datos correctamente desde la solicitud JSON

$data = json_decode(file_get_contents("php://input"), true); // Obtener los datos JSON

if (isset($data['codigo_producto'])) {
  $codigo_producto = $data['codigo_producto']; // Obtener el código del producto

  // Verificar que se haya recibido el código
  if ($codigo_producto) {
    // Código para eliminar el producto
    $query = "DELETE FROM producto WHERE codigo_producto = :id";
    // Asegúrate de ejecutar esta consulta correctamente
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $codigo_producto);
    $result = $stmt->execute();

    if ($result) {
      echo json_encode(["success" => true, "message" => "Producto eliminado correctamente."]);
    } else {
      echo json_encode(["success" => false, "message" => "Error al eliminar el producto."]);
    }
  } else {
    echo json_encode(["success" => false, "message" => "Código de producto no válido."]);
  }
} else {
  echo json_encode(["success" => false, "message" => "Código de producto no recibido."]);
}
?>
