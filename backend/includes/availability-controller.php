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

            // Solo limpiamos los días específicos que estamos actualizando
            foreach ($disponibilidades as $disp) {
                $this->clearSpecificDayAvailability($id_peluquero, $disp['fecha_disponible']);
            }

            foreach ($disponibilidades as $disp) {
                // 1. Guardar día disponible
                $id_dia = $this->saveDiaDisponible($disp['fecha_disponible']);
                
                // 2. Guardar horario disponible
                $id_horario = $this->saveHorarioDisponible($disp['hora_inicial'], $disp['hora_final']);
                
                // 3. Relacionar día y horario
                $this->relacionarDiaHorario($id_dia, $id_horario);
                
                // 4. Relacionar peluquero con día
                $this->relacionarPeluqueroDia($id_peluquero, $id_dia);
            }

            $this->conn->commit();
            
            return [
                "status" => 200,
                "message" => "Disponibilidad guardada correctamente.",
                "data" => $disponibilidades
            ];
        } catch (Exception $e) {
            $this->conn->rollback();
            return [
                "status" => 500,
                "message" => "Error al guardar disponibilidad: " . $e->getMessage()
            ];
        }
    }

    private function clearSpecificDayAvailability($id_peluquero, $fecha) {
        // Obtener el id_dias_disponibles para la fecha específica
        $query = "SELECT dd.id_dias_disponibles 
                 FROM dias_disponibles dd
                 JOIN tiene_dias td ON dd.id_dias_disponibles = td.id_dias_disponibles
                 WHERE td.id_usuario = ? AND dd.fecha_disponible = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $id_peluquero, $fecha);
        $stmt->execute();
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            $id_dia = $row['id_dias_disponibles'];
            
            // Eliminar relación peluquero-día
            $query = "DELETE FROM tiene_dias 
                     WHERE id_usuario = ? AND id_dias_disponibles = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("ii", $id_peluquero, $id_dia);
            $stmt->execute();
            
            // Limpiar días no utilizados
            $this->cleanUnusedDaysAndHours($id_dia);
        }
    }

    private function cleanUnusedDaysAndHours($id_dia) {
        // Verificar si el día está siendo usado por otros peluqueros
        $query = "SELECT COUNT(*) FROM " . $this->table_relacion . 
                 " WHERE id_dias_disponibles = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id_dia);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_row()[0];

        if ($count == 0) {
            // Eliminar relaciones día-horario
            $query = "DELETE FROM dias_horas_disponibles WHERE id_dias_disponibles = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id_dia);
            $stmt->execute();

            // Eliminar día
            $query = "DELETE FROM " . $this->table_dias . " WHERE id_dias_disponibles = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id_dia);
            $stmt->execute();
        }
    }

    private function saveDiaDisponible($fecha) {
        // Verificar si ya existe
        $query = "SELECT id_dias_disponibles FROM " . $this->table_dias . 
                 " WHERE fecha_disponible = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $fecha);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (!$row) {
            $query = "INSERT INTO " . $this->table_dias . 
                     " (fecha_disponible) VALUES (?)";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("s", $fecha);
            $stmt->execute();
            return $this->conn->insert_id;
        }
        return $row['id_dias_disponibles'];
    }

    private function saveHorarioDisponible($hora_inicio, $hora_fin) {
        // Verificar si ya existe
        $query = "SELECT id_horario_disponible FROM " . $this->table_horas . 
                 " WHERE hora_inicial = ? AND hora_final = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $hora_inicio, $hora_fin);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (!$row) {
            $query = "INSERT INTO " . $this->table_horas . 
                     " (hora_inicial, hora_final) VALUES (?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("ss", $hora_inicio, $hora_fin);
            $stmt->execute();
            return $this->conn->insert_id;
        }
        return $row['id_horario_disponible'];
    }

    private function relacionarDiaHorario($id_dia, $id_horario) {
        $query = "INSERT INTO dias_horas_disponibles (id_dias_disponibles, id_horario_disponible) 
                 VALUES (?, ?) ON DUPLICATE KEY UPDATE id_dias_disponibles=id_dias_disponibles";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $id_dia, $id_horario);
        $stmt->execute();
    }

    private function relacionarPeluqueroDia($id_peluquero, $id_dia) {
        $query = "INSERT INTO " . $this->table_relacion . 
                 " (id_usuario, id_dias_disponibles) VALUES (?, ?) 
                 ON DUPLICATE KEY UPDATE id_usuario=id_usuario";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $id_peluquero, $id_dia);
        $stmt->execute();
    }
}
?>