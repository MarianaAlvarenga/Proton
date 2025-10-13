<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || empty($data['id_peluquero']) || empty($data['fecha']) || empty($data['hora_inicio']) || empty($data['hora_fin'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos o inválidos. Se requiere id_peluquero, fecha, hora_inicio y hora_fin."]);
    exit();
}

try {
    $conn->begin_transaction();
    
    $id_peluquero = $data['id_peluquero'];
    $fecha = $data['fecha'];
    $hora_inicio = $data['hora_inicio'];
    $hora_fin = $data['hora_fin'];

    // Buscar la disponibilidad específica
    $stmt = $conn->prepare("
        SELECT 
            dd.id_dias_disponibles, 
            hd.id_horario_disponible
        FROM tiene_dias td 
        JOIN dias_disponibles dd ON td.id_dias_disponibles = dd.id_dias_disponibles
        JOIN dias_horas_disponibles dhd ON dd.id_dias_disponibles = dhd.id_dias_disponibles
        JOIN horas_disponibles hd ON dhd.id_horario_disponible = hd.id_horario_disponible
        WHERE td.id_usuario = ? 
        AND dd.fecha_disponible = ? 
        AND hd.hora_inicial = ? 
        AND hd.hora_final = ?
    ");
    $stmt->bind_param("isss", $id_peluquero, $fecha, $hora_inicio, $hora_fin);
    $stmt->execute();
    $result = $stmt->get_result();
    $relacion = $result->fetch_assoc();
    $stmt->close();

    if (!$relacion) {
        throw new Exception("No se encontró la disponibilidad especificada.");
    }

    $id_dias_disponibles = $relacion['id_dias_disponibles'];
    $id_horario_disponible = $relacion['id_horario_disponible'];

    // Primero verificar si hay un turno reservado en esta disponibilidad y eliminarlo
    $stmt = $conn->prepare("
        SELECT id_turno FROM turno 
        WHERE id_peluquero = ? 
        AND fecha = ? 
        AND hora_inicio = ? 
        AND hora_fin = ?
    ");
    $stmt->bind_param("isss", $id_peluquero, $fecha, $hora_inicio, $hora_fin);
    $stmt->execute();
    $result = $stmt->get_result();
    $turno = $result->fetch_assoc();
    $stmt->close();

    if ($turno) {
        // Eliminar el turno si existe
        $stmt = $conn->prepare("DELETE FROM turno WHERE id_turno = ?");
        $stmt->bind_param("i", $turno['id_turno']);
        $stmt->execute();
        $stmt->close();
    }

    // **CORRECCIÓN PRINCIPAL**: Solo eliminar la relación específica en dias_horas_disponibles
    // NO eliminar la relación en tiene_dias ni el día completo
    $stmt = $conn->prepare("DELETE FROM dias_horas_disponibles WHERE id_dias_disponibles = ? AND id_horario_disponible = ?");
    $stmt->bind_param("ii", $id_dias_disponibles, $id_horario_disponible);
    $stmt->execute();
    $affected_rows = $stmt->affected_rows;
    $stmt->close();

    if ($affected_rows === 0) {
        throw new Exception("No se pudo eliminar la relación de horario.");
    }

    // Verificar si quedan más horarios para este día
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM dias_horas_disponibles WHERE id_dias_disponibles = ?");
    $stmt->bind_param("i", $id_dias_disponibles);
    $stmt->execute();
    $count_horarios = $stmt->get_result()->fetch_assoc()['count'];
    $stmt->close();

    // Si NO quedan más horarios para este día, entonces limpiar todo
    if ($count_horarios == 0) {
        // Eliminar relación en tiene_dias
        $stmt = $conn->prepare("DELETE FROM tiene_dias WHERE id_usuario = ? AND id_dias_disponibles = ?");
        $stmt->bind_param("ii", $id_peluquero, $id_dias_disponibles);
        $stmt->execute();
        $stmt->close();

        // Eliminar el día
        $stmt = $conn->prepare("DELETE FROM dias_disponibles WHERE id_dias_disponibles = ?");
        $stmt->bind_param("i", $id_dias_disponibles);
        $stmt->execute();
        $stmt->close();
    }

    // Borrar horario si ya no está usado en otros días
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM dias_horas_disponibles WHERE id_horario_disponible = ?");
    $stmt->bind_param("i", $id_horario_disponible);
    $stmt->execute();
    $count_dias = $stmt->get_result()->fetch_assoc()['count'];
    $stmt->close();

    if ($count_dias == 0) {
        $stmt = $conn->prepare("DELETE FROM horas_disponibles WHERE id_horario_disponible = ?");
        $stmt->bind_param("i", $id_horario_disponible);
        $stmt->execute();
        $stmt->close();
    }

    $conn->commit();
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Disponibilidad eliminada correctamente."]);
    
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>