# Security Configuration Guide

## Database Security

### Credentials Management
- **Never use default credentials** (`user/pass`)
- Generate strong passwords: `openssl rand -base64 32`
- Use unique usernames with suffixes: `bio_user_$(openssl rand -hex 8)`

### Connection Security
- Database port (5432) is not exposed to host in production
- SSL enabled for production environments
- Connection pooling with limits (max 20 connections)
- Query and connection timeouts configured

### Access Control
- Parameterized queries prevent SQL injection
- Security monitoring logs suspicious query patterns
- Slow query detection (>1 second)

## JWT Security

### Token Configuration
- **Production**: 24 hour expiration
- **Development**: 7 day expiration
- Strong secrets generated with: `openssl rand -base64 64`

### Token Validation
- Tokens verified on every request
- User existence validated in database
- Invalid tokens immediately rejected

## Application Security

### HTTP Security
- Helmet.js provides security headers
- HSTS enabled in production
- Rate limiting: 100 requests per 15 minutes per IP
- CORS configured for appropriate origins

### File Upload Security
- 5MB file size limit
- Image files only (JPEG, PNG, GIF)
- Files stored outside web root
- Unique filenames prevent conflicts

## Security Monitoring

### Query Monitoring
The database helper monitors for suspicious patterns:
- DROP TABLE statements
- DELETE FROM users
- TRUNCATE operations
- ALTER TABLE users
- GRANT ALL permissions

### Logging
- All database queries logged with duration
- Security alerts for dangerous operations
- Slow query detection and warnings
- Authentication failures tracked

## Environment Configuration

### Production Checklist
- [ ] Strong database credentials configured
- [ ] Database port not exposed to host
- [ ] JWT secret is cryptographically strong
- [ ] JWT expiration set to 24 hours or less
- [ ] SSL/HTTPS enabled
- [ ] Environment variables secured
- [ ] File upload directory outside web root

### Development Setup
1. Copy `.env.example` to `.env`
2. Generate strong credentials:
   ```bash
   # Database password
   openssl rand -base64 32
   
   # JWT secret
   openssl rand -base64 64
   ```
3. Update credentials in both `.env` and `docker-compose.yml`

## Security Best Practices

1. **Regular Updates**: Keep dependencies updated
2. **Backup Security**: Encrypt database backups
3. **Access Logs**: Monitor and rotate access logs
4. **Incident Response**: Have a plan for security incidents
5. **Regular Audits**: Periodically review security configuration

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainer directly rather than creating a public issue.