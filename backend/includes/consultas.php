<?php

require_once '../includes/db.php'; // Incluir la conexión

function registrarUsuario($nombre, $apellido, $telefono, $email, $contrasenia, $rol) {
    global $conn;
    $query = "INSERT INTO usuario (nombre, apellido, telefono, email, contrasenia, rol) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssssss', $nombre, $apellido, $telefono, $email, $contrasenia);
    return $stmt->execute();
}

?>