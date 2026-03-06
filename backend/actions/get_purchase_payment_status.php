<?php
// CORS dinámico: permitir múltiples orígenes válidos
$allowedOrigins = [
    'https://skin-kevin-whatever-program.trycloudflare.com',
    'https://unless-scene-secrets-burst.trycloudflare.com',
    'https://gen-dubai-anytime-asks.trycloudflare.com'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback al primero si no coincide
    header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
}

header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

$ref = isset($_GET['ref']) ? (string)$_GET['ref'] : '';

// Log para debug
$logFile = __DIR__ . "/../tmp/polling_debug.log";
file_put_contents($logFile, "[" . date("Y-m-d H:i:s") . "] get_purchase_payment_status.php llamado con ref: " . $ref . PHP_EOL, FILE_APPEND);

// Validación básica para evitar path traversal
if ($ref === '' || !preg_match('/^[A-Za-z0-9_-]+$/', $ref)) {
    file_put_contents($logFile, "[" . date("Y-m-d H:i:s") . "] ERROR: Referencia inválida: " . $ref . PHP_EOL, FILE_APPEND);
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Referencia inválida", "ref_received" => $ref]);
    exit;
}

$statusPath = __DIR__ . "/../tmp/purchase_status_" . $ref . ".json";
file_put_contents($logFile, "[" . date("Y-m-d H:i:s") . "] Buscando archivo: " . $statusPath . PHP_EOL, FILE_APPEND);

if (!file_exists($statusPath)) {
    file_put_contents($logFile, "[" . date("Y-m-d H:i:s") . "] Archivo NO existe, retornando pending" . PHP_EOL, FILE_APPEND);
    echo json_encode([
        "success" => true,
        "paid" => false,
        "status" => "pending"
    ]);
    exit;
}

$raw = file_get_contents($statusPath);
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode([
        "success" => true,
        "paid" => false,
        "status" => "pending"
    ]);
    exit;
}

$paid = isset($data["paid"]) ? (bool)$data["paid"] : false;
$carritoId = isset($data["carritoId"]) ? (int)$data["carritoId"] : null;

file_put_contents($logFile, "[" . date("Y-m-d H:i:s") . "] Archivo existe, paid=" . ($paid ? "true" : "false") . ", carritoId=" . ($carritoId ?? "null") . PHP_EOL, FILE_APPEND);

echo json_encode([
    "success" => true,
    "paid" => $paid,
    "status" => $paid ? "approved" : "pending",
    "carritoId" => $carritoId
]);

