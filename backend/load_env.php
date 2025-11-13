<?php
// load_env.php - lee un archivo mp.env simple (KEY=VALUE por línea)
function load_env_file($path) {
    if (!file_exists($path)) return false;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Ignorar comentarios
        if (strpos(trim($line), '#') === 0) continue;
        // Separar KEY=VALUE
        $parts = explode('=', $line, 2);
        if (count($parts) == 2) {
            $key = trim($parts[0]);
            $value = trim($parts[1]);
            // Quitar comillas si existen
            $value = preg_replace('/^"(.*)"$/', '$1', $value);
            // setenv para PHP y getenv
            putenv("$key=$value");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
    return true;
}

// Usalo antes de necesitar la variable
load_env_file('C:\\secure_env\\mp.env');
