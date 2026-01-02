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
$required = ['id_usuario','nombre','apellido','email','telefono','rol'];
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
$fecha_nacimiento = !empty($data['fecha_nacimiento']) ? $conn->real_escape_string($data['fecha_nacimiento']) : null;
$rol = intval($data['rol']);

/* =========================
   CONTRASEÑA (OPCIONAL)
========================= */
$contrasenia = null;
if (!empty($data['contrasenia'])) {
    $contrasenia = password_hash($data['contrasenia'], PASSWORD_BCRYPT);
}

/* =========================
   MANEJO DE IMAGEN (NUEVO)
========================= */
$img_url = null;

if (isset($_FILES['img']) && $_FILES['img']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../uploads/usuarios/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $extension = pathinfo($_FILES['img']['name'], PATHINFO_EXTENSION);
    $fileName = 'user_' . $id . '_' . time() . '.' . $extension;
    $filePath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['img']['tmp_name'], $filePath)) {
        $img_url = 'usuarios/' . $fileName;
    }
}

/* =========================
   UPDATE USUARIO
========================= */
if ($contrasenia !== null) {
    if ($img_url !== null) {
        $query = "UPDATE usuario 
                  SET nombre=?, apellido=?, email=?, telefono=?, rol=?, fecha_nacimiento=?, contrasenia=?, img_url=?
                  WHERE id_usuario=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssisssi", $nombre, $apellido, $email, $telefono, $rol, $fecha_nacimiento, $contrasenia, $img_url, $id);
    } else {
        $query = "UPDATE usuario 
                  SET nombre=?, apellido=?, email=?, telefono=?, rol=?, fecha_nacimiento=?, contrasenia=?
                  WHERE id_usuario=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssissi", $nombre, $apellido, $email, $telefono, $rol, $fecha_nacimiento, $contrasenia, $id);
    }
} else {
    if ($img_url !== null) {
        if ($fecha_nacimiento !== null) {
            $query = "UPDATE usuario 
                      SET nombre=?, apellido=?, email=?, telefono=?, rol=?, fecha_nacimiento=?, img_url=?
                      WHERE id_usuario=?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssssissi", $nombre, $apellido, $email, $telefono, $rol, $fecha_nacimiento, $img_url, $id);
        } else {
            $query = "UPDATE usuario 
                      SET nombre=?, apellido=?, email=?, telefono=?, rol=?, img_url=?
                      WHERE id_usuario=?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssssisi", $nombre, $apellido, $email, $telefono, $rol, $img_url, $id);
        }
    } else {
        if ($fecha_nacimiento !== null) {
            $query = "UPDATE usuario 
                      SET nombre=?, apellido=?, email=?, telefono=?, rol=?, fecha_nacimiento=?
                      WHERE id_usuario=?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssssisi", $nombre, $apellido, $email, $telefono, $rol, $fecha_nacimiento, $id);
        } else {
            $query = "UPDATE usuario 
                      SET nombre=?, apellido=?, email=?, telefono=?, rol=?
                      WHERE id_usuario=?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssssii", $nombre, $apellido, $email, $telefono, $rol, $id);
        }
    }
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
