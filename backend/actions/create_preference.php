<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Token de prueba o producción
$access_token = "APP_USR-a6324f10-5b40-4c4e-b096-77429674f9ab";

// Recibir datos del frontend
$data = json_decode(file_get_contents("php://input"), true);
$total = (float) $data["price"];

// Logging para depuración
error_log("Datos recibidos del frontend: " . print_r($data, true));
error_log("Total a cobrar: $total");

// Crear preferencia usando cURL
$preference_data = [
    "items" => [
        [
            "title" => "Compra total de productos",
            "quantity" => 1,
            "unit_price" => $total
        ]
    ],
    "back_urls" => [
        "success" => "http://localhost:8080/Proton/backend/actions/success.php", 
        "failure" => "http://localhost:8080/Proton/backend/actions/failure.php", 
        "pending" => "http://localhost:8080/Proton/backend/actions/pending.php"
    ],
    "auto_return" => "approved"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.mercadopago.com/checkout/preferences");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $access_token"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preference_data));

$response = curl_exec($ch);
if(curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

$result = json_decode($response, true);

// Logging de la respuesta completa para depuración
error_log("Respuesta completa de MercadoPago: " . $response);

// Devolver solo init_point
echo json_encode([
    "init_point" => $result["init_point"] ?? null
]);

exit;
