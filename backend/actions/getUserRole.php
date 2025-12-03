<?php

require_once '../includes/session_config.php';

require_once '../includes/db.php';

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al conectar con la base de datos."
    ]);
    exit;
}

// Debugging: Verificar si la sesión contiene user_id
error_log("Sesión activa: " . json_encode($_SESSION));

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Usuario no autenticado."
    ]);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // Consulta para obtener el rol del usuario
    $stmt = $pdo->prepare("SELECT rol FROM usuario WHERE id_usuario = :id");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $userRole = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userRole) {
        echo json_encode([
            "success" => true,
            "user" => [
                "rol" => (int) $userRole['rol']
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Rol no encontrado."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener el rol: " . $e->getMessage()
    ]);
}
?>
