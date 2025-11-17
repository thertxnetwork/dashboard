# API Documentation

Base URL: `http://localhost:8000/api` (development) or `https://your-domain.com/api` (production)

## Response Format

All API responses follow this structure:

```json
{
  "success": true|false,
  "data": {},
  "message": "Success message",
  "errors": []
}
```

## Authentication

Most endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### POST /auth/login/
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "phone": null,
      "avatar": null,
      "is_active": true,
      "created_at": "2025-11-17T10:00:00Z"
    },
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### POST /auth/logout/
Logout and blacklist the refresh token.

**Request:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### POST /auth/refresh/
Refresh access token using refresh token.

**Request:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /auth/me/
Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "phone": "+1234567890",
    "avatar": null,
    "is_active": true,
    "created_at": "2025-11-17T10:00:00Z"
  }
}
```

### POST /auth/password-reset/
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST /auth/password-reset-confirm/
Confirm password reset with token.

**Request:**
```json
{
  "token": "reset_token_here",
  "password": "newpassword123",
  "password_confirm": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## User Management Endpoints

### GET /users/
List all users with pagination, search, and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)
- `search`: Search by username, email, first name, or last name
- `role`: Filter by role (admin, manager, user)
- `is_active`: Filter by active status (true, false)
- `ordering`: Sort by field (created_at, username, email)

**Example:** `/users/?search=john&role=admin&page=1&page_size=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin",
      "is_active": true,
      "created_at": "2025-11-17T10:00:00Z"
    }
  ],
  "count": 50,
  "next": "http://api.example.com/users/?page=2",
  "previous": null
}
```

### POST /users/
Create a new user.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "first_name": "New",
  "last_name": "User",
  "phone": "+1234567890",
  "role": "user",
  "password": "password123",
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "newuser",
    "email": "newuser@example.com",
    "first_name": "New",
    "last_name": "User",
    "phone": "+1234567890",
    "role": "user",
    "is_active": true
  },
  "message": "User created successfully"
}
```

### GET /users/{id}/
Get user details by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "role": "admin",
    "avatar": null,
    "is_active": true,
    "created_at": "2025-11-17T10:00:00Z",
    "updated_at": "2025-11-17T12:00:00Z"
  }
}
```

### PUT /users/{id}/ or PATCH /users/{id}/
Update user information.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "first_name": "John Updated",
  "last_name": "Doe Updated",
  "phone": "+9876543210",
  "role": "manager"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John Updated",
    "last_name": "Doe Updated",
    "phone": "+9876543210",
    "role": "manager",
    "is_active": true
  },
  "message": "User updated successfully"
}
```

### DELETE /users/{id}/
Delete a user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### GET /users/{id}/activity_logs/
Get activity logs for a specific user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number
- `page_size`: Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com"
      },
      "action": "Login",
      "details": "User logged in successfully",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2025-11-17T10:00:00Z"
    }
  ]
}
```

### POST /users/bulk_delete/
Bulk delete multiple users.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "ids": [1, 2, 3, 4, 5]
}
```

**Response:**
```json
{
  "success": true,
  "message": "5 users deleted successfully"
}
```

---

## Dashboard Endpoints

### GET /dashboard/stats/
Get dashboard KPI statistics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 150,
    "active_users": 120,
    "inactive_users": 30,
    "new_users_30d": 25
  }
}
```

### GET /dashboard/charts/
Get data for dashboard charts.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user_growth": [
      {
        "date": "2025-11-11",
        "users": 5
      },
      {
        "date": "2025-11-12",
        "users": 3
      }
    ],
    "users_by_role": [
      {
        "role": "admin",
        "count": 10
      },
      {
        "role": "manager",
        "count": 30
      },
      {
        "role": "user",
        "count": 110
      }
    ]
  }
}
```

### GET /dashboard/recent-activity/
Get recent activity across the system.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": "john@example.com",
      "action": "User logged in",
      "details": "Successful login",
      "created_at": "2025-11-17T10:00:00Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": ["This field is required."],
    "password": ["Password must be at least 8 characters."]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": ["Email or password is incorrect"]
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "errors": ["An unexpected error occurred"]
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production using:
- Django REST Framework throttling
- Nginx rate limiting
- Cloudflare or similar CDN

## Pagination

List endpoints use cursor pagination with the following structure:

```json
{
  "count": 100,
  "next": "http://api.example.com/users/?page=2",
  "previous": null,
  "results": [...]
}
```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Get Users (with token)
```bash
curl -X GET http://localhost:8000/api/users/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create User
```bash
curl -X POST http://localhost:8000/api/users/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123",
    "first_name":"Test",
    "last_name":"User"
  }'
```
