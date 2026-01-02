<?php
require_once '../includes/session_config.php';
header("Content-Type: application/json");


$uploadDir = "../uploads/usuarios/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['imagen']['tmp_name'];
    $name = uniqid() . "-" . basename($_FILES['imagen']['name']);
    $filePath = $uploadDir . $name;

    if (move_uploaded_file($tmpName, $filePath)) {
        $publicPath = "usuarios/" . $name;
echo json_encode(["success" => true, "url" => $publicPath]);


    } else {
        echo json_encode(["success" => false, "message" => "No se pudo guardar la imagen."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error al subir la imagen."]);
}
?>