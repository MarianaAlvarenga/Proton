<?php
require_once '../includes/session_config.php';
header("Content-Type: application/json");

$uploadDir = "../uploads/usuarios/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {

    $tmpName = $_FILES['imagen']['tmp_name'];

    // Nombre original
    $originalName = $_FILES['imagen']['name'];

    // Limpio el nombre: sin espacios, paréntesis ni cosas raras
    $cleanName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);

    // Nombre final único
    $finalName = uniqid() . "_" . $cleanName;

    $filePath = $uploadDir . $finalName;

    if (move_uploaded_file($tmpName, $filePath)) {

        // ⚠️ IMPORTANTE: devuelvo SOLO la ruta relativa (sin localhost)
        $publicPath = "usuarios/" . $finalName;

        echo json_encode([
            "success" => true,
            "url" => $publicPath
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No se pudo guardar la imagen."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al subir la imagen."
    ]);
}
?>
