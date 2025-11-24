# Deployment Guide - Enhanced Call Center Management System

## Table of Contents
1. [Production Environment Setup](#production-environment-setup)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Security Considerations](#security-considerations)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Production Environment Setup

### System Requirements

**Server Specifications:**
- CPU: 2+ cores
- RAM: 4GB minimum (8GB recommended)
- Storage: 20GB+ SSD
- OS: Ubuntu 20.04 LTS or higher

**Software Requirements:**
- Node.js v16.x or higher
- MongoDB v5.x or higher
- Nginx (for reverse proxy)
- PM2 (for process management)
- SSL Certificate (Let's Encrypt recommended)

---

## Backend Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Deploy Backend

```bash
# Clone repository
cd /var/www
git clone <your-repo-url> callcenter
cd callcenter/backend

# Install dependencies
npm install --production

# Create production .env file
nano .env
```

**Production .env:**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://localhost:27017/callcenter_prod
JWT_SECRET=<generate-strong-secret-key>
CORS_ORIGIN=https://yourdomain.com
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Start Backend with PM2

```bash
# Start application
pm2 start server.js --name callcenter-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs

# Monitor logs
pm2 logs callcenter-api
```

### 4. Configure Nginx for Backend

```bash
sudo nano /etc/nginx/sites-available/callcenter-api
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/callcenter-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Frontend Deployment

### 1. Build Frontend

```bash
cd /var/www/callcenter/frontend

# Install dependencies
npm install

# Update API URL in environment
nano .env.production
```

**.env.production:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

### 2. Deploy with PM2

```bash
# Start Next.js in production mode
pm2 start npm --name callcenter-web -- start

# Save configuration
pm2 save
```

### 3. Configure Nginx for Frontend

```bash
sudo nano /etc/nginx/sites-available/callcenter-web
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/callcenter-web /etc/nginx/sites-enabled/

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

---

## SSL Certificate Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

Certbot will automatically update your Nginx configuration to use HTTPS.

---

## Database Setup

### 1. MongoDB Security

```bash
# Connect to MongoDB
mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "strong_password_here",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# Create application user
use callcenter_prod
db.createUser({
  user: "callcenter_user",
  pwd: "strong_password_here",
  roles: [ { role: "readWrite", db: "callcenter_prod" } ]
})

exit
```

### 2. Enable Authentication

```bash
sudo nano /etc/mongod.conf
```

**Add security section:**
```yaml
security:
  authorization: enabled
```

```bash
# Restart MongoDB
sudo systemctl restart mongod
```

### 3. Update Backend .env

```env
MONGO_URI=mongodb://callcenter_user:strong_password_here@localhost:27017/callcenter_prod
```

### 4. Database Backup

**Create backup script:**
```bash
sudo nano /usr/local/bin/backup-callcenter-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

mongodump --uri="mongodb://callcenter_user:password@localhost:27017/callcenter_prod" \
  --out="$BACKUP_DIR/backup_$DATE"

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-callcenter-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-callcenter-db.sh
```

---

## Security Considerations

### 1. Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### 2. Environment Variables

- Never commit `.env` files to version control
- Use strong, randomly generated secrets
- Rotate JWT secrets periodically
- Use different secrets for development and production

### 3. Rate Limiting

Add to backend (install express-rate-limit):

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. CORS Configuration

Update backend CORS settings:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://yourdomain.com',
  credentials: true
}));
```

### 5. MongoDB Security

- Enable authentication
- Use strong passwords
- Limit network exposure (bind to localhost)
- Regular backups
- Keep MongoDB updated

---

## Monitoring & Maintenance

### 1. PM2 Monitoring

```bash
# View all processes
pm2 list

# Monitor resources
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart callcenter-api
pm2 restart callcenter-web
```

### 2. Log Management

**Setup log rotation:**
```bash
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. System Monitoring

**Install monitoring tools:**
```bash
# htop for system monitoring
sudo apt install htop

# MongoDB monitoring
mongosh --eval "db.serverStatus()"
```

### 4. Application Health Checks

Create health check endpoint in backend:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

### 5. Automated Monitoring

**Setup monitoring with PM2:**
```bash
pm2 install pm2-server-monit
```

Or use external services:
- UptimeRobot
- Pingdom
- New Relic
- DataDog

---

## Scaling Considerations

### Horizontal Scaling

**Load Balancer Configuration (Nginx):**
```nginx
upstream backend {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

### Database Scaling

- **Replication**: Setup MongoDB replica set
- **Sharding**: For very large datasets
- **Indexing**: Ensure proper indexes on frequently queried fields

### Caching

- **Redis**: For session storage and caching
- **CDN**: For static assets

---

## Rollback Procedure

### 1. Keep Previous Version

```bash
# Before deploying new version
cd /var/www/callcenter
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

### 2. Rollback Steps

```bash
# Stop current version
pm2 stop all

# Checkout previous version
git checkout v1.0.0

# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# Restart
pm2 restart all
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs callcenter-api --lines 100

# Check system logs
sudo journalctl -u mongod -n 50
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongosh --eval "db.adminCommand('ping')"

# Check MongoDB status
sudo systemctl status mongod
```

### High Memory Usage

```bash
# Check process memory
pm2 monit

# Restart if needed
pm2 restart callcenter-api --update-env
```

---

## Checklist Before Going Live

- [ ] SSL certificates installed and working
- [ ] Environment variables set correctly
- [ ] MongoDB authentication enabled
- [ ] Firewall configured
- [ ] Backup system in place
- [ ] PM2 configured to start on boot
- [ ] Nginx configured correctly
- [ ] Health checks working
- [ ] Monitoring setup
- [ ] Log rotation configured
- [ ] Admin user created
- [ ] Test all critical features
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Documentation updated

---

## Support

For deployment issues, contact your DevOps team or system administrator.
