#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8081}"
DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-formulario}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "ERROR: comando requerido no encontrado: $1"
    exit 1
  fi
}

require_cmd php
require_cmd mysql
require_cmd curl

MYSQL_AUTH=( -u"$DB_USER" )
if [[ -n "$DB_PASSWORD" ]]; then
  MYSQL_AUTH+=( -p"$DB_PASSWORD" )
fi

echo "[1/5] Preparando base de datos y tabla..."
mysql "${MYSQL_AUTH[@]}" -h"$DB_HOST" <<SQL
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
USE ${DB_NAME};
CREATE TABLE IF NOT EXISTS datos_formulario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  comentarios TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SQL

EMAIL="lead.$(date +%s)@test-uvm.local"
PAYLOAD=$(cat <<JSON
{"nombre":"Lead Prueba","correo":"${EMAIL}","ciudad":"Valera","telefono":"+584121112233","comentarios":"Alta inicial"}
JSON
)

export DB_HOST DB_USER DB_PASSWORD DB_NAME

echo "[2/5] Iniciando servidor PHP temporal..."
php -S 127.0.0.1:8081 -t . >/tmp/uvm-php-server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT
sleep 1

echo "[3/5] Probando alta de lead..."
STATUS_HIGH=$(curl -s -o /tmp/uvm-high.json -w "%{http_code}" -X POST "$BASE_URL/database.php" -H "Content-Type: application/json" -d "$PAYLOAD")
if [[ "$STATUS_HIGH" != "201" ]]; then
  echo "ERROR alta: HTTP $STATUS_HIGH"
  cat /tmp/uvm-high.json
  exit 1
fi
cat /tmp/uvm-high.json

echo "[4/5] Probando duplicado..."
STATUS_DUP=$(curl -s -o /tmp/uvm-dup.json -w "%{http_code}" -X POST "$BASE_URL/database.php" -H "Content-Type: application/json" -d "$PAYLOAD")
if [[ "$STATUS_DUP" != "409" ]]; then
  echo "ERROR duplicado: HTTP $STATUS_DUP"
  cat /tmp/uvm-dup.json
  exit 1
fi
cat /tmp/uvm-dup.json

echo "[5/5] Probando error de red..."
kill "$SERVER_PID" >/dev/null 2>&1 || true
trap - EXIT
if curl -sS "$BASE_URL/database.php" >/tmp/uvm-network.txt 2>&1; then
  echo "ERROR: se esperaba fallo de red y la solicitud respondio"
  exit 1
fi
echo "OK: error de red detectado correctamente"

echo "Ciclo validado: alta (201), duplicado (409), error de red (sin conexion)."
