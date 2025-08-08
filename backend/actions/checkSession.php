<?php
// Configurar CORS para permitir cookies
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "authenticated" => true,
        "user" => [
            "id_usuario" => $_SESSION['user_id'],
            "nombre" => $_SESSION['user_name'],
            "rol" => $_SESSION['user_role']
        ]
    ]);
} else {
    echo json_encode(["authenticated" => false]);
}
?>