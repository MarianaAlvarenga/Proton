<?php

require_once '../includes/session_config.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Solo se acepta POST"]);
    exit;
}

// ---- DEBUG: VER RAW BODY ----
$raw = file_get_contents("php://input");
error_log("RAW BODY ===> " . $raw);
$body = json_decode($raw, true);
// ------------------------------

// Cargar variables de entorno
require_once __DIR__ . '/../load_env.php';
$access_token = getenv('MP_ACCESS_TOKEN');

error_log("TOKEN QUE LLEGA ===> " . $access_token);

if (!$access_token) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo cargar el Access Token."]);
    exit;
}

$url = "https://api.mercadopago.com/checkout/preferences";

if (!isset($body['items']) || !is_array($body['items'])) {
    http_response_code(400);
    echo json_encode(["error" => "No se recibieron los ítems de la compra."]);
    exit;
}

// Crear la preferencia
$preference = [
    "items" => $body["items"],
    "payer" => [
        "name" => $body["payer"]["name"] ?? "Cliente",
        "email" => $body["payer"]["email"] ?? "test_user@example.com"
    ],
    "back_urls" => [
        "success" => "https://von-portable-exec-istanbul.trycloudflare.com/backend/actions/success.php",
        "failure" => "https://warnings-excited-scenario-offline.trycloudflare.com/backend/actions/failure.php",
        "pending" => "https://warnings-excited-scenario-offline.trycloudflare.com/backend/actions/pending.php"
    ],
    "auto_return" => "approved",
    "binary_mode" => true
];

// cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preference));

$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false) {
    $error = curl_error($ch);
    error_log("ERROR CURL ===> " . $error);
    file_put_contents("mp_log.txt", "ERROR CURL: " . $error . PHP_EOL, FILE_APPEND);
} else {
    file_put_contents("mp_log.txt", "RESPONSE: " . $response . PHP_EOL, FILE_APPEND);
}

curl_close($ch);

// ✨ NUEVO: GUARDAR CARRITO PARA USARLO EN completePurchase.php
$data = json_decode($response, true);
if (isset($data["id"])) {
    $prefId = $data["id"];

    if (!is_dir("../tmp")) mkdir("../tmp", 0777, true);

    file_put_contents("../tmp/cart_" . $prefId . ".json", json_encode([
        "cart" => $body["items"],
        "payer" => $preference["payer"]
    ]));
}

// Responder
http_response_code($http_status);
file_put_contents("mp_log.txt", $response . PHP_EOL, FILE_APPEND);
echo $response;
