<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ⚠️ Token de prueba, no publiques este valor real
$access_token = "APP_USR-8049276630499625-090223-fd3706f25dfb57e5378851168592e62f-2663873362";

// Recibir datos del frontend
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Construir item a partir del precio recibido
$price = isset($data["price"]) ? floatval($data["price"]) : 0;

// Crear la preferencia
$preference = [
    "items" => [
        [
            "title" => "Compra en Proton Pet Shop",
            "quantity" => 1,
            "currency_id" => "ARS",
            "unit_price" => $price
        ]
    ],
    "back_urls" => [
        "success" => "http://localhost:5173/success",
        "failure" => "http://localhost:5173/failure",
        "pending" => "http://localhost:5173/pending"
    ],
    "auto_return" => "approved"
];

// Enviar la solicitud POST a la API de MercadoPago
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.mercadopago.com/checkout/preferences");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preference));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    exit;
}

curl_close($ch);

// Mostrar respuesta JSON completa
echo $response;
