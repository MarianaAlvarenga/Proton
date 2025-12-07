<?php
require_once '../includes/session_config.php';
require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Conexión fallida: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $codigo_producto = $_POST['codigo_producto'];
    $nombre_producto = $_POST['nombre_producto'];
    $descripcion_producto = $_POST['descripcion_producto'];
    $stock_producto = $_POST['stock_producto'];
    $punto_reposicion = $_POST['punto_reposicion'];
    $categoria_id_categoria = $_POST['categoria_id_categoria'];
    $precio_producto = $_POST['precio_producto'];

    if (
        empty($codigo_producto) || empty($nombre_producto) || empty($descripcion_producto) ||
        empty($stock_producto) || empty($punto_reposicion) || empty($categoria_id_categoria) ||
        empty($precio_producto)
    ) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
        exit;
    }

    // =============================
    //  Manejo de imagen
    // =============================
    $newImage = null;

    // Si el usuario sube una nueva imagen
    if (isset($_FILES['image_url']) && $_FILES['image_url']['error'] === UPLOAD_ERR_OK) {

        $uploadDir = "../uploads/";
        $fileName = time() . "_" . basename($_FILES['image_url']['name']);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image_url']['tmp_name'], $targetPath)) {
            // 🚀 guardamos ruta relativa
            $newImage = "http://localhost:8888/backend/uploads/" . $fileName;

        }

    } else {
        // No se subió imagen → mantener la anterior
        $q = $conn->query("SELECT image_url FROM producto WHERE codigo_producto = '$codigo_producto'");
        $r = $q->fetch_assoc();
        $newImage = $r['image_url'];
    }

    // =============================
    //  UPDATE
    // =============================
    $sql = "UPDATE producto 
            SET nombre_producto = ?, 
                descripcion_producto = ?, 
                stock_producto = ?, 
                punto_reposicion = ?, 
                categoria_id_categoria = ?, 
                precio_producto = ?, 
                image_url = ?
            WHERE codigo_producto = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssiiissi",
        $nombre_producto,
        $descripcion_producto,
        $stock_producto,
        $punto_reposicion,
        $categoria_id_categoria,
        $precio_producto,
        $newImage,
        $codigo_producto
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Producto actualizado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el producto: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>
