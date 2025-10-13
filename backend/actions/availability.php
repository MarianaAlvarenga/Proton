<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../includes/db.php';

// Incluir el controlador directamente (sin require_once separado)
class AvailabilityController {
    private $conn;

    public function __construct($mysqliConnection) {
        $this->conn = $mysqliConnection;
    }

    /**
     * Guarda disponibilidades para un peluquero
     */
    public function saveAvailability($id_peluquero, $disponibilidades) {
        if (empty($id_peluquero) || !is_array($disponibilidades)) {
            throw new Exception("Parámetros inválidos para saveAvailability.");
        }

        // Preparar consultas reutilizables
        $select_dia_stmt = $this->conn->prepare("SELECT id_dias_disponibles FROM dias_disponibles WHERE fecha_disponible = ?");
        $insert_dia_stmt = $this->conn->prepare("INSERT INTO dias_disponibles (fecha_disponible) VALUES (?)");
        
        // CORREGIDO: No buscar id_tiene_dias ya que no existe en la tabla
        $select_tiene_dias_stmt = $this->conn->prepare("SELECT id_usuario FROM tiene_dias WHERE id_usuario = ? AND id_dias_disponibles = ?");
        $insert_tiene_dias_stmt = $this->conn->prepare("INSERT INTO tiene_dias (id_usuario, id_dias_disponibles) VALUES (?, ?)");
        
        $select_hora_stmt = $this->conn->prepare("SELECT id_horario_disponible FROM horas_disponibles WHERE hora_inicial = ? AND hora_final = ?");
        $insert_hora_stmt = $this->conn->prepare("INSERT INTO horas_disponibles (hora_inicial, hora_final) VALUES (?, ?)");
        
        $select_dh_stmt = $this->conn->prepare("SELECT id_dias_disponibles FROM dias_horas_disponibles WHERE id_dias_disponibles = ? AND id_horario_disponible = ?");
        $insert_dh_stmt = $this->conn->prepare("INSERT INTO dias_horas_disponibles (id_dias_disponibles, id_horario_disponible) VALUES (?, ?)");

        foreach ($disponibilidades as $disp) {
            if (!empty($disp['esRango']) && $disp['esRango']) {
                // Expande rango de fechas
                if (empty($disp['fecha_inicio']) || empty($disp['fecha_fin'])) continue;
                
                $fechaInicio = new DateTime($disp['fecha_inicio']);
                $fechaFin = new DateTime($disp['fecha_fin']);
                $interval = new DateInterval('P1D');
                
                while ($fechaInicio <= $fechaFin) {
                    $fechaStr = $fechaInicio->format('Y-m-d');
                    // Guardar para esta fecha individual
                    $this->saveSingleDateWithTime(
                        $id_peluquero,
                        $fechaStr,
                        $disp['hora_inicial'] ?? null,
                        $disp['hora_final'] ?? null,
                        $select_dia_stmt,
                        $insert_dia_stmt,
                        $select_tiene_dias_stmt,
                        $insert_tiene_dias_stmt,
                        $select_hora_stmt,
                        $insert_hora_stmt,
                        $select_dh_stmt,
                        $insert_dh_stmt
                    );
                    $fechaInicio->add($interval);
                }
            } else {
                // Fecha única
                if (empty($disp['fecha_disponible'])) continue;
                $this->saveSingleDateWithTime(
                    $id_peluquero,
                    $disp['fecha_disponible'],
                    $disp['hora_inicial'] ?? null,
                    $disp['hora_final'] ?? null,
                    $select_dia_stmt,
                    $insert_dia_stmt,
                    $select_tiene_dias_stmt,
                    $insert_tiene_dias_stmt,
                    $select_hora_stmt,
                    $insert_hora_stmt,
                    $select_dh_stmt,
                    $insert_dh_stmt
                );
            }
        }

        // Cerrar statements
        $select_dia_stmt->close();
        $insert_dia_stmt->close();
        $select_tiene_dias_stmt->close();
        $insert_tiene_dias_stmt->close();
        $select_hora_stmt->close();
        $insert_hora_stmt->close();
        $select_dh_stmt->close();
        $insert_dh_stmt->close();
    }

    /**
     * Guarda una fecha (dia) y la relaciona con peluquero y horario.
     * Reutiliza statements pasados para evitar re-prepare en ciclos.
     */
    private function saveSingleDateWithTime(
        $id_peluquero,
        $fecha_disponible,
        $hora_inicial,
        $hora_final,
        $select_dia_stmt,
        $insert_dia_stmt,
        $select_tiene_dias_stmt,
        $insert_tiene_dias_stmt,
        $select_hora_stmt,
        $insert_hora_stmt,
        $select_dh_stmt,
        $insert_dh_stmt
    ) {
        // 1) dias_disponibles: obtener o insertar
        $id_dias_disponibles = null;
        $select_dia_stmt->bind_param("s", $fecha_disponible);
        $select_dia_stmt->execute();
        $res = $select_dia_stmt->get_result();
        if ($row = $res->fetch_assoc()) {
            $id_dias_disponibles = (int)$row['id_dias_disponibles'];
        } else {
            $insert_dia_stmt->bind_param("s", $fecha_disponible);
            $insert_dia_stmt->execute();
            $id_dias_disponibles = $insert_dia_stmt->insert_id;
        }
        
        if (empty($id_dias_disponibles)) {
            throw new Exception("No se pudo obtener/crear id para dias_disponibles ($fecha_disponible).");
        }

        // 2) tiene_dias: asociar peluquero con dia (si no existe)
        // CORREGIDO: Solo verificar si existe la relación, no buscar id_tiene_dias
        $select_tiene_dias_stmt->bind_param("ii", $id_peluquero, $id_dias_disponibles);
        $select_tiene_dias_stmt->execute();
        $res = $select_tiene_dias_stmt->get_result();
        if (!$res->fetch_assoc()) {
            $insert_tiene_dias_stmt->bind_param("ii", $id_peluquero, $id_dias_disponibles);
            $insert_tiene_dias_stmt->execute();
        }

        // Si no vienen horas, terminamos (guardamos solo el día y la relación)
        if (empty($hora_inicial) || empty($hora_final)) {
            return;
        }

        // 3) horas_disponibles: obtener o insertar
        $id_horario_disponible = null;
        $select_hora_stmt->bind_param("ss", $hora_inicial, $hora_final);
        $select_hora_stmt->execute();
        $res = $select_hora_stmt->get_result();
        if ($row = $res->fetch_assoc()) {
            $id_horario_disponible = (int)$row['id_horario_disponible'];
        } else {
            $insert_hora_stmt->bind_param("ss", $hora_inicial, $hora_final);
            $insert_hora_stmt->execute();
            $id_horario_disponible = $insert_hora_stmt->insert_id;
        }
        
        if (empty($id_horario_disponible)) {
            throw new Exception("No se pudo obtener/crear id para horas_disponibles ($hora_inicial - $hora_final).");
        }

        // 4) dias_horas_disponibles: asociar dia con horario (si no existe)
        $select_dh_stmt->bind_param("ii", $id_dias_disponibles, $id_horario_disponible);
        $select_dh_stmt->execute();
        $res = $select_dh_stmt->get_result();
        if (!$res->fetch_assoc()) {
            $insert_dh_stmt->bind_param("ii", $id_dias_disponibles, $id_horario_disponible);
            $insert_dh_stmt->execute();
        }
    }
}

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$conn->set_charset('utf8');

// Leer y decodificar JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "JSON inválido"]);
    exit();
}

if (empty($data['id_peluquero']) || empty($data['disponibilidades'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos. Se requiere id_peluquero y disponibilidades."]);
    exit();
}

try {
    $controller = new AvailabilityController($conn);
    $controller->saveAvailability($data['id_peluquero'], $data['disponibilidades']);
    
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Disponibilidad guardada correctamente."]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>