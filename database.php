<?php
declare(strict_types=1);

require_once("config.php");

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Metodo no permitido.",
    ]);
    exit;
}

function cleanString(mixed $value): string
{
    return trim((string) $value);
}

function getPayload(): array
{
    $contentType = $_SERVER["CONTENT_TYPE"] ?? "";
    if (stripos($contentType, "application/json") !== false) {
        $rawData = file_get_contents("php://input") ?: "";
        $decoded = json_decode($rawData, true);
        return is_array($decoded) ? $decoded : [];
    }

    return $_POST;
}

function validateLead(array $data): array
{
    $nombre = cleanString($data["nombre"] ?? "");
    $correo = cleanString($data["correo"] ?? "");
    $ciudad = cleanString($data["ciudad"] ?? "");
    $telefono = cleanString($data["telefono"] ?? "");
    $comentarios = cleanString($data["comentarios"] ?? "");

    if ($nombre === "" || !preg_match('/^[A-Za-zÀ-ÿ\s]{3,80}$/u', $nombre)) {
        return ["error" => "Nombre invalido."];
    }

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        return ["error" => "Correo electronico invalido."];
    }

    if ($ciudad === "" || !preg_match('/^[A-Za-zÀ-ÿ\s]{2,80}$/u', $ciudad)) {
        return ["error" => "Ciudad invalida."];
    }

    if ($telefono === "" || !preg_match('/^\+?[0-9\s\-()]{7,20}$/', $telefono)) {
        return ["error" => "Telefono invalido."];
    }

    if (strlen($comentarios) > 500) {
        return ["error" => "Comentarios exceden el limite permitido."];
    }

    return [
        "nombre" => $nombre,
        "correo" => $correo,
        "ciudad" => $ciudad,
        "telefono" => $telefono,
        "comentarios" => $comentarios,
    ];
}

$payload = getPayload();
$validated = validateLead($payload);

if (isset($validated["error"])) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "message" => $validated["error"],
    ]);
    exit;
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conexion = new mysqli($host, $usuario, $contrasena, $base_de_datos);
    $conexion->set_charset("utf8mb4");

    $consultaExistencia = "SELECT id FROM datos_formulario WHERE correo_electronico = ? LIMIT 1";
    $sentenciaExistencia = $conexion->prepare($consultaExistencia);
    $sentenciaExistencia->bind_param("s", $validated["correo"]);
    $sentenciaExistencia->execute();
    $resultadoExistencia = $sentenciaExistencia->get_result();

    if ($resultadoExistencia && $resultadoExistencia->num_rows > 0) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Ya existe una solicitud registrada con ese correo.",
        ]);
        exit;
    }

    $consultaInsert = "INSERT INTO datos_formulario (nombre_completo, correo_electronico, ciudad, telefono, comentarios) VALUES (?, ?, ?, ?, ?)";
    $sentenciaInsert = $conexion->prepare($consultaInsert);
    $sentenciaInsert->bind_param(
        "sssss",
        $validated["nombre"],
        $validated["correo"],
        $validated["ciudad"],
        $validated["telefono"],
        $validated["comentarios"]
    );
    $sentenciaInsert->execute();

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Solicitud recibida con exito.",
    ]);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "No fue posible registrar la solicitud en este momento.",
    ]);
}
