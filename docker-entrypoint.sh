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

# Import sample data (only run if table is empty)
php artisan db:seed --class=StudentScoreSeeder

# Start Apache
exec apache2-foreground 