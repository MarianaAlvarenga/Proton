<?php
require_once '../includes/session_config.php';

session_destroy();
session_write_close();

echo json_encode(["success" => true, "message" => "Cerrar sesión"]);
exit;
?>
