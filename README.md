# Admin Dashboard

A complete, production-ready admin panel with Next.js 16 frontend and Django backend.

## Features

- **Authentication**: JWT-based authentication with login, logout, and token refresh
- **Dashboard**: Real-time statistics, charts, and KPI cards
- **User Management**: Complete CRUD operations with search, filter, and pagination
- **Dark Mode**: Beautiful light and dark theme toggle
- **Responsive**: Mobile-friendly design with Material-UI
- **Type-Safe**: TypeScript for better development experience
- **Modern UI**: Clean, minimal design with Inter font and Lucide icons

## Project Structure

```
├── backend/          # Django REST API
│   ├── apps/         # Django apps
│   │   ├── authentication/
│   │   ├── users/
│   │   ├── dashboard/
│   │   ├── reports/
│   │   ├── notifications/
│   │   ├── security/
│   │   └── monitoring/
│   ├── config/       # Django settings
│   └── requirements.txt
│
└── frontend/         # Next.js application
    ├── src/
    │   ├── app/      # Next.js pages (App Router)
    │   ├── components/
    │   ├── contexts/
    │   └── lib/
    └── vercel.json
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: Material-UI v5+
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Font**: Inter (Google Fonts)

### Backend
- **Framework**: Django 5.2+ with Django REST Framework
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite (development) / PostgreSQL (production)
- **CORS**: django-cors-headers
- **Filtering**: django-filter

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- pip and virtualenv

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

### Frontend (.env.local)
```
# Backend API URL (server-side only, not exposed to browser)
# Always use HTTP - the Next.js proxy handles HTTPS for you
BACKEND_API_URL=http://localhost:8000/api

# Production example
# BACKEND_API_URL=http://72.61.147.33:8888/api
```

**Architecture**: The frontend uses a built-in Next.js API proxy to forward requests from HTTPS (frontend) to HTTP (backend), avoiding Mixed Content errors. The backend URL is only used server-side and never exposed to the browser.

### Backend (environment variables)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Database (for production)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=dashboard_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/refresh/` - Refresh token
- `GET /api/auth/me/` - Get current user
- `POST /api/auth/password-reset/` - Request password reset
- `POST /api/auth/password-reset-confirm/` - Confirm password reset

### Users
- `GET /api/users/` - List users (with pagination, search, filter)
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user detail
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user
- `GET /api/users/{id}/activity_logs/` - Get user activity logs
- `POST /api/users/bulk_delete/` - Bulk delete users

### Dashboard
- `GET /api/dashboard/stats/` - Get KPI statistics
- `GET /api/dashboard/charts/` - Get chart data
- `GET /api/dashboard/recent-activity/` - Get recent activity

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your production API URL
4. Deploy

The project includes a `vercel.json` configuration file for optimal deployment.

### Backend (Production)

1. Set up PostgreSQL database
2. Configure environment variables:
```bash
export SECRET_KEY='your-production-secret-key'
export DEBUG='False'
export ALLOWED_HOSTS='yourdomain.com'
export CORS_ALLOWED_ORIGINS='https://yourdomain.com'
export DB_ENGINE='django.db.backends.postgresql'
export DB_NAME='your_db_name'
export DB_USER='your_db_user'
export DB_PASSWORD='your_db_password'
export DB_HOST='your_db_host'
export DB_PORT='5432'
```

3. Install dependencies:
```bash
pip install -r requirements.txt gunicorn
```

4. Collect static files:
```bash
python manage.py collectstatic --noinput
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Run with Gunicorn:
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

## Default Credentials

After creating a superuser, you can login with those credentials.

Example:
- Email: admin@example.com
- Password: (the password you set during superuser creation)

## Features Roadmap

- [x] Authentication (Login/Logout)
- [x] Dashboard with KPIs and Charts
- [x] User Management (List, Search, Pagination)
- [x] Dark Mode Toggle
- [x] Responsive Design
- [ ] User Create/Edit Forms
- [ ] Notifications System
- [ ] Reports Generation
- [ ] Security Audit Logs
- [ ] System Monitoring
- [ ] Database Management UI
- [ ] Bulk Operations
- [ ] Export Data (CSV, Excel)
- [ ] Email Integration
- [ ] Two-Factor Authentication

## Contributing

This is a production-ready template. Feel free to customize it for your needs.

## License

See LICENSE file for details.
