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

// Obtener id_peluquero
$id_peluquero = intval($_GET['id_peluquero'] ?? 0);
if (!$id_peluquero) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Falta id_peluquero"]);
    exit();
}

try {
    $query = "
        SELECT 
            dd.fecha_disponible,
            hd.hora_inicial,
            hd.hora_final,
            dhd.id_usuario AS id_peluquero,
            t.id_turno,
            CASE 
                WHEN t.id_turno IS NOT NULL THEN 'ocupado'
                ELSE 'disponible'
            END AS estado
        FROM dias_horas_disponibles dhd
        JOIN dias_disponibles dd 
            ON dd.id_dias_disponibles = dhd.id_dias_disponibles
        JOIN horas_disponibles hd 
            ON hd.id_horario_disponible = dhd.id_horario_disponible
        LEFT JOIN turno t
            ON t.id_peluquero = dhd.id_usuario
           AND t.fecha = dd.fecha_disponible
           AND t.hora_inicio = hd.hora_inicial
           AND t.hora_fin = hd.hora_final
           AND NOT EXISTS (
                SELECT 1 
                FROM asistencia a 
                WHERE a.id_turno = t.id_turno
           )
        WHERE dhd.id_usuario = ?
        ORDER BY dd.fecha_disponible, hd.hora_inicial
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_peluquero);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
