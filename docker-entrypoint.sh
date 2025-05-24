#!/bin/bash
set -e

# Run migrations
php artisan migrate --force

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Start Apache
exec apache2-foreground 