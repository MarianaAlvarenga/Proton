<?php
require_once '../includes/session_config.php';
require_once '../includes/db.php';

header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit();
}
$conn->set_charset('utf8');

if (empty($_GET['id_turno'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Falta id_turno"]);
    exit();
}

$id_turno = intval($_GET['id_turno']);

$query = "
    SELECT 
        t.id_turno,
        t.fecha,
        t.hora_inicio,
        t.hora_fin,
        t.pagado,
        COALESCE(SUM(s.precio), 0) AS precio,
        uc.nombre  AS cliente_nombre,
        uc.apellido AS cliente_apellido,
        up.nombre  AS peluquero_nombre,
        up.apellido AS peluquero_apellido
    FROM turno t
    JOIN usuario uc ON uc.id_usuario = t.cliente_id
    JOIN usuario up ON up.id_usuario = t.id_peluquero
    LEFT JOIN servicio_prestado_en_turno spt ON t.id_turno = spt.turno_id_turno
    LEFT JOIN servicio s ON spt.servicio_id_servicio = s.id_servicio
    WHERE t.id_turno = ?
    GROUP BY t.id_turno
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id_turno);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Turno no encontrado"]);
    exit();
}

$data = $result->fetch_assoc();

// Forzamos tipos de datos limpios
$data['pagado'] = (int)$data['pagado'] === 1;
$data['precio'] = (float)$data['precio'];

echo json_encode([
    "success" => true,
    "turno" => $data
]);

$stmt->close();
$conn->close();