<?php
/**
 * webhook_mp.php - SOLUCIÓN ERROR 0 (SSL BYPASS)
 */
require_once '../includes/db.php';

// --- CONFIGURACIÓN ---
$access_token = "APP_USR-4827981010878102-111018-dad8593982978eeb014896313fb89964-2663873362"; 
// ---------------------

http_response_code(200);
$raw_body = file_get_contents('php://input');
$data = json_decode($raw_body, true);
if (!$data) exit;

file_put_contents("log_webhook.txt", "[" . date("Y-m-d H:i:s") . "] Recibido: " . $raw_body . PHP_EOL, FILE_APPEND);

$payment_id = null;
if (isset($data['data']['id'])) $payment_id = $data['data']['id'];
elseif (isset($data['resource']) && strpos($data['resource'], 'payments') !== false) $payment_id = basename($data['resource']);
elseif (isset($data['topic']) && $data['topic'] === 'payment') $payment_id = basename($data['resource']);

if ($payment_id && is_numeric($payment_id)) {
    
    $url = "https://api.mercadopago.com/v1/payments/" . $payment_id;
    $ch = curl_init($url);
    
    // --- ESTAS LÍNEAS ARREGLAN EL ERROR 0 ---
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    // ----------------------------------------
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $access_token"]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $payment_info = json_decode($response, true);
    
    // Si cURL falla (Error 0), capturamos el mensaje específico de cURL
    if ($response === false) {
        $curl_error = curl_error($ch);
        file_put_contents("log_webhook.txt", "[ERROR CURL] " . $curl_error . PHP_EOL, FILE_APPEND);
        curl_close($ch);
        exit;
    }
    curl_close($ch);

    if ($http_code !== 200) {
        file_put_contents("log_webhook.txt", "[ERROR API] Código $http_code. Mensaje: " . ($payment_info['message'] ?? 'Sin mensaje') . PHP_EOL, FILE_APPEND);
        exit;
    }

    if (isset($payment_info['status']) && $payment_info['status'] === 'approved') {
        // Importante: Mercado Pago a veces devuelve el external_reference como string o int
        $turnoId = isset($payment_info['external_reference']) ? intval($payment_info['external_reference']) : 0;

        if ($turnoId > 0) {
            $conn = new mysqli($servername, $username, $password, $dbname, $port);
            if (!$conn->connect_error) {
                $conn->set_charset('utf8');
                $stmt = $conn->prepare("UPDATE turno SET pagado = 1 WHERE id_turno = ?");
                $stmt->bind_param("i", $turnoId);
                if ($stmt->execute()) {
                    file_put_contents("log_webhook.txt", "[OK] !!! ÉXITO !!! Turno $turnoId actualizado." . PHP_EOL, FILE_APPEND);
                }
                $stmt->close();
                $conn->close();
            }
        } else {
            file_put_contents("log_webhook.txt", "[ALERTA] Pago $payment_id sin external_reference. Data: " . json_encode($payment_info['external_reference']) . PHP_EOL, FILE_APPEND);
        }
    } else {
        file_put_contents("log_webhook.txt", "[INFO] Pago $payment_id status: " . ($payment_info['status'] ?? 'unknown') . PHP_EOL, FILE_APPEND);
    }
}
echo json_encode(["status" => "processed"]);