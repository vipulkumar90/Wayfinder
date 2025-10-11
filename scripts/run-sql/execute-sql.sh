#!/bin/bash
set -euo pipefail

SQLCMD="${SQLCMD:-/opt/mssql-tools/bin/sqlcmd}"
SQLSERVER_HOST=${SQLSERVER_HOST:-sqlserver}
SQLSERVER_PORT=${SQLSERVER_PORT:-1433}
SQLSERVER_USER=${SQLSERVER_USER:-sa}
SQLSERVER_PASSWORD=${SQLSERVER_PASSWORD:-Password@12345}
SQLSERVER_DB=${SQLSERVER_DB:-TripDb}

echo "Running database migrations against ${SQLSERVER_HOST}:${SQLSERVER_PORT}/${SQLSERVER_DB}"

wait_for_sql() {
  until "${SQLCMD}" \
    -S "${SQLSERVER_HOST},${SQLSERVER_PORT}" \
    -U "${SQLSERVER_USER}" \
    -P "${SQLSERVER_PASSWORD}" \
    -C -d master -Q "SELECT 1" >/dev/null 2>&1; do
    echo "Waiting for SQL Server to accept connections..."
    sleep 2
  done
}

wait_for_sql

"${SQLCMD}" \
  -S "${SQLSERVER_HOST},${SQLSERVER_PORT}" \
  -U "${SQLSERVER_USER}" \
  -P "${SQLSERVER_PASSWORD}" \
  -C -d master \
  -Q "IF DB_ID('${SQLSERVER_DB}') IS NULL CREATE DATABASE ${SQLSERVER_DB};" || true

run_script() {
  local script_path="$1"
  if [[ -f "${script_path}" ]]; then
    echo "Running ${script_path}"
    "${SQLCMD}" \
      -S "${SQLSERVER_HOST},${SQLSERVER_PORT}" \
      -U "${SQLSERVER_USER}" \
      -P "${SQLSERVER_PASSWORD}" \
      -C -I \
      -d "${SQLSERVER_DB}" \
      -i "${script_path}"
  fi
}

run_script "/scripts/auth-service/db-migration.sql"
run_script "/scripts/user-service/db-migration.sql"

echo "Migration complete ✅"
