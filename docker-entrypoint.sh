#!/bin/sh
set -e

# Regenerate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# If we're in development mode, wait for database to be ready
if [ "$NODE_ENV" = "development" ]; then
    echo "Waiting for database to be ready..."
    npx wait-on tcp:db:5432 -t 60000
    
    echo "Running migrations..."
    npx prisma migrate deploy
    npx prisma db push
    
    echo "Starting development server..."
fi

exec "$@"