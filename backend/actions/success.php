<?php
require_once '../includes/session_config.php';
require_once '../includes/db.php';

// 1. Capturamos el external_reference que envía Mercado Pago
$external_reference = $_GET['external_reference'] ?? null;
$payment_status = $_GET['status'] ?? null;

// Marcar que el pago volvió (para tu lógica actual)
$_SESSION["payment_ok"] = true;

// 2. Lógica de Redirección según el tipo de pago
if ($external_reference) {

    // CASO A: Es un TURNO (El external_reference es un ID numérico)
    if (ctype_digit($external_reference)) {
        
        // Opcional: Aunque el Webhook ya lo hace, podemos marcarlo aquí también por seguridad
        $conn = new mysqli($servername, $username, $password, $dbname, $port);
        if (!$conn->connect_error) {
            $conn->set_charset('utf8');
            $stmt = $conn->prepare("UPDATE turno SET pagado = 1 WHERE id_turno = ?");
            $stmt->bind_param("i", $external_reference);
            $stmt->execute();
            $stmt->close();
            $conn->close();
        }

        // Redirigir al frontend del cliente con mensaje de éxito de turno
        $frontend = "https://skin-kevin-whatever-program.trycloudflare.com";
        header("Location: $frontend/success?ok=1&type=turno&id=$external_reference");
        exit;
    }

    // CASO B: Es E-COMMERCE (El external_reference empieza con ECOM- o es una compra normal)
    // Redirigimos al proceso de guardado de productos que ya tienes
    $redirect = "https://unless-scene-secrets-burst.trycloudflare.com/backend/actions/completePurchase.php?from=mp";
    header("Location: $redirect");
    exit;

} else {
    // Si no hay referencia, asumimos flujo estándar de carrito por compatibilidad
    $redirect = "https://unless-scene-secrets-burst.trycloudflare.com/backend/actions/completePurchase.php?from=mp";
    header("Location: $redirect");
    exit;
}