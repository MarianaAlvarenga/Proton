<?php
// Parámetros de conexión a la base de datos
$db_host = 'localhost';  // O tu host si no es localhost
$db_user = 'root';  // Tu usuario de base de datos
$db_password = '';  // Tu contraseña de base de datos
$db_name = 'proton';  // El nombre de la base de datos

// Crear la conexión
$conn = new mysqli($db_host, $db_user, $db_password, $db_name);

// Verificar si hay errores de conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
