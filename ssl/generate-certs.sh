#!/bin/bash

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/private-key.pem 2048

# Generate certificate signing request with email
openssl req -new -key ssl/private-key.pem -out ssl/cert.csr -subj "/C=US/ST=CA/L=San Francisco/O=Conference Call Bio/OU=IT Department/CN=localhost/emailAddress=admin@call-bio.com"

# Generate self-signed certificate
openssl x509 -req -in ssl/cert.csr -signkey ssl/private-key.pem -out ssl/certificate.pem -days 365

# Clean up CSR file
rm ssl/cert.csr

# Set proper permissions (readable by Docker container)
chmod 644 ssl/private-key.pem
chmod 644 ssl/certificate.pem

echo "SSL certificates generated successfully!"