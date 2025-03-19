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
$email = $data["email"] ?? null; // Correo electrónico (solo si el usuario está registrado)
$total = $data["total"] ?? 0;

// Obtener el ID y el rol del usuario que está realizando la compra
$currentUserId = $data["currentUserId"] ?? null;
$currentUserRole = $data["currentUserRole"] ?? null;

if (!$currentUserId || !$currentUserRole) {
    echo json_encode(["success" => false, "message" => "ID o rol del usuario actual no proporcionado"]);
    exit;
}

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

    if ($currentUserRole == 1) {
        // Si el usuario es un cliente, asignar su ID a cliente_id_usuario1
        $updateCarritoQuery = $conn->prepare("UPDATE carrito SET cliente_id_usuario1 = ? WHERE id_carrito = ?");
        $updateCarritoQuery->bind_param("ii", $currentUserId, $carritoId);
        $updateCarritoQuery->execute();
    } elseif ($isRegistered) {
        // Verificar si el usuario existe (solo si está registrado y no es un cliente)
        $userQuery = $conn->prepare("SELECT id_usuario FROM usuario WHERE email = ?");
        $userQuery->bind_param("s", $email);
        $userQuery->execute();
        $userResult = $userQuery->get_result();
        $userRow = $userResult->fetch_assoc();

        if (!$userRow) {
            throw new Exception("El usuario no está registrado.");
        }

        $userId = $userRow["id_usuario"];

        // Asignar el ID del usuario registrado en la columna cliente_id_usuario1
        $updateCarritoQuery = $conn->prepare("UPDATE carrito SET cliente_id_usuario1 = ? WHERE id_carrito = ?");
        $updateCarritoQuery->bind_param("ii", $userId, $carritoId);
        $updateCarritoQuery->execute();
    } else {
        // Insertar en la tabla usuario_no_registrado
        $insertUnregisteredQuery = $conn->prepare("INSERT INTO usuario_no_registrado (id_carrito) VALUES (?)");
        $insertUnregisteredQuery->bind_param("i", $carritoId);
        $insertUnregisteredQuery->execute();
        $usuarioNoRegistradoId = $conn->insert_id; // Obtener el ID del usuario no registrado recién insertado

        // Asignar el ID del usuario no registrado en la columna cliente_id_usuario_no_registrado
        $updateCarritoUnregistered = $conn->prepare("UPDATE carrito SET cliente_id_usuario_no_registrado = ? WHERE id_carrito = ?");
        $updateCarritoUnregistered->bind_param("ii", $usuarioNoRegistradoId, $carritoId);
        $updateCarritoUnregistered->execute();
    }

    // Asignar el ID del usuario que realiza la compra (vendedor o administrador)
    if ($currentUserRole == 4) { // Administrador
        $updateCarritoQuery = $conn->prepare("UPDATE carrito SET administrador_id_usuario = ? WHERE id_carrito = ?");
    } elseif ($currentUserRole == 2) { // Vendedor
        $updateCarritoQuery = $conn->prepare("UPDATE carrito SET vendedor_id_usuario = ? WHERE id_carrito = ?");
    } elseif ($currentUserRole == 1) { // Cliente
        $updateCarritoQuery = $conn->prepare("UPDATE carrito SET cliente_id_usuario1 = ? WHERE id_carrito = ?");
    } else {
        throw new Exception("Rol del usuario actual no válido.");
    }

    if ($currentUserRole != 1) { // Solo asignar vendedor o administrador si no es un cliente
        $updateCarritoQuery->bind_param("ii", $currentUserId, $carritoId);
        $updateCarritoQuery->execute();
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Compra realizada con éxito"]);
} catch (Exception $e) {
    $conn->rollback();
    error_log("Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
