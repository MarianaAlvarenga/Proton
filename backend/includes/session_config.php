<?php

// ---- ORÍGENES PERMITIDOS ----
$allowed_origins = [
    "http://localhost:3000",
];

// Si viene desde un túnel de Cloudflare, también permitirlo
if (isset($_SERVER["HTTP_ORIGIN"]) && preg_match("/trycloudflare\.com$/", $_SERVER["HTTP_ORIGIN"])) {
    $allowed_origins[] = $_SERVER["HTTP_ORIGIN"];
}

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Responder preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// -------------------------------
// SESIÓN
// -------------------------------

session_name("PROTONSESSID");

ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', '1');
ini_set('session.cookie_httponly', '1');

session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);

// Guardar sesiones en disco
$session_dir = __DIR__ . '/../sessions';
if (!is_dir($session_dir)) {
    mkdir($session_dir, 0777, true);
}
ini_set('session.save_path', $session_dir);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
