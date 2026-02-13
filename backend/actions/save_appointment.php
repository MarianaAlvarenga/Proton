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

$data = json_decode(file_get_contents('php://input'), true);

if (
    empty($data['id_peluquero']) ||
    empty($data['fecha']) ||
    empty($data['hora_inicio']) ||
    empty($data['hora_fin']) ||
    empty($data['userRole']) ||
    empty($data['id_servicio']) // <--- NUEVO REQUISITO
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos, falta servicio"]);
    exit();
}

// Iniciamos una transacción para asegurar que se guarden AMBAS cosas o NINGUNA
$conn->begin_transaction();

try {
    // 👤 Identificar Cliente
    if ($data['userRole'] == 1) {
        $cliente_id = $data['id'];
    } else {
        if (empty($data['email_cliente'])) {
            throw new Exception("Email de cliente requerido.");
        }

        $stmt = $conn->prepare("SELECT id_usuario FROM usuario WHERE email = ? AND rol = 1");
        $stmt->bind_param("s", $data['email_cliente']);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        $stmt->close();

        if (!$row) {
            throw new Exception("El cliente con email " . $data['email_cliente'] . " no existe.");
        }
        $cliente_id = $row['id_usuario'];
    }

    // 1️⃣ INSERTAR EN TABLA 'turno'
    $pagado = 0; 
    $stmt = $conn->prepare("
        INSERT INTO turno (fecha, hora_inicio, hora_fin, cliente_id, id_peluquero, pagado)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "sssiii",
        $data['fecha'],
        $data['hora_inicio'],
        $data['hora_fin'],
        $cliente_id,
        $data['id_peluquero'],
        $pagado
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error al crear el turno: " . $stmt->error);
    }
    
    $nuevo_id_turno = $conn->insert_id;
    $stmt->close();

    // 2️⃣ INSERTAR EN TABLA INTERMEDIA 'servicio_prestado_en_turno'
    $stmt_intermedia = $conn->prepare("
        INSERT INTO servicio_prestado_en_turno (turno_id_turno, servicio_id_servicio)
        VALUES (?, ?)
    ");
    $stmt_intermedia->bind_param("ii", $nuevo_id_turno, $data['id_servicio']);
    
    if (!$stmt_intermedia->execute()) {
        throw new Exception("Error al vincular el servicio: " . $stmt_intermedia->error);
    }
    $stmt_intermedia->close();

    // Si todo salió bien, confirmamos los cambios
    $conn->commit();

    echo json_encode([
        "success" => true, 
        "turno_id" => $nuevo_id_turno,
        "message" => "Turno y servicio guardados correctamente"
    ]);

} catch (Exception $e) {
    // Si algo falla, deshacemos todo lo anterior
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();