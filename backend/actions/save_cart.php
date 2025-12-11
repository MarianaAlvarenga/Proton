<?php
require_once '../includes/session_config.php';

$data = json_decode(file_get_contents("php://input"), true);

$cart = $data["cart"] ?? [];
$email = $data["userEmail"] ?? null;
$total = array_reduce($cart, fn($sum, $item) => $sum + ($item["price"] * $item["quantity"]), 0);

$_SESSION["cart"] = $cart;
$_SESSION["total"] = $total;
$_SESSION["email"] = $email;

// Si tenés el usuario logueado en sesión, también podés setearlo:
$_SESSION["currentUserId"] = $_SESSION["currentUserId"] ?? null;
$_SESSION["currentUserRole"] = $_SESSION["currentUserRole"] ?? null;

echo json_encode(["status" => "ok"]);
