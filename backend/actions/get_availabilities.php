<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$conn->set_charset('utf8');

// Aceptar id_peluquero por GET (query param) o por JSON en body
$id_peluquero = null;
if (isset($_GET['id_peluquero']) && !empty($_GET['id_peluquero'])) {
    $id_peluquero = intval($_GET['id_peluquero']);
} else {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id_peluquero']) && !empty($data['id_peluquero'])) {
        $id_peluquero = intval($data['id_peluquero']);
    }
}

if (!$id_peluquero) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Falta el id_peluquero."]);
    exit();
}

try {
    // Limpieza de datos huérfanos
    $conn->query("DELETE FROM dias_horas_disponibles WHERE id_dias_disponibles NOT IN (SELECT id_dias_disponibles FROM dias_disponibles)");
    $conn->query("DELETE FROM dias_horas_disponibles WHERE id_horario_disponible NOT IN (SELECT id_horario_disponible FROM horas_disponibles)");
    $conn->query("DELETE FROM dias_disponibles WHERE id_dias_disponibles NOT IN (SELECT id_dias_disponibles FROM dias_horas_disponibles)");
    $conn->query("DELETE FROM horas_disponibles WHERE id_horario_disponible NOT IN (SELECT id_horario_disponible FROM dias_horas_disponibles)");
    $conn->query("DELETE FROM tiene_dias WHERE id_dias_disponibles NOT IN (SELECT id_dias_disponibles FROM dias_disponibles)");

    // Traer disponibilidades actuales para el peluquero
    $query = "
        SELECT 
            dd.fecha_disponible, 
            hd.hora_inicial, 
            hd.hora_final, 
            td.id_usuario AS id_peluquero,
            t.id_turno,
            CASE 
                WHEN t.id_turno IS NOT NULL THEN 'ocupado' 
                ELSE 'disponible' 
            END AS estado
        FROM tiene_dias td 
        JOIN dias_disponibles dd ON td.id_dias_disponibles = dd.id_dias_disponibles
        JOIN dias_horas_disponibles dhd ON dd.id_dias_disponibles = dhd.id_dias_disponibles
        JOIN horas_disponibles hd ON dhd.id_horario_disponible = hd.id_horario_disponible
        LEFT JOIN turno t ON t.id_peluquero = td.id_usuario 
            AND t.fecha = dd.fecha_disponible 
            AND t.hora_inicio = hd.hora_inicial 
            AND t.hora_fin = hd.hora_final
        WHERE td.id_usuario = ?
        ORDER BY dd.fecha_disponible, hd.hora_inicial
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_peluquero);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $disponibilidades = [];
    while ($row = $result->fetch_assoc()) {
        $disponibilidades[] = [
            "fecha_disponible" => $row['fecha_disponible'],
            "hora_inicial" => $row['hora_inicial'],
            "hora_final" => $row['hora_final'],
            "id_peluquero" => $row['id_peluquero'],
            "id_turno" => $row['id_turno'],
            "estado" => $row['estado']
        ];
    }
    
    http_response_code(200);
    echo json_encode($disponibilidades);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>