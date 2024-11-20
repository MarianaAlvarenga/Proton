<?php

$password = 'amigos'; // La contraseña original
$hashedPassword = password_hash($password, PASSWORD_BCRYPT); // Encriptación
echo $hashedPassword;

?>

$2y$10$6KrqdBxObLyFG7ioYdx/7./jhhkYOae/syUcol5tF3uWIPomXsbKC

INSERT INTO usuario (nombre, apellido, telefono, email, contrasenia, rol) 
VALUES ('Admin', 'Istrador', '123456789', 'admin@admin.com', '$2y$10$6KrqdBxObLyFG7ioYdx/7./jhhkYOae/syUcol5tF3uWIPomXsbKC
' , 4);