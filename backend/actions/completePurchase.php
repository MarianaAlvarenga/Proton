<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../includes/session_config.php';
require_once '../includes/db.php';

// =======================================================
// 1) RECUPERAR DATOS DEL CARRITO, SESIÓN Y EMAIL
// =======================================================
$cart = $_SESSION["cart"] ?? [];
$total = $_SESSION["total"] ?? 0;
$currentUserId = $_SESSION["currentUserId"] ?? null;
$currentUserRole = $_SESSION["currentUserRole"] ?? null;

$email = $_POST["userEmail"] ?? $_SESSION["email"] ?? null;

// =======================================================
// 2) VALIDACIONES
// =======================================================
if (empty($cart)) {
    $frontend = "https://knives-foot-fda-clark.trycloudflare.com";
    header("Location: $frontend/success?error=1&msg=CarritoVacio");
    exit;
}

if (!$currentUserId || !$currentUserRole) {
    $frontend = "https://knives-foot-fda-clark.trycloudflare.com";
    header("Location: $frontend/success?error=1&msg=SesionIncompleta");
    exit;
}

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    $frontend = "https://knives-foot-fda-clark.trycloudflare.com";
    header("Location: $frontend/success?error=1&msg=ConexionBD");
    exit;
}

$conn->set_charset('utf8');
$conn->begin_transaction();

try {

    // =======================================================
    // 3) VERIFICAR STOCK Y DESCONTAR
    // =======================================================
    foreach ($cart as $item) {
        $productId = $item["id"];
        $quantity  = $item["quantity"];

        $query = $conn->prepare("SELECT stock_producto FROM producto WHERE codigo_producto = ?");
        $query->bind_param("i", $productId);
        $query->execute();
        $stockData = $query->get_result()->fetch_assoc();

        if (!$stockData || $stockData["stock_producto"] < $quantity) {
            throw new Exception("Stock insuficiente para el producto ID $productId");
        }

        $updateStock = $conn->prepare(
            "UPDATE producto SET stock_producto = stock_producto - ? WHERE codigo_producto = ?"
        );
        $updateStock->bind_param("ii", $quantity, $productId);
        $updateStock->execute();
    }

    // =======================================================
    // 4) CREAR CARRITO SEGÚN ROL DEL USUARIO
    // =======================================================
    $clienteField = null;
    $vendedorField = null;
    $adminField   = null;
    $clienteNoRegistradoId = null;

    if ($currentUserRole == 1) {
        $clienteField = $currentUserId;
    } elseif ($currentUserRole == 2) {
        $vendedorField = $currentUserId;
    } elseif ($currentUserRole == 4) {
        $adminField = $currentUserId;
    } else {
        throw new Exception("Rol no autorizado para realizar compras.");
    }

    $insertCarrito = $conn->prepare("
        INSERT INTO carrito (
            fecha_carrito,
            hora_carrito,
            total,
            cliente_id_usuario1,
            vendedor_id_usuario,
            administrador_id_usuario,
            cliente_id_usuario_no_registrado
        ) VALUES (
            CURDATE(), CURTIME(), ?, ?, ?, ?, NULL
        )
    ");

    $insertCarrito->bind_param(
        "diii",
        $total,
        $clienteField,
        $vendedorField,
        $adminField
    );

    $insertCarrito->execute();
    $carritoId = $conn->insert_id;

    // =======================================================
    // 5) ASIGNAR CLIENTE REAL (solo vendedor/admin con email)
    // =======================================================
    if ($email && ($currentUserRole == 2 || $currentUserRole == 4)) {

        $userQuery = $conn->prepare("SELECT id_usuario FROM usuario WHERE email = ?");
        $userQuery->bind_param("s", $email);
        $userQuery->execute();
        $userResult = $userQuery->get_result();
        $userRow = $userResult->fetch_assoc();

        if (!$userRow) {
            throw new Exception("El email ingresado no pertenece a un usuario registrado.");
        }

        $clienteId = $userRow["id_usuario"];

        $assignClient = $conn->prepare(
            "UPDATE carrito SET cliente_id_usuario1 = ? WHERE id_carrito = ?"
        );
        $assignClient->bind_param("ii", $clienteId, $carritoId);
        $assignClient->execute();
    }

    // =======================================================
    // 5 BIS) CREAR USUARIO NO REGISTRADO CUANDO CORRESPONDA
    // =======================================================
    if (!$email && ($currentUserRole == 2 || $currentUserRole == 4)) {
        $insertNoReg = $conn->prepare("
            INSERT INTO usuario_no_registrado (id_carrito)
            VALUES (?)
        ");
        $insertNoReg->bind_param("i", $carritoId);
        $insertNoReg->execute();

        $clienteNoRegistradoId = $conn->insert_id;

        // Enlazar en carrito
        $updateCarritoNoReg = $conn->prepare("
            UPDATE carrito SET cliente_id_usuario_no_registrado = ?
            WHERE id_carrito = ?
        ");
        $updateCarritoNoReg->bind_param("ii", $clienteNoRegistradoId, $carritoId);
        $updateCarritoNoReg->execute();
    }

    // =======================================================
    // 6) ASOCIAR PRODUCTOS A LA TABLA tienev1 (CON CANTIDAD)
    // =======================================================
    $insertTiene = $conn->prepare("
        INSERT INTO tienev1 (producto_codigo_producto, carrito_id_carrito, cantidad)
        VALUES (?, ?, ?)
    ");

    foreach ($cart as $item) {
        $productId = $item["id"];
        $quantity  = $item["quantity"];

        $insertTiene->bind_param("iii", $productId, $carritoId, $quantity);
        $insertTiene->execute();
    }

    // =======================================================
    // 7) CONFIRMAR TODO Y LIMPIAR CARRITO
    // =======================================================
    $conn->commit();
    unset($_SESSION["cart"]);

    $frontend = "https://knives-foot-fda-clark.trycloudflare.com";
    header("Location: $frontend/success?ok=1&carritoId={$carritoId}");
    exit;

} catch (Exception $e) {
    $conn->rollback();
    $frontend = "https://knives-foot-fda-clark.trycloudflare.com";
    $msg = urlencode($e->getMessage());
    header("Location: $frontend/success?error=1&msg=$msg");
    exit;
}
