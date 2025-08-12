#!/bin/bash

# Create SSL directory if it doesn't exist
mkdir -p /app/ssl

# Generate private key
openssl genrsa -out /app/ssl/private-key.pem 2048

# Generate certificate signing request
openssl req -new -key /app/ssl/private-key.pem -out /app/ssl/cert.csr -subj "/C=US/ST=CA/L=San Francisco/O=Conference Call Bio/OU=IT Department/CN=call-bio.com"

# Generate self-signed certificate
openssl x509 -req -in /app/ssl/cert.csr -signkey /app/ssl/private-key.pem -out /app/ssl/certificate.pem -days 365

# Set proper permissions
chmod 600 /app/ssl/private-key.pem
chmod 644 /app/ssl/certificate.pem

echo "SSL certificates generated successfully!"