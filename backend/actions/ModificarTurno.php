CREATE TABLE turno (
 id_turno INT NOT NULL AUTO_INCREMENT,
 fecha DATE NOT NULL,
 hora_inicio TIME NOT NULL,
 hora_fin TIME,
 estado VARCHAR(10) NOT NULL,
 peluquero_id_usuario INT NOT NULL,
 cliente_vendedor_id_usuario INT NOT NULL,
 administrador_id_usuario INT NOT NULL,
 PRIMARY KEY (id_turno)
);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener datos del formulario
    $id = $_POST['id']; // Mantengo id? O desecho y formo nueva fila?
    $fecha = $_POST['fecha'];
    $hora_inicio = $_POST['hora_inicio'];
    $hora_fin = $_POST['hora_fin'];

    $sql = "UPDATE turno SET name=?, email=?, age=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssii", $name, $email, $age, $id);

    if ($stmt->execute()) {
        echo "Usuario modificado exitosamente.";
    } else {
        echo "Error al modificar usuario: " . $stmt->error;
    }

    $stmt->close();
}