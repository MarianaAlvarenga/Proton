<?php
require_once '../includes/session_config.php';

header("Content-Type: application/json");

if (isset($_SESSION['currentUserId'])) {
    echo json_encode([
        "authenticated" => true,
        "user" => [
            "id_usuario" => $_SESSION['currentUserId'],
            "nombre" => $_SESSION['currentUserName'],
            "rol" => $_SESSION['currentUserRole']
        ]
    ]);
} else {
    echo json_encode(["authenticated" => false]);
}
?>
