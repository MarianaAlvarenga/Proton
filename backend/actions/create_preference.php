<?php
// === CONFIGURACIÓN CORS ===
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Manejo de preflight (petición OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cargar las variables de entorno desde mp.env
require_once __DIR__ . '/../load_env.php';

// Obtener el access token de Mercado Pago
$access_token = getenv('MP_ACCESS_TOKEN');

if (!$access_token) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo cargar el Access Token."]);
    exit;
}

// URL del endpoint de Mercado Pago
$url = "https://api.mercadopago.com/checkout/preferences";

// Obtener datos enviados desde el frontend (React)
$body = json_decode(file_get_contents('php://input'), true);

// Validar el cuerpo mínimo
if (!isset($body['items']) || !is_array($body['items'])) {
    http_response_code(400);
    echo json_encode(["error" => "No se recibieron los ítems de la compra."]);
    exit;
}

// Crear el objeto de preferencia
$preference = [
    "items" => $body["items"],

    "payer" => [
        "name" => $body["payer"]["name"] ?? "Cliente",
        "email" => $body["payer"]["email"] ?? "test_user@example.com"
    ],

    "back_urls" => [
        "success" => "https://benevolent-kyleigh-dreary.ngrok-free.dev/success",
        "failure" => "https://benevolent-kyleigh-dreary.ngrok-free.dev/Proton/frontend/failure.html",
        "pending" => "https://benevolent-kyleigh-dreary.ngrok-free.dev/Proton/frontend/pending.html"
    ],

    "auto_return" => "approved",
    "binary_mode" => true
];

// Inicializar cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preference));

// Ejecutar la solicitud
$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Responder al frontend
http_response_code($http_status);
echo $response;
