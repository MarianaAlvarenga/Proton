<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

session_start();
session_destroy();
session_write_close();

echo json_encode(["success" => true, "message" => "Sesión cerrada"]);
exit;
?>
