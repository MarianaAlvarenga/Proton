<?php
require_once '../includes/session_config.php';
require_once '../includes/db.php';

header("Content-Type: application/json");

try {
    $pdo = new PDO(
        "mysql:host=$servername;port=$port;dbname=$dbname;charset=utf8",
        $username,
        $password
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error en la conexión",
        "error" => $e->getMessage()
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_mascota'])) {
    echo json_encode([
        "success" => false,
        "message" => "ID de mascota no recibido"
    ]);
    exit;
}

$id_mascota = $data['id_mascota'];

$query = "DELETE FROM mascota WHERE id_mascota = :id";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':id', $id_mascota, PDO::PARAM_INT);

$result = $stmt->execute();

if ($result && $stmt->rowCount() > 0) {
    echo json_encode([
        "success" => true,
        "message" => "Mascota eliminada correctamente"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "No se pudo eliminar la mascota"
    ]);
}
