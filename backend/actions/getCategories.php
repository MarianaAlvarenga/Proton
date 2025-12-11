<?php
require_once '../includes/session_config.php';


// El resto de tu código PHP...

// Configuración de conexión a la base de datos
require_once '../includes/db.php';
// Establecer la conexión a la base de datos
try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta SQL para obtener las categorías
    $sql = "SELECT id_categoria, nombre_categoria FROM categoria"; // Ajusta según tu estructura de tabla
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Obtener los resultados
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver los resultados como JSON
    echo json_encode($categories);

} catch (PDOException $e) {
    // Manejo de errores
    echo json_encode(['error' => 'Error en la conexión a la base de datos: ' . $e->getMessage()]);
}
?>
