<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/db.php';
// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer el conjunto de caracteres
$conn->set_charset('utf8');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["cart"]) || !is_array($data["cart"])) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

$isRegistered = $data["isRegistered"] ?? false;
$email = $data["email"] ?? "";
$total = $data["total"] ?? 0;

$conn->begin_transaction();

try {
    // Verificar stock y actualizar productos
    foreach ($data["cart"] as $item) {
        $productId = $item["id"];
        $quantity = $item["quantity"];

        $query = $conn->prepare("SELECT stock_producto FROM producto WHERE codigo_producto = ?");
        $query->bind_param("i", $productId);
        $query->execute();
        $result = $query->get_result();
        $row = $result->fetch_assoc();

        if (!$row || $row["stock_producto"] < $quantity) {
            throw new Exception("Stock insuficiente para el producto ID $productId");
        }

        // Actualizar stock
        $updateQuery = $conn->prepare("UPDATE producto SET stock_producto = stock_producto - ? WHERE codigo_producto = ?");
        $updateQuery->bind_param("ii", $quantity, $productId);
        $updateQuery->execute();
    }

    // Insertar en la tabla carrito
    $insertCarritoQuery = $conn->prepare("INSERT INTO carrito (fecha_carrito, hora_carrito, total) VALUES (CURDATE(), CURTIME(), ?)");
    $insertCarritoQuery->bind_param("d", $total);
    $insertCarritoQuery->execute();
    $carritoId = $conn->insert_id; // Obtener el ID del carrito insertado

    if ($isRegistered) {
        // Verificar si el usuario existe
        $userQuery = $conn->prepare("SELECT id_usuario, rol FROM usuario WHERE email = ?");
        $userQuery->bind_param("s", $email);
        $userQuery->execute();
        $userResult = $userQuery->get_result();
        $userRow = $userResult->fetch_assoc();

        if (!$userRow) {
            throw new Exception("El usuario no está registrado.");
        }

        $userId = $userRow["id_usuario"];
        $userRole = $userRow["rol"];

        // Asignar el ID del usuario según su rol
        if ($userRole == 4) { // Administrador
            $updateCarritoQuery = $conn->prepare("UPDATE carrito SET administrador_id_usuario = ? WHERE id_carrito = ?");
        } elseif ($userRole == 2) { // Vendedor
            $updateCarritoQuery = $conn->prepare("UPDATE carrito SET vendedor_id_usuario = ? WHERE id_carrito = ?");
        } else { // Cliente
            $updateCarritoQuery = $conn->prepare("UPDATE carrito SET cliente_id_usuario1 = ? WHERE id_carrito = ?");
        }

        $updateCarritoQuery->bind_param("ii", $userId, $carritoId);
        $updateCarritoQuery->execute();
    } else {
        // Insertar en la tabla usuario_no_registrado
        $insertUnregisteredQuery = $conn->prepare("INSERT INTO usuario_no_registrado (id_carrito) VALUES (?)");
        $insertUnregisteredQuery->bind_param("i", $carritoId);
        $insertUnregisteredQuery->execute();
        $usuarioNoRegistradoId = $conn->insert_id; // Obtener el ID del usuario no registrado recién insertado

        // Actualizar carrito con el ID del usuario no registrado
        $updateCarritoUnregistered = $conn->prepare("UPDATE carrito SET cliente_id_usuario_no_registrado = ? WHERE id_carrito = ?");
        $updateCarritoUnregistered->bind_param("ii", $usuarioNoRegistradoId, $carritoId);
        $updateCarritoUnregistered->execute();
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Compra realizada con éxito"]);
} catch (Exception $e) {
    $conn->rollback();
    error_log("Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
