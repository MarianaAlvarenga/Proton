<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Configuración de la base de datos
$host = 'localhost:3307'; // Cambia esto si usas otro puerto
$dbname = 'proton';       // Cambia esto por tu base de datos
$username = 'root';       // Usuario por defecto en XAMPP
$password = '';           // Contraseña por defecto vacía

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener los datos de usuarios junto con el nombre del rol
$sql = "SELECT u.id_usuario, u.nombre, u.apellido, r.rol
        FROM usuario u
        INNER JOIN rol r ON u.rol = r.id"; // Ajusta los nombres de columnas según tu base de datos
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($users);
} else {
    echo json_encode([]);
}

$conn->close();
?>
