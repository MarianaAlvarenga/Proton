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
        $externalRefRaw = $payment_info['external_reference'] ?? null;
        $externalRef = is_string($externalRefRaw) ? $externalRefRaw : (is_numeric($externalRefRaw) ? (string)$externalRefRaw : '');
        
        file_put_contents("log_webhook.txt", "[DEBUG] external_reference recibido: " . json_encode($externalRefRaw) . " -> procesado como: " . $externalRef . PHP_EOL, FILE_APPEND);

        // =========================================================
        // CASO 1: PAGO DE TURNO (external_reference numérico)
        // =========================================================
        $turnoId = ($externalRef !== '' && ctype_digit($externalRef)) ? intval($externalRef) : 0;
        if ($turnoId > 0) {
            $conn = new mysqli($servername, $username, $password, $dbname, $port);
            if (!$conn->connect_error) {
                $conn->set_charset('utf8');
                $stmt = $conn->prepare("UPDATE turno SET pagado = 1 WHERE id_turno = ?");
                $stmt->bind_param("i", $turnoId);
                if ($stmt->execute()) {
                    file_put_contents("log_webhook.txt", "[OK] Turno $turnoId actualizado." . PHP_EOL, FILE_APPEND);
                }
                $stmt->close();
                $conn->close();
            }
            echo json_encode(["status" => "processed"]);
            exit;
        }

        // =========================================================
        // CASO 2: E-COMMERCE (external_reference tipo "ECOM-...")
        // =========================================================
        if ($externalRef !== '' && strpos($externalRef, "ECOM-") === 0) {
            $tmpDir = __DIR__ . "/../tmp";
            if (!is_dir($tmpDir)) {
                mkdir($tmpDir, 0777, true);
            }

            $statusFile = $tmpDir . "/purchase_status_" . $externalRef . ".json";
            $completedFile = $tmpDir . "/purchase_completed_" . $externalRef . ".json";
            $prefFile = $tmpDir . "/pref_" . $externalRef . ".json";

            // Idempotencia simple: si ya completamos, sólo marcamos "paid"
            if (file_exists($completedFile)) {
                $completedData = json_decode(file_get_contents($completedFile), true);
                $carritoIdCompleted = isset($completedData["carritoId"]) ? (int)$completedData["carritoId"] : null;
                file_put_contents($statusFile, json_encode([
                    "paid" => true,
                    "payment_id" => (int)$payment_id,
                    "external_reference" => $externalRef,
                    "carritoId" => $carritoIdCompleted,
                    "updated_at" => date("c")
                ]));
                file_put_contents("log_webhook.txt", "[OK] Compra $externalRef ya completada (idempotente)." . PHP_EOL, FILE_APPEND);
                echo json_encode(["status" => "processed"]);
                exit;
            }

            if (!file_exists($prefFile)) {
                file_put_contents("log_webhook.txt", "[ERROR] No existe prefFile para compra $externalRef" . PHP_EOL, FILE_APPEND);
                // Igual marcamos pagado para no bloquear el front si el archivo se perdió
                file_put_contents($statusFile, json_encode([
                    "paid" => true,
                    "payment_id" => (int)$payment_id,
                    "external_reference" => $externalRef,
                    "updated_at" => date("c"),
                    "warning" => "pref_file_missing"
                ]));
                echo json_encode(["status" => "processed"]);
                exit;
            }

            $prefData = json_decode(file_get_contents($prefFile), true);
            $cart = $prefData["cart"] ?? null;
            $items = $prefData["items"] ?? [];
            $seller = $prefData["seller"] ?? null;

            // Reconstruir cart si no vino explícito
            if (!is_array($cart)) {
                $cart = [];
                foreach ($items as $it) {
                    $pid = isset($it["id"]) ? (int)$it["id"] : 0;
                    $qty = isset($it["quantity"]) ? (int)$it["quantity"] : 0;
                    $price = isset($it["unit_price"]) ? (float)$it["unit_price"] : 0.0;
                    if ($pid > 0 && $qty > 0) {
                        $cart[] = ["id" => $pid, "quantity" => $qty, "price" => $price];
                    }
                }
            }

            $sellerId = isset($seller["id"]) ? (int)$seller["id"] : 0;
            $sellerRole = isset($seller["role"]) ? (int)$seller["role"] : 0; // 4 admin, 2 vendedor
            $userEmail = isset($seller["userEmail"]) ? (string)$seller["userEmail"] : null; // puede venir null

            if (!is_array($cart) || empty($cart) || $sellerId <= 0 || !in_array($sellerRole, [2, 4], true)) {
                file_put_contents("log_webhook.txt", "[ERROR] Datos insuficientes para completar compra $externalRef" . PHP_EOL, FILE_APPEND);
                file_put_contents($statusFile, json_encode([
                    "paid" => true,
                    "payment_id" => (int)$payment_id,
                    "external_reference" => $externalRef,
                    "updated_at" => date("c"),
                    "warning" => "insufficient_data"
                ]));
                echo json_encode(["status" => "processed"]);
                exit;
            }

            $conn = new mysqli($servername, $username, $password, $dbname, $port);
            if ($conn->connect_error) {
                file_put_contents("log_webhook.txt", "[ERROR] DB connect en compra $externalRef" . PHP_EOL, FILE_APPEND);
                echo json_encode(["status" => "processed"]);
                exit;
            }
            $conn->set_charset('utf8');
            $conn->begin_transaction();

            try {
                $total = 0.0;
                foreach ($cart as $citem) {
                    $total += ((float)$citem["price"]) * ((int)$citem["quantity"]);
                }

                // 1) Verificar stock y descontar
                foreach ($cart as $citem) {
                    $productId = (int)$citem["id"];
                    $quantity = (int)$citem["quantity"];

                    $q = $conn->prepare("SELECT stock_producto FROM producto WHERE codigo_producto = ?");
                    $q->bind_param("i", $productId);
                    $q->execute();
                    $stockData = $q->get_result()->fetch_assoc();
                    $q->close();

                    if (!$stockData || (int)$stockData["stock_producto"] < $quantity) {
                        throw new Exception("Stock insuficiente para el producto ID $productId");
                    }

                    $u = $conn->prepare("UPDATE producto SET stock_producto = stock_producto - ? WHERE codigo_producto = ?");
                    $u->bind_param("ii", $quantity, $productId);
                    $u->execute();
                    $u->close();
                }

                // 2) Insert carrito
                $clienteField = null;
                $vendedorField = null;
                $adminField = null;
                $clienteNoRegistradoId = null;

                if ($sellerRole === 4) $adminField = $sellerId;
                if ($sellerRole === 2) $vendedorField = $sellerId;

                $insertCarrito = $conn->prepare("
                    INSERT INTO carrito (
                        fecha_carrito,
                        hora_carrito,
                        total,
                        cliente_id_usuario1,
                        vendedor_id_usuario,
                        administrador_id_usuario,
                        cliente_id_usuario_no_registrado
                    ) VALUES (
                        CURDATE(), CURTIME(), ?, ?, ?, ?, NULL
                    )
                ");
                $insertCarrito->bind_param("diii", $total, $clienteField, $vendedorField, $adminField);
                $insertCarrito->execute();
                $carritoId = $conn->insert_id;
                $insertCarrito->close();

                // 3) Cliente registrado (si viene email) o no registrado
                if ($userEmail) {
                    $userQuery = $conn->prepare("SELECT id_usuario FROM usuario WHERE email = ?");
                    $userQuery->bind_param("s", $userEmail);
                    $userQuery->execute();
                    $userRow = $userQuery->get_result()->fetch_assoc();
                    $userQuery->close();

                    if ($userRow && isset($userRow["id_usuario"])) {
                        $clienteId = (int)$userRow["id_usuario"];
                        $assignClient = $conn->prepare("UPDATE carrito SET cliente_id_usuario1 = ? WHERE id_carrito = ?");
                        $assignClient->bind_param("ii", $clienteId, $carritoId);
                        $assignClient->execute();
                        $assignClient->close();
                    }
                } else {
                    $insertNoReg = $conn->prepare("INSERT INTO usuario_no_registrado (id_carrito) VALUES (?)");
                    $insertNoReg->bind_param("i", $carritoId);
                    $insertNoReg->execute();
                    $clienteNoRegistradoId = $conn->insert_id;
                    $insertNoReg->close();

                    $updateCarritoNoReg = $conn->prepare("
                        UPDATE carrito SET cliente_id_usuario_no_registrado = ?
                        WHERE id_carrito = ?
                    ");
                    $updateCarritoNoReg->bind_param("ii", $clienteNoRegistradoId, $carritoId);
                    $updateCarritoNoReg->execute();
                    $updateCarritoNoReg->close();
                }

                // 4) Insert tienev1
                $insertTiene = $conn->prepare("
                    INSERT INTO tienev1 (producto_codigo_producto, carrito_id_carrito, cantidad)
                    VALUES (?, ?, ?)
                ");
                foreach ($cart as $citem) {
                    $productId = (int)$citem["id"];
                    $quantity = (int)$citem["quantity"];
                    $insertTiene->bind_param("iii", $productId, $carritoId, $quantity);
                    $insertTiene->execute();
                }
                $insertTiene->close();

                $conn->commit();
                $conn->close();

                // Marcar completado + estado (para polling del front)
                file_put_contents($completedFile, json_encode([
                    "carritoId" => (int)$carritoId,
                    "external_reference" => $externalRef,
                    "completed_at" => date("c")
                ]));

                file_put_contents($statusFile, json_encode([
                    "paid" => true,
                    "payment_id" => (int)$payment_id,
                    "external_reference" => $externalRef,
                    "carritoId" => (int)$carritoId,
                    "updated_at" => date("c")
                ]));

                file_put_contents("log_webhook.txt", "[OK] Compra $externalRef completada. carritoId=$carritoId" . PHP_EOL, FILE_APPEND);
                echo json_encode(["status" => "processed"]);
                exit;

            } catch (Exception $e) {
                $conn->rollback();
                $conn->close();
                file_put_contents("log_webhook.txt", "[ERROR] Compra $externalRef rollback: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
                // Marcamos paid=true para destrabar el front (pero dejamos warning + mensaje)
                file_put_contents($statusFile, json_encode([
                    "paid" => true,
                    "payment_id" => (int)$payment_id,
                    "external_reference" => $externalRef,
                    "status" => "approved_but_error",
                    "message" => $e->getMessage(),
                    "updated_at" => date("c")
                ]));
                echo json_encode(["status" => "processed"]);
                exit;
            }
        }

        file_put_contents("log_webhook.txt", "[ALERTA] Pago $payment_id sin external_reference usable. Data: " . json_encode($externalRefRaw) . PHP_EOL, FILE_APPEND);
    } else {
        file_put_contents("log_webhook.txt", "[INFO] Pago $payment_id status: " . ($payment_info['status'] ?? 'unknown') . PHP_EOL, FILE_APPEND);
    }
}
echo json_encode(["status" => "processed"]);