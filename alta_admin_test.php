<?php

$password = 'lol'; // La contraseña original
$hashedPassword = password_hash($password, PASSWORD_BCRYPT); // Encriptación
echo $hashedPassword;

?>

$2y$10$6KrqdBxObLyFG7ioYdx/7./jhhkYOae/syUcol5tF3uWIPomXsbKC

INSERT INTO usuario (nombre, apellido, telefono, email, contrasenia, rol) 
VALUES ('Lol', 'Istrador', '123456789', 'lol@lol.com', '$2y$10$Dc544k5adRVrzIBHVcW5qui.461915YUAh.9rPwNkqCJrgGtvUCWu', 4);