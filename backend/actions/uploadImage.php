<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000"); // Permitir solicitudes desde el frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Cabeceras permitidas

$uploadDir = "../uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['imagen']['tmp_name'];
    $name = uniqid() . "-" . basename($_FILES['imagen']['name']);
    $filePath = $uploadDir . $name;

    if (move_uploaded_file($tmpName, $filePath)) {
        echo json_encode(["success" => true, "url" => $filePath]);
    } else {
        echo json_encode(["success" => false, "message" => "No se pudo guardar la imagen."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error al subir la imagen."]);
}
?>