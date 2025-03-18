<?php
// Habilitar CORS para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Configuración de conexión a la base de datos
require_once '../includes/db.php';
try {
    // Crear una conexión PDO a la base de datos
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ejecutar la consulta para obtener los roles
    $query = "SELECT id, rol FROM rol"; // Asegúrate de que la tabla y las columnas existan
    $stmt = $pdo->query($query);

    // Obtener los resultados como un array asociativo
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver los roles en formato JSON
    echo json_encode($roles);
} catch (PDOException $e) {
    // Manejo de errores en caso de problemas de conexión o consulta
    http_response_code(500); // Error interno del servidor
    echo json_encode([
        "error" => true,
        "message" => "Error al obtener los roles: " . $e->getMessage()
    ]);
}
?>
