<?php

// Simple router para servir archivos estáticos del build de React

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

$static_path = __DIR__ . $uri;

// Si existe un archivo dentro de /backend/static/... lo servimos directamente
if ($uri !== '/' && file_exists($static_path)) {
    return false; // PHP lo sirve tal cual
}

// Si no existe, siempre devolvemos index.html (React maneja el router)
include __DIR__ . '/index.html';
    