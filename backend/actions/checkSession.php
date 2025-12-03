<?php
require_once '../includes/session_config.php';


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