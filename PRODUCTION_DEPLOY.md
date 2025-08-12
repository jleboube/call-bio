# Production Deployment Guide

## Fixed Docker Issues

The npm/package-lock.json issues have been resolved with a production-optimized Dockerfile.

## Quick Deploy Commands

### Option 1: Use Deployment Script (Recommended)
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Commands
```bash
# Clean everything
docker-compose down --rmi all --volumes --remove-orphans
docker system prune -f

# Build and start
docker-compose up -d --build --no-cache

# Wait for database
sleep 20

# Run migrations
docker-compose exec web npm run migrate

# Check status
docker-compose ps
curl http://localhost:3000/health
```

### Option 3: Step-by-Step Manual Deploy
```bash
# 1. Stop any existing services
docker-compose down

# 2. Clean up Docker
docker system prune -f

# 3. Build the application
docker-compose build --no-cache

# 4. Start services
docker-compose up -d

# 5. Wait for PostgreSQL to be ready
echo "Waiting for database..."
sleep 20

# 6. Check database connectivity
docker-compose exec db pg_isready -U user -d bios

# 7. Run migrations
docker-compose exec web npm run migrate

# 8. Test the application
curl http://localhost:3000/health

# 9. View logs if needed
docker-compose logs web
```

## Production Environment Variables

Before deploying, update `.env` with secure values:

```env
# REQUIRED: Change this for production!
JWT_SECRET=your-super-secure-64-character-production-secret-key-here

# Database (default is fine for Docker)
DATABASE_URL=postgres://user:pass@db:5432/bios

# App settings
NODE_ENV=production
PORT=3000
MAX_FILE_SIZE=5242880

# Optional: Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-app-specific-password
```

## Verification Steps

After deployment, verify everything works:

1. **Health Check**: `curl http://localhost:3000/health`
2. **Web Interface**: Visit `http://your-server-ip:3000`
3. **Database**: `docker-compose exec db psql -U user -d bios -c "\dt"`
4. **Logs**: `docker-compose logs web`

## Common Issues & Solutions

### Issue: "npm ci" errors
**Solution**: Fixed in production Dockerfile - uses `npm install` instead

### Issue: Permission denied on uploads
**Solution**: Using Docker volumes with proper user permissions

### Issue: Database connection refused
**Solution**: Wait longer for PostgreSQL startup, check `docker-compose logs db`

### Issue: Port already in use
**Solution**: 
```bash
sudo lsof -i :3000
# Kill the process or change port in docker-compose.yml
```

## Monitoring

### View Real-time Logs
```bash
docker-compose logs -f web    # Application logs
docker-compose logs -f db     # Database logs
```

### Check Resource Usage
```bash
docker stats
```

### Restart Services
```bash
docker-compose restart web
```

## Backup & Recovery

### Backup Database
```bash
docker-compose exec db pg_dump -U user bios > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U user bios < backup_file.sql
```

## SSL & Domain Setup (Optional)

For production with a domain:

1. **Install Nginx**:
```bash
sudo apt install nginx
```

2. **Configure Nginx** (`/etc/nginx/sites-available/cc-bio`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Enable Site**:
```bash
sudo ln -s /etc/nginx/sites-available/cc-bio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **SSL with Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Success!

If the deployment was successful, you should see:
- ✅ Health check returns `{"status":"OK"}`
- ✅ Web interface loads at your server IP
- ✅ User registration works
- ✅ File uploads work
- ✅ API endpoints respond correctly