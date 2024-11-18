<?php
session_start();
require_once '../includes/db.php'; // Archivo que contendrá la conexión a la base de datos
require_once '../includes/consultas.php'; // Incluir funciones de consultas

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   
        
    $nombre = $_POST['nombre'];
    $apellido= $_POST['apellido'];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];
    $contraseña = $_POST['contrasenia'];
    $confirm_contrasenia = $_POST['confirm_contraseña'];
    
    if ($contraseña === $confirm_contraseña) {
        // Verificar si el email ya está registrado
        $result = verificarUsuario($email);
        
        if ($result->num_rows > 0) {
            echo "Este email ya está registrado.";
            exit();
        }
        // Verificar que las contraseñas coinciden
        
        $contraseña_hash = password_hash($contraseña, PASSWORD_DEFAULT); // Encriptar contraseña
        
        if (registrarUsuario($usuario, $email, $telefono, $contraseña_hash)) {
            $_SESSION['message'] = "Usuario registrado exitosamente.";
            header('Location: ../pages/login.php'); // Redirigir a la página de inicio de sesión
            exit();
        } else {
            echo "Error al registrar usuario.";
        }
    } else {
            echo "Las contraseñas no coinciden.";
        }
    } elseif (isset($_POST['login'])) {
        // Login de usuario existente
        $email = $_POST['email'];
        $contraseña = $_POST['contraseña'];
        
        // Consulta para verificar usuario
        $result = verificarUsuario($email);
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            // Verificar la contraseña
            if (password_verify($contraseña, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_role'] = $user['role']; 
                $_SESSION['username'] = $user['username'];
                
                // Redirigir siempre a home.php
                header('Location: ../pages/home.php');
                exit();
            } else {
                echo "Contraseña incorrecta.";
            }
        } else {
            echo "No se encontró el usuario.";
        }
    }
}

// Cerrar conexión
$conn->close();
?>

