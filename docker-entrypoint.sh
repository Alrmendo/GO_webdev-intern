#!/bin/bash
set -e

# Clear cache to use environment variables
php artisan config:clear
php artisan cache:clear

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Run migrations
php artisan migrate --force

# Import student data from CSV (only if enabled via env var)
if [ "${IMPORT_DATA:-false}" = "true" ]; then
    echo "Importing student data..."
    php artisan import:student-data || echo "Import failed, continuing with startup..."
fi

# Start Apache
exec apache2-foreground 