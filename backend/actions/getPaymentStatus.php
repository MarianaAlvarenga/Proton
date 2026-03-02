<?php
// CORS dinámico: permitir múltiples orígenes válidos
$allowedOrigins = [
    'https://consciousness-healthy-aaron-ist.trycloudflare.com',
    'https://finite-yrs-dover-therapist.trycloudflare.com',
    'https://gen-dubai-anytime-asks.trycloudflare.com'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback al primero si no coincide
    header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
}

header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Incluye tu conexión a la base de datos
require_once '../includes/session_config.php';
require_once '../includes/db.php';

$turnoId = isset($_GET['turnoId']) ? intval($_GET['turnoId']) : 0;

if ($turnoId <= 0) {
    echo json_encode(["error" => "ID de turno no válido"]);
    exit;
}

// CREACIÓN DE CONEXIÓN USANDO MYSQLI
$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

$conn->set_charset('utf8');

try {
    // Consulta usando mysqli
    $stmt = $conn->prepare("SELECT pagado FROM turno WHERE id_turno = ?");
    $stmt->bind_param("i", $turnoId);
    $stmt->execute();
    $result = $stmt->get_result();
    $resultado = $result->fetch_assoc();

    if ($resultado) {
        echo json_encode([
            "success" => true,
            "pagado" => (bool)$resultado['pagado'],
            "status" => $resultado['pagado'] ? "approved" : "pending"
        ]);
    } else {
        echo json_encode(["error" => "Turno no encontrado"]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(["error" => "Error de base de datos: " . $e->getMessage()]);
} finally {
    $conn->close();
}
?>