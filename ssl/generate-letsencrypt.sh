#!/bin/bash

# Let's Encrypt SSL Certificate Generation
# Requires: domain name pointing to this server

set -e

# Configuration
DOMAIN=${1:-"your-domain.com"}
EMAIL=${2:-"admin@${DOMAIN}"}

echo "🔐 Generating Let's Encrypt SSL certificates for: $DOMAIN"
echo "📧 Email: $EMAIL"

# Check if domain is provided
if [ "$DOMAIN" = "your-domain.com" ]; then
    echo "❌ Error: Please provide your actual domain name"
    echo "Usage: ./generate-letsencrypt.sh your-domain.com your-email@domain.com"
    exit 1
fi

# Create SSL directory
mkdir -p ssl

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."

    # Detect OS and install certbot
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y certbot
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install certbot
    else
        echo "❌ Please install certbot manually for your OS"
        exit 1
    fi
fi

# Stop any web server on port 80 temporarily
echo "🛑 Stopping web services temporarily..."
docker compose down || true

# Generate certificates using standalone method
echo "🔐 Generating certificates..."
sudo certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    --preferred-challenges http

# Copy certificates to our ssl directory
sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ssl/private-key.pem
sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ssl/certificate.pem

# Set proper permissions
sudo chown $(whoami):$(whoami) ssl/private-key.pem ssl/certificate.pem
chmod 644 ssl/private-key.pem ssl/certificate.pem

echo "✅ Let's Encrypt certificates generated successfully!"
echo "📋 Certificate valid for: $DOMAIN"
echo "⏰ Expires in 90 days - set up auto-renewal!"
echo ""
echo "🔄 To set up auto-renewal, add this to crontab:"
echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'docker compose restart'"