#!/bin/bash
set -e  # exit on error

echo "Running database migration..."

# Create database if not exists
/opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P "Password@12345" \
  -C -Q "IF DB_ID('TripDb') IS NULL CREATE DATABASE TripDb"

# Run migration script
/opt/mssql-tools18/bin/sqlcmd \
  -S 'localhost' \
  -U 'sa' \
  -P 'Password@12345' \
  -C \
  -I \
  -d 'TripDb' \
  -i '/scripts/auth-service/db-migration.sql'

/opt/mssql-tools18/bin/sqlcmd \
    -S 'localhost' \
    -U 'sa' \
    -P 'Password@12345' \
    -C \
    -I \
    -d 'TripDb' \
    -i '/scripts/user-service/db-migration.sql'


echo "Migration complete ✅"
