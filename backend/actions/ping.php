<?php
require_once '../includes/session_config.php';



// Esto muestra TODO lo que llega en la sesión
echo json_encode([
    "session_id" => session_id(),
    "session_vars" => $_SESSION,
    "cookies" => $_COOKIE
], JSON_PRETTY_PRINT);
