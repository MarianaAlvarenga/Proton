<?php
require_once '../includes/session_config.php';
require_once '../includes/db.php';

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Conexión fallida: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $codigo_producto = $_POST['codigo_producto'] ?? null;
    $nombre_producto = $_POST['nombre_producto'] ?? null;
    $descripcion_producto = $_POST['descripcion_producto'] ?? null;
    $stock_producto = $_POST['stock_producto'] ?? null;
    $punto_reposicion = $_POST['punto_reposicion'] ?? null;
    $categoria_id_categoria = $_POST['categoria_id_categoria'] ?? null;
    $precio_producto = $_POST['precio_producto'] ?? null;

    // ✅ Validación correcta (0 es válido)
    if (
        trim($codigo_producto) === "" ||
        trim($nombre_producto) === "" ||
        trim($descripcion_producto) === "" ||
        $stock_producto === null ||
        $punto_reposicion === null ||
        $categoria_id_categoria === null ||
        $precio_producto === null
    ) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
        exit;
    }

    // =============================
    //  Manejo de imagen
    // =============================
    $newImage = null;

    if (isset($_FILES['image_url']) && $_FILES['image_url']['error'] === UPLOAD_ERR_OK) {

        $uploadDir = "../uploads/";
        $fileName = time() . "_" . basename($_FILES['image_url']['name']);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image_url']['tmp_name'], $targetPath)) {
            $newImage = "http://localhost:8888/backend/uploads/" . $fileName;
        }

    } else {
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
