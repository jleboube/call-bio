#!/bin/bash

# Production Deployment Script for Conference Call Bio Service
# This script sets up SSL certificates and deploys the application with HTTPS

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Check if SSL certificates already exist
if [ ! -f "ssl/private-key.pem" ] || [ ! -f "ssl/certificate.pem" ]; then
    echo "🔐 Generating SSL certificates..."

    # Make sure the generate script is executable
    chmod +x ssl/generate-certs.sh

    # Generate SSL certificates
    ./ssl/generate-certs.sh

    echo "✅ SSL certificates generated"
else
    echo "✅ SSL certificates already exist"
fi

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose down --remove-orphans

# Build and start the application
echo "🏗️  Building and starting the application..."
docker compose up --build -d

# Wait a moment for containers to start
echo "⏳ Waiting for containers to start..."
sleep 10

# Check if containers are running
echo "📊 Checking container status..."
docker compose ps

# Check application health
echo "🏥 Checking application health..."
if curl -k -f https://localhost:5005/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo ""
    echo "🌐 Access your application at: https://localhost:5005"
    echo "📊 Database is accessible on host port: 5433"
    echo ""
    echo "⚠️  Note: You'll see a security warning because we're using self-signed certificates."
    echo "   Click 'Advanced' and 'Proceed to localhost' to continue."
else
    echo "❌ Application health check failed. Check logs with:"
    echo "   docker compose logs web"
fi

echo ""
echo "🔧 Useful commands:"
echo "   View logs:      docker compose logs -f"
echo "   Stop app:       docker compose down"
echo "   Restart:        docker compose restart"
echo ""
echo "🎉 Deployment complete!"