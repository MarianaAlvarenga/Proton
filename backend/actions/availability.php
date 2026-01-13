<?php
require_once '../includes/session_config.php';
require_once '../includes/db.php';

header("Content-Type: application/json; charset=UTF-8");

class AvailabilityController {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function saveAvailability($id_peluquero, $disponibilidades) {
        if (!$id_peluquero || !is_array($disponibilidades)) {
            throw new Exception("Parámetros inválidos");
        }

        $selectDia = $this->conn->prepare(
            "SELECT id_dias_disponibles FROM dias_disponibles WHERE fecha_disponible = ?"
        );
        $insertDia = $this->conn->prepare(
            "INSERT INTO dias_disponibles (fecha_disponible) VALUES (?)"
        );

        $selectHora = $this->conn->prepare(
            "SELECT id_horario_disponible FROM horas_disponibles WHERE hora_inicial = ? AND hora_final = ?"
        );
        $insertHora = $this->conn->prepare(
            "INSERT INTO horas_disponibles (hora_inicial, hora_final) VALUES (?, ?)"
        );

        $selectDHD = $this->conn->prepare(
            "SELECT 1 FROM dias_horas_disponibles 
             WHERE id_dias_disponibles = ? 
               AND id_horario_disponible = ? 
               AND id_usuario = ?"
        );
        $insertDHD = $this->conn->prepare(
            "INSERT INTO dias_horas_disponibles 
             (id_dias_disponibles, id_horario_disponible, id_usuario)
             VALUES (?, ?, ?)"
        );

        foreach ($disponibilidades as $disp) {
            if (empty($disp['fecha_disponible']) || empty($disp['hora_inicial']) || empty($disp['hora_final'])) {
                continue;
            }

            // Día
            $selectDia->bind_param("s", $disp['fecha_disponible']);
            $selectDia->execute();
            $res = $selectDia->get_result();

            if ($row = $res->fetch_assoc()) {
                $idDia = $row['id_dias_disponibles'];
            } else {
                $insertDia->bind_param("s", $disp['fecha_disponible']);
                $insertDia->execute();
                $idDia = $insertDia->insert_id;
            }

            // Hora
            $selectHora->bind_param("ss", $disp['hora_inicial'], $disp['hora_final']);
            $selectHora->execute();
            $res = $selectHora->get_result();

            if ($row = $res->fetch_assoc()) {
                $idHora = $row['id_horario_disponible'];
            } else {
                $insertHora->bind_param("ss", $disp['hora_inicial'], $disp['hora_final']);
                $insertHora->execute();
                $idHora = $insertHora->insert_id;
            }

            // Día + Hora + Peluquero
            $selectDHD->bind_param("iii", $idDia, $idHora, $id_peluquero);
            $selectDHD->execute();
            $res = $selectDHD->get_result();

            if (!$res->fetch_assoc()) {
                $insertDHD->bind_param("iii", $idDia, $idHora, $id_peluquero);
                $insertDHD->execute();
            }
        }

        $selectDia->close();
        $insertDia->close();
        $selectHora->close();
        $insertHora->close();
        $selectDHD->close();
        $insertDHD->close();
    }
}

// ---------------- MAIN ----------------

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit();
}
$conn->set_charset('utf8');

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id_peluquero']) || empty($data['disponibilidades'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

try {
    $controller = new AvailabilityController($conn);
    $controller->saveAvailability($data['id_peluquero'], $data['disponibilidades']);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
