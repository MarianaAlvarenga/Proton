<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class AvailabilityController {
    private $conn;
    private $table_dias = 'dias_disponibles';
    private $table_horas = 'horas_disponibles';
    private $table_relacion = 'tiene_dias';

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function saveAvailability($id_peluquero, $disponibilidades) {
        try {
            $this->conn->begin_transaction();

            foreach ($disponibilidades as $disp) {
                if (!empty($disp['esRango']) && $disp['esRango']) {
                    $this->clearRangeAvailability($id_peluquero, $disp['fecha_inicio'], $disp['fecha_fin']);
                }

                $id_horario = $this->saveHorarioDisponible($disp['hora_inicial'], $disp['hora_final']);

                if (!empty($disp['esRango']) && $disp['esRango']) {
                    $fechaInicio = new DateTime($disp['fecha_inicio']);
                    $fechaFin = new DateTime($disp['fecha_fin']);

                    while ($fechaInicio <= $fechaFin) {
                        $fechaStr = $fechaInicio->format('Y-m-d');
                        $id_dia = $this->saveDiaDisponible($fechaStr);
                        $this->relacionarDiaHorario($id_dia, $id_horario);
                        $this->relacionarPeluqueroDia($id_peluquero, $id_dia);
                        $fechaInicio->modify('+1 day');
                    }
                } else {
                    $id_dia = $this->saveDiaDisponible($disp['fecha_disponible']);
                    $this->relacionarDiaHorario($id_dia, $id_horario);
                    $this->relacionarPeluqueroDia($id_peluquero, $id_dia);
                }
            }

            $this->conn->commit();
            return ["status" => 200, "message" => "Disponibilidad guardada correctamente.", "data" => $disponibilidades];
        } catch (Exception $e) {
            $this->conn->rollback();
            return ["status" => 500, "message" => "Error al guardar disponibilidad: " . $e->getMessage()];
        }
    }

    private function clearRangeAvailability($id_peluquero, $fechaInicio, $fechaFin) {
        $query = "SELECT dd.id_dias_disponibles 
                  FROM dias_disponibles dd
                  JOIN tiene_dias td ON dd.id_dias_disponibles = td.id_dias_disponibles
                  WHERE td.id_usuario = ? AND dd.fecha_disponible BETWEEN ? AND ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iss", $id_peluquero, $fechaInicio, $fechaFin);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $id_dia = $row['id_dias_disponibles'];
            $stmtDel = $this->conn->prepare("DELETE FROM tiene_dias WHERE id_usuario = ? AND id_dias_disponibles = ?");
            $stmtDel->bind_param("ii", $id_peluquero, $id_dia);
            $stmtDel->execute();
            $this->cleanUnusedDaysAndHours($id_dia);
        }
    }

    private function cleanUnusedDaysAndHours($id_dia) {
        $query = "SELECT COUNT(*) FROM " . $this->table_relacion . " WHERE id_dias_disponibles = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id_dia);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_row()[0];

        if ($count == 0) {
            $stmt = $this->conn->prepare("DELETE FROM dias_horas_disponibles WHERE id_dias_disponibles = ?");
            $stmt->bind_param("i", $id_dia);
            $stmt->execute();

            $stmt = $this->conn->prepare("DELETE FROM " . $this->table_dias . " WHERE id_dias_disponibles = ?");
            $stmt->bind_param("i", $id_dia);
            $stmt->execute();
        }
    }

    private function saveDiaDisponible($fecha) {
        $stmt = $this->conn->prepare("SELECT id_dias_disponibles FROM " . $this->table_dias . " WHERE fecha_disponible = ?");
        $stmt->bind_param("s", $fecha);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (!$row) {
            $stmtInsert = $this->conn->prepare("INSERT INTO " . $this->table_dias . " (fecha_disponible) VALUES (?)");
            $stmtInsert->bind_param("s", $fecha);
            $stmtInsert->execute();
            return $this->conn->insert_id;
        }
        return $row['id_dias_disponibles'];
    }

    private function saveHorarioDisponible($hora_inicio, $hora_fin) {
        $stmt = $this->conn->prepare("SELECT id_horario_disponible FROM " . $this->table_horas . " WHERE hora_inicial = ? AND hora_final = ?");
        $stmt->bind_param("ss", $hora_inicio, $hora_fin);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (!$row) {
            $stmtInsert = $this->conn->prepare("INSERT INTO " . $this->table_horas . " (hora_inicial, hora_final) VALUES (?, ?)");
            $stmtInsert->bind_param("ss", $hora_inicio, $hora_fin);
            $stmtInsert->execute();
            return $this->conn->insert_id;
        }
        return $row['id_horario_disponible'];
    }

    private function relacionarDiaHorario($id_dia, $id_horario) {
        $stmt = $this->conn->prepare("INSERT INTO dias_horas_disponibles (id_dias_disponibles, id_horario_disponible) VALUES (?, ?) ON DUPLICATE KEY UPDATE id_dias_disponibles=id_dias_disponibles");
        $stmt->bind_param("ii", $id_dia, $id_horario);
        $stmt->execute();
    }

    private function relacionarPeluqueroDia($id_peluquero, $id_dia) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_relacion . " (id_usuario, id_dias_disponibles) VALUES (?, ?) ON DUPLICATE KEY UPDATE id_usuario=id_usuario");
        $stmt->bind_param("ii", $id_peluquero, $id_dia);
        $stmt->execute();
    }
}
?>
