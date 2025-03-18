<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Conexión a la base de datos
$host = 'localhost:3307';
$db = 'proton';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error en la conexión: " . $e->getMessage()]);
    exit;
}

// Obtén los datos de entrada
$data = json_decode(file_get_contents("php://input"), true);

if ($data === null || !isset($data['id']) || !is_numeric($data['id'])) {
    echo json_encode(["success" => false, "message" => "ID de usuario no válido."]);
    exit;
}

$id = intval($data['id']);

$sql = "DELETE FROM usuario WHERE id_usuario = ?";
$stmt = $pdo->prepare($sql);

try {
    if ($stmt->execute([$id])) {
        echo json_encode(["success" => true, "message" => "Usuario eliminado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "No se pudo eliminar el usuario."]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error en la consulta: " . $e->getMessage()]);
}
exit;
?>
