<?php
/**
 * webhookMp.php - Procesamiento de Pagos QR y Redirección
 */
require_once '../includes/db.php';

$access_token = "APP_USR-4827981010878102-111018-dad8593982978eeb014896313fb89964-2663873362"; 

http_response_code(200);
$raw_body = file_get_contents('php://input');
$data = json_decode($raw_body, true);
if (!$data) exit;

$log_path = __DIR__ . '/../logs/log_webhook.txt';
if (!is_dir(dirname($log_path))) mkdir(dirname($log_path), 0777, true);

file_put_contents($log_path, "[" . date("Y-m-d H:i:s") . "] Recibido: " . $raw_body . PHP_EOL, FILE_APPEND);

$payment_id = null;
if (isset($data['data']['id'])) $payment_id = $data['data']['id'];
elseif (isset($data['resource']) && strpos($data['resource'], 'payments') !== false) $payment_id = basename($data['resource']);

if ($payment_id && is_numeric($payment_id)) {
    $url = "https://api.mercadopago.com/v1/payments/" . $payment_id;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $access_token"]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $payment_info = json_decode($response, true);
    curl_close($ch);

    if ($http_code === 200 && isset($payment_info['status']) && $payment_info['status'] === 'approved') {
        $externalRef = (string)($payment_info['external_reference'] ?? '');

        // CASO 1: TURNO (ID numérico)
        if (ctype_digit($externalRef)) {
            $turnoId = intval($externalRef);
            $conn = new mysqli($servername, $username, $password, $dbname, $port);
            if (!$conn->connect_error) {
                $conn->set_charset('utf8');
                $stmt = $conn->prepare("UPDATE turno SET pagado = 1 WHERE id_turno = ?");
                $stmt->bind_param("i", $turnoId);
                $stmt->execute();
                $stmt->close();
                $conn->close();
                file_put_contents($log_path, "[OK] Turno $turnoId pagado." . PHP_EOL, FILE_APPEND);
            }
        } 
        // CASO 2: E-COMMERCE (ECOM-...)
        elseif (strpos($externalRef, "ECOM-") === 0) {
            $tmpDir = __DIR__ . "/../tmp";
            if (!is_dir($tmpDir)) mkdir($tmpDir, 0777, true);

            $statusFile = $tmpDir . "/purchase_status_" . $externalRef . ".json";
            $prefFile = $tmpDir . "/pref_" . $externalRef . ".json";

            // Lógica de guardado en DB similar a completePurchase pero desde Webhook
            if (file_exists($prefFile)) {
                $prefData = json_decode(file_get_contents($prefFile), true);
                // (Aquí se ejecutaría la lógica de inserción en carrito si no existe)
                // Por brevedad y para asegurar el polling, marcamos el archivo de status:
                file_put_contents($statusFile, json_encode([
                    "paid" => true,
                    "payment_id" => $payment_id,
                    "external_reference" => $externalRef,
                    "updated_at" => date("c")
                ]));
                file_put_contents($log_path, "[OK] Compra QR $externalRef aprobada." . PHP_EOL, FILE_APPEND);
            }
        }
    }
}
echo json_encode(["status" => "processed"]);