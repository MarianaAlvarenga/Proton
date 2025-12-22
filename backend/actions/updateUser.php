<?php
require_once '../includes/session_config.php';
header("Content-Type: application/json");

require_once '../includes/db.php';
$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

$data = $_POST;

/* =========================
   VALIDACIONES BÁSICAS
========================= */
$required = ['id_usuario','nombre','apellido','email','telefono','rol','fecha_nacimiento'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        echo json_encode(["success" => false, "message" => "Falta el campo $field"]);
        exit;
    }
}

/* =========================
   DATOS
========================= */
$id = intval($data['id_usuario']);
$nombre = $conn->real_escape_string($data['nombre']);
$apellido = $conn->real_escape_string($data['apellido']);
$email = $conn->real_escape_string($data['email']);
$telefono = $conn->real_escape_string($data['telefono']);
$fecha_nacimiento = $conn->real_escape_string($data['fecha_nacimiento']);
$rol = intval($data['rol']);

/* =========================
   CONTRASEÑA (OPCIONAL)
========================= */
$contrasenia = null;
if (!empty($data['contrasenia'])) {
    $contrasenia = password_hash($data['contrasenia'], PASSWORD_BCRYPT);
}

/* =========================
   UPDATE USUARIO
========================= */
if ($contrasenia !== null) {
    $query = "UPDATE usuario 
              SET nombre=?, apellido=?, email=?, telefono=?, rol=?, fecha_nacimiento=?, contrasenia=?
              WHERE id_usuario=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param(
        "ssssissi",
        $nombre,
        $apellido,
        $email,
        $telefono,
        $rol,
        $fecha_nacimiento,
        $contrasenia,
        $id
    );
} else {
    $query = "UPDATE usuario 
              SET nombre=?, apellido=?, email=?, telefono=?, rol=?, fecha_nacimiento=?
              WHERE id_usuario=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param(
        "ssssisi",
        $nombre,
        $apellido,
        $email,
        $telefono,
        $rol,
        $fecha_nacimiento,
        $id
    );
}

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => $stmt->error]);
    exit;
}

/* =========================
   ESPECIALIDADES
========================= */

// 🔥 SIEMPRE limpiar
$conn->query("DELETE FROM peluquero_ofrece_servicio WHERE peluquero_id_usuario = $id");

// 🔥 SOLO volver a insertar si es peluquero
if ($rol === 3 && isset($data['especialidad'])) {

    $especialidades = json_decode($data['especialidad'], true);
    if (!is_array($especialidades)) {
        $especialidades = [];
    }

    foreach ($especialidades as $espId) {
        $espId = intval($espId);
        if ($espId > 0) {
            $conn->query(
                "INSERT INTO peluquero_ofrece_servicio (peluquero_id_usuario, servicio_id_servicio)
                 VALUES ($id, $espId)"
            );
        }
    }
}

$stmt->close();
$conn->close();

echo json_encode([
    "success" => true,
    "message" => "Usuario actualizado correctamente"
]);
