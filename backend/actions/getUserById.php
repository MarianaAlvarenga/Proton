<?php
require_once '../includes/session_config.php';

// Incluir archivo de conexión y crear objeto de conexión
require_once '../includes/db.php';
$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verificar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

// Leer JSON enviado
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {   // 🔹 CAMBIO: antes decía userId
    echo json_encode(["success" => false, "message" => "Falta ID de usuario"]);
    exit;
}

$id = intval($data['id']);   // 🔹 CAMBIO: ahora definimos $id directamente

// Consulta usuario
$query = "SELECT id_usuario, nombre, apellido, email, telefono, rol, fecha_nacimiento, img_url 
          FROM usuario WHERE id_usuario = ?";
$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error en la consulta"]);
    $conn->close();
    exit;
}
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Si img_url existe y no es URL absoluta, corregir
    if (!empty($user['img_url'])) {
        if (strpos($user['img_url'], 'http') !== 0) {
            $baseUrl = "http://localhost:8080/Proton/backend/uploads/";
            $user['img_url'] = $baseUrl . $user['img_url'];
        }
    }

    // Traer especialidades (si corresponde)
    $espQuery = "SELECT s.id_servicio, s.nombre
                 FROM peluquero_ofrece_servicio pos
                 INNER JOIN servicio s ON pos.servicio_id_servicio = s.id_servicio
                 WHERE pos.peluquero_id_usuario = ?";
    $espStmt = $conn->prepare($espQuery);
    if ($espStmt) {
        $espStmt->bind_param("i", $id);
        $espStmt->execute();
        $espResult = $espStmt->get_result();
        $especialidades = [];
        if ($espResult) {
            while ($row = $espResult->fetch_assoc()) {
                $especialidades[] = $row;
            }
        }
        $espStmt->close();
        $user['especialidades'] = $especialidades;
    } else {
        // Si la tabla/relación no aplica, devolvemos array vacío
        $user['especialidades'] = [];
    }

    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
exit;
?>
