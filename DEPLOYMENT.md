# Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**
   In the Vercel dashboard, add:
   ```
   BACKEND_API_URL=http://72.61.147.33:8888/api
   ```
   
   **Important**: Use HTTP URL for the backend. The Next.js proxy automatically handles the HTTPS→HTTP forwarding, preventing Mixed Content errors while keeping your backend on HTTP.

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Access your app at the provided URL

### Vercel Configuration

The project includes `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

## Backend Deployment (Production Server)

### Option 1: Traditional Server (Ubuntu/Debian)

#### 1. Set up Server
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv nginx postgresql
```

#### 2. Set up PostgreSQL
```bash
sudo -u postgres psql
CREATE DATABASE dashboard_db;
CREATE USER dashboard_user WITH PASSWORD 'your_password';
ALTER ROLE dashboard_user SET client_encoding TO 'utf8';
ALTER ROLE dashboard_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE dashboard_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE dashboard_db TO dashboard_user;
\q
```

#### 3. Clone and Set up Application
```bash
cd /var/www
git clone your-repo-url dashboard
cd dashboard/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn
```

#### 4. Configure Environment Variables
Create `/var/www/dashboard/backend/.env`:
```bash
SECRET_KEY=your-very-secret-key-here-change-this
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

DB_ENGINE=django.db.backends.postgresql
DB_NAME=dashboard_db
DB_USER=dashboard_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

#### 5. Run Migrations and Collect Static Files
```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

#### 6. Set up Gunicorn Service
Create `/etc/systemd/system/dashboard.service`:
```ini
[Unit]
Description=Dashboard Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/dashboard/backend
Environment="PATH=/var/www/dashboard/backend/venv/bin"
EnvironmentFile=/var/www/dashboard/backend/.env
ExecStart=/var/www/dashboard/backend/venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/var/www/dashboard/backend/dashboard.sock \
    config.wsgi:application

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable dashboard
sudo systemctl start dashboard
sudo systemctl status dashboard
```

#### 7. Configure Nginx
Create `/etc/nginx/sites-available/dashboard`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /static/ {
        alias /var/www/dashboard/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/dashboard/backend/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/dashboard/backend/dashboard.sock;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 8. Set up SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

#### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "config.wsgi:application"]
```

#### Docker Compose
Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  db:
    image: postgres:16
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=dashboard_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=yourpassword
    
  backend:
    build: ./backend
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
      - static_volume:/app/staticfiles
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db

volumes:
  postgres_data:
  static_volume:
```

Deploy:
```bash
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### Option 3: Railway/Render

#### Railway
1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Add Django service from GitHub repo
5. Set environment variables in dashboard
6. Deploy

#### Render
1. Create account at [render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service from GitHub
4. Set:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn config.wsgi:application`
5. Add environment variables
6. Deploy

## Environment Variables Reference

### Frontend
```bash
# Backend API URL (server-side only)
# Use HTTP - Next.js proxy handles HTTPS forwarding
BACKEND_API_URL=http://your-backend-ip:port/api

# Example:
# BACKEND_API_URL=http://72.61.147.33:8888/api
```

### Backend (Production)
```bash
# Django
SECRET_KEY=generate-with-get-secret-key-command
DEBUG=False
ALLOWED_HOSTS=your-domain.com,api.your-domain.com

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=dashboard_db
DB_USER=your_db_user
DB_PASSWORD=your_strong_password
DB_HOST=db-hostname
DB_PORT=5432
```

## Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG=False
- [ ] Configure proper ALLOWED_HOSTS
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use strong database passwords
- [ ] Set up regular backups
- [ ] Enable PostgreSQL in production
- [ ] Set up proper logging
- [ ] Configure rate limiting (if needed)

## Post-Deployment

### Health Checks
- Frontend: Visit your Vercel URL
- Backend: `curl https://api.your-domain.com/api/auth/login/`

### Monitoring
- Vercel: Built-in analytics
- Backend: Use services like Sentry, DataDog, or New Relic

### Backups
Set up automated PostgreSQL backups:
```bash
# Daily backup script
pg_dump -h localhost -U dashboard_user dashboard_db > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Frontend Issues
- Check Vercel build logs
- Verify environment variables
- Check browser console for errors

### Backend Issues
- Check Gunicorn logs: `sudo journalctl -u dashboard`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Verify database connection
- Check migrations: `python manage.py showmigrations`

## Updating Application

### Frontend
```bash
git push origin main
# Vercel deploys automatically
```

### Backend
```bash
cd /var/www/dashboard
git pull origin main
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart dashboard
```

## Support

For issues, check:
- Vercel documentation: https://vercel.com/docs
- Django deployment guide: https://docs.djangoproject.com/en/stable/howto/deployment/
- Nginx documentation: https://nginx.org/en/docs/
