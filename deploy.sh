#!/bin/bash
set -e

echo "🚀 Deploying Conference Call Bio Service..."

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down || true

# Remove any old images to force rebuild
echo "🔄 Removing old images..."
docker-compose down --rmi all --volumes --remove-orphans || true
docker system prune -f || true

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up -d --build --no-cache

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 15

# Check if database is responding
echo "🔍 Checking database connection..."
until docker-compose exec db pg_isready -U user -d bios; do
  echo "Database is not ready yet. Waiting..."
  sleep 2
done

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec web npm run migrate

# Show service status
echo "📊 Service status:"
docker-compose ps

# Show application logs
echo "📋 Application logs (last 20 lines):"
docker-compose logs --tail=20 web

# Test health endpoint
echo "🏥 Testing health endpoint..."
sleep 5
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
    echo "🎉 Application is running at http://localhost:3000"
    echo "🎉 API health check: http://localhost:3000/health"
else
    echo "❌ Health check failed. Check the logs above."
    echo "📋 Recent logs:"
    docker-compose logs --tail=50 web
    exit 1
fi

echo ""
echo "🎯 Deployment complete!"
echo "📝 Next steps:"
echo "   1. Update the JWT_SECRET in .env for production"
echo "   2. Configure your domain and SSL certificate"
echo "   3. Set up database backups"
echo "   4. Monitor logs with: docker-compose logs -f"