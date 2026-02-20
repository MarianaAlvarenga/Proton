<?php
require_once '../includes/session_config.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Solo se acepta POST"]);
    exit;
}

$raw = file_get_contents("php://input");
$body = json_decode($raw, true);

// --- BLINDAJE PARA ERROR 400: Convertir unit_price a float ---
if (isset($body['items']) && is_array($body['items'])) {
    foreach ($body['items'] as &$item) {
        if (isset($item['unit_price'])) {
            $item['unit_price'] = (float)$item['unit_price'];
        }
    }
}
// -------------------------------------------------------------

require_once __DIR__ . '/../load_env.php';
$access_token = getenv('MP_ACCESS_TOKEN');

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

$turnoId = isset($body['turnoId']) ? (string)$body['turnoId'] : null;

$preference = [
    "items" => $body["items"],
    "payer" => [
        "name" => $body["payer"]["name"] ?? "Cliente",
        "email" => $body["payer"]["email"] ?? "test_user@example.com"
    ],
    "back_urls" => [
        "success" => "https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/success.php",
        "failure" => "https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/failure.php",
        "pending" => "https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/pending.php"
    ],
    "auto_return" => "approved",
    "binary_mode" => true,
    "external_reference" => $turnoId, 
    "notification_url" => "https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/webhookMp.php?source=mp"
];

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
curl_close($ch);

$data = json_decode($response, true);

if (isset($data["id"])) {
    $prefId = $data["id"];
    if (!is_dir("../tmp")) mkdir("../tmp", 0777, true);
    
    file_put_contents("../tmp/cart_" . $prefId . ".json", json_encode([
        "cart" => $body["items"],
        "payer" => $preference["payer"],
        "turnoId" => $turnoId
    ]));
}

http_response_code($http_status);
echo $response;
?>