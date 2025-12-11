<?php
require_once '../includes/session_config.php';
header("Content-Type: application/json");


$uploadDir = "../uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['imagen']['tmp_name'];
    $name = uniqid() . "-" . basename($_FILES['imagen']['name']);
    $filePath = $uploadDir . $name;

    if (move_uploaded_file($tmpName, $filePath)) {
        $publicURL = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['HTTP_HOST'] . "/backend/uploads/" . $name;
echo json_encode(["success" => true, "url" => $publicURL]);

    } else {
        echo json_encode(["success" => false, "message" => "No se pudo guardar la imagen."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error al subir la imagen."]);
}
?>