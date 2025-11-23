<?php
// Mismas configuraciones de cookies que auth-chatsito.php
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

// (Opcional) Log para debugging:
error_log("SUCCESS.PHP ===> Sesión actual: " . session_id());
error_log("SUCCESS.PHP ===> Contenido de la sesión: " . print_r($_SESSION, true));

// Simplemente redirigimos al frontend sin destruir sesión
header("Location: http://localhost:3000/success");
exit;
