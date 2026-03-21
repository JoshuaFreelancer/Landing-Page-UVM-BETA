<?php
declare(strict_types=1);

function envValue(string $key, string $default = ""): string
{
    $value = getenv($key);
    return $value !== false ? $value : $default;
}

$host = envValue("DB_HOST", "localhost");
$usuario = envValue("DB_USER", "root");
$contrasena = envValue("DB_PASSWORD", "");
$base_de_datos = envValue("DB_NAME", "formulario");

