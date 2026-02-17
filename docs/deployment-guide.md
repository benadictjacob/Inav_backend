# AWS EC2 Deployment Guide

Step-by-step instructions for deploying the Payment Collection backend to an AWS EC2 instance.

---

## 1. Launch EC2 Instance

1. Open the AWS Console → EC2 → **Launch Instance**
2. **AMI**: Ubuntu Server 22.04 LTS (HVM, SSD)
3. **Instance type**: `t2.micro` (free tier) or `t2.small` for production
4. **Key pair**: Create or select an existing `.pem` key
5. **Security Group** — open the following ports:
   | Port  | Protocol | Source    | Purpose          |
   |-------|----------|-----------|------------------|
   | 22    | TCP      | Your IP   | SSH              |
   | 80    | TCP      | 0.0.0.0/0 | HTTP             |
   | 443   | TCP      | 0.0.0.0/0 | HTTPS            |
   | 3000  | TCP      | 0.0.0.0/0 | API (dev only)   |

---

## 2. Connect to the Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

---

## 3. Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # verify v20.x
npm -v
```

---

## 4. Install PostgreSQL

```bash
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE USER payment_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE payment_collection OWNER payment_user;
GRANT ALL PRIVILEGES ON DATABASE payment_collection TO payment_user;
EOF
```

---

## 5. Install PM2

```bash
sudo npm install -g pm2
```

---

## 6. Clone and Configure the App

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/payment-collection-backend.git
cd payment-collection-backend

# Install dependencies
npm ci --production

# Create environment file
cat > .env <<EOF
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://payment_user:your_secure_password@localhost:5432/payment_collection?schema=public"
CORS_ORIGIN=https://your-frontend-domain.com
EOF

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed data (optional)
npx prisma db seed
```

---

## 7. Start with PM2

```bash
pm2 start server.js --name payment-api
pm2 save
pm2 startup  # follow the printed command to enable auto-start on boot
```

---

## 8. Set Up Nginx Reverse Proxy (Optional but Recommended)

```bash
sudo apt-get install -y nginx

sudo tee /etc/nginx/sites-available/payment-api > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/payment-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 9. Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 10. SSL with Let's Encrypt (Optional)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo certbot renew --dry-run  # verify auto-renewal
```

---

## 11. Monitoring Commands

```bash
pm2 status          # check process status
pm2 logs payment-api # view logs
pm2 monit            # real-time monitoring
pm2 restart payment-api  # restart app
```

---

## 12. GitHub Actions Secrets

Add these secrets to your GitHub repo → Settings → Secrets:

| Secret Name    | Value                                |
|---------------|--------------------------------------|
| `EC2_HOST`     | Your EC2 public IP or domain         |
| `EC2_USERNAME` | `ubuntu`                             |
| `EC2_SSH_KEY`  | Contents of your `.pem` private key  |
