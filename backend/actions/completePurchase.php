<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost:3307";
$user = "root";
$password = "";
$database = "proton";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["cart"]) || !is_array($data["cart"])) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

$conn->begin_transaction();

try {
    foreach ($data["cart"] as $item) {
        $productId = $item["id"];
        $quantity = $item["quantity"];

        // Verificar stock disponible
        $query = $conn->prepare("SELECT stock_producto FROM producto WHERE codigo_producto = ?");
        $query->bind_param("i", $productId);
        $query->execute();
        $result = $query->get_result();
        $row = $result->fetch_assoc();

        // Log de diagnóstico
        error_log("Verificando stock para producto ID: " . $productId);
        error_log("Stock disponible: " . $row["stock_producto"]);

        if (!$row || $row["stock_producto"] < $quantity) {
            throw new Exception("Stock insuficiente para el producto ID $productId");
        }

        // Actualizar stock
        $updateQuery = $conn->prepare("UPDATE producto SET stock_producto = stock_producto - ? WHERE codigo_producto = ?");
        $updateQuery->bind_param("ii", $quantity, $productId);
        $updateQuery->execute();
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Compra realizada con éxito"]);
} catch (Exception $e) {
    $conn->rollback();
    // Log de error
    error_log("Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
