#!/bin/bash
set -e

echo "🔧 Fixing SSL issues and deploying..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down || docker-compose down || true

# Clean up
echo "🧹 Cleaning up..."
docker system prune -f

# Build and start fresh
echo "🏗️  Building and starting services..."
docker compose up -d --build || docker-compose up -d --build

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 20

# Check database connectivity with better error handling
echo "🔍 Checking database connection..."
until docker compose exec db pg_isready -U user -d bios -q || docker-compose exec db pg_isready -U user -d bios -q; do
  echo "Database not ready yet, waiting..."
  sleep 3
  RETRIES=$((RETRIES + 1))
  if [ $RETRIES -gt 10 ]; then
    echo "❌ Database failed to start after 30 seconds"
    docker compose logs db || docker-compose logs db
    exit 1
  fi
done

echo "✅ Database is ready!"

# Run migrations with better error handling
echo "🗄️  Running database migrations..."
if docker compose exec web npm run migrate || docker-compose exec web npm run migrate; then
    echo "✅ Migrations completed successfully!"
else
    echo "❌ Migration failed, checking logs..."
    docker compose logs web || docker-compose logs web
    exit 1
fi

# Test the application
echo "🏥 Testing application..."
sleep 5

if curl -f -k https://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
    echo ""
    echo "🎉 Deployment successful!"
    echo "📍 Application URL: https://$(hostname -I | awk '{print $1}'):3000"
    echo "📍 Local URL: https://localhost:3000"
    echo ""
    echo "🔍 Test the application:"
    echo "   • Health: curl -k https://localhost:3000/health"
    echo "   • Web: Open browser to https://$(hostname -I | awk '{print $1}'):3000"
    echo "   • Note: You may need to accept the self-signed certificate in your browser"
    echo ""
    echo "📋 View logs: docker-compose logs -f web"
else
    echo "❌ Health check failed"
    echo "📋 Application logs:"
    docker compose logs --tail=20 web || docker-compose logs --tail=20 web
    echo ""
    echo "📋 Database logs:"
    docker compose logs --tail=10 db || docker-compose logs --tail=10 db
    exit 1
fi