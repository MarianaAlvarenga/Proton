<?php

require_once '../includes/session_config.php';

// Marcar que el pago volvió correctamente
$_SESSION["payment_ok"] = true;

// 🔥 URL FIJA AL TÚNEL CLOUDFLARE (NO localhost, NO HTTP_HOST)
$redirect = "https://annotation-tue-static-inc.trycloudflare.com/backend/actions/completePurchase.php?from=mp";

// Redirigir a la URL Cloudflare
header("Location: $redirect");
exit;
