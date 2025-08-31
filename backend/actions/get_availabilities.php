<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight request para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$conn->set_charset('utf8');

if (!isset($_GET['id_peluquero'])) {
    http_response_code(400);
    echo json_encode(["message" => "ID de peluquero no proporcionado"]);
    exit();
}

$id_peluquero = $conn->real_escape_string($_GET['id_peluquero']);

// Query para obtener todas las disponibilidades del peluquero
$query = "
    SELECT 
        dd.fecha_disponible,
        hd.hora_inicial,
        hd.hora_final,
        td.id_usuario
    FROM tiene_dias td
    JOIN dias_disponibles dd ON td.id_dias_disponibles = dd.id_dias_disponibles
    JOIN dias_horas_disponibles dhd ON dd.id_dias_disponibles = dhd.id_dias_disponibles
    JOIN horas_disponibles hd ON dhd.id_horario_disponible = hd.id_horario_disponible
    WHERE td.id_usuario = ?
    ORDER BY dd.fecha_disponible ASC, hd.hora_inicial ASC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id_peluquero);
$stmt->execute();
$result = $stmt->get_result();

$availabilities = [];
while ($row = $result->fetch_assoc()) {
    // Cada disponibilidad se devuelve con fecha y horas
    $availabilities[] = [
        'fecha_disponible' => $row['fecha_disponible'],
        'hora_inicial' => $row['hora_inicial'],
        'hora_final' => $row['hora_final'],
        'esRango' => false // ya no se usan rangos, cada día es independiente
    ];
}

// Si no hay disponibilidades, devolver array vacío
if (empty($availabilities)) {
    echo json_encode([]);
} else {
    echo json_encode($availabilities);
}

$conn->close();
?>
