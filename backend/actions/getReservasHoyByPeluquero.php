<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../includes/db.php";

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

$conn->set_charset("utf8");

$id_peluquero = $_GET["id_peluquero"] ?? null;

if (!$id_peluquero) {
    http_response_code(400);
    echo json_encode(["error" => "Falta id_peluquero"]);
    exit;
}

$sql = "
    SELECT
        t.id_turno,
        t.fecha,
        t.hora_inicio,
        t.hora_fin,
        u.id_usuario AS cliente_id,
        u.nombre,
        u.apellido,
        u.email
    FROM turno t
INNER JOIN usuario u 
    ON u.id_usuario = t.cliente_id
LEFT JOIN asistencia a 
    ON a.id_turno = t.id_turno
WHERE t.id_peluquero = ?
  AND t.fecha = CURDATE()
  AND a.id_turno IS NULL

    ORDER BY t.hora_inicio
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_peluquero);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$conn->close();
