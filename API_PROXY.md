# API Proxy Architecture

## Overview

This application uses a Next.js API proxy to handle communication between the HTTPS frontend and HTTP backend, solving the Mixed Content error that occurs when an HTTPS page tries to make HTTP requests.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (HTTPS)                                             │
│  https://dashboard-three-sage.vercel.app                    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS Request
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Next.js Frontend (HTTPS)                                    │
│  - React Components                                          │
│  - API Client (axios)                                        │
│  - Base URL: /api/proxy                                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS Request to /api/proxy/*
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Next.js API Route (HTTPS)                                   │
│  /api/proxy/[...path]/route.ts                              │
│  - Receives HTTPS request from browser                       │
│  - Forwards to backend using HTTP                            │
│  - Returns response to browser                               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Request
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Django Backend (HTTP)                                       │
│  http://72.61.147.33:8888/api                               │
│  - REST API endpoints                                        │
│  - No SSL/HTTPS required                                     │
└─────────────────────────────────────────────────────────────┘
```

## Why This Approach?

### Problem: Mixed Content Error
Modern browsers block HTTP requests from HTTPS pages for security reasons. This creates a "Mixed Content" error:

```
Mixed Content: The page at 'https://dashboard.vercel.app' was loaded over HTTPS,
but requested an insecure XMLHttpRequest endpoint 'http://backend:8888/api/'.
This request has been blocked.
```

### Solution: Server-Side Proxy
By using a Next.js API route as a proxy:
1. **Browser → Frontend**: HTTPS ✅
2. **Frontend → Proxy**: HTTPS ✅ (same origin, no Mixed Content)
3. **Proxy → Backend**: HTTP ✅ (server-side, no browser restrictions)

## Implementation Details

### 1. API Client Configuration
**File**: `frontend/src/lib/api.ts`

```typescript
const apiClient = axios.create({
  baseURL: '/api/proxy',  // Relative URL, stays on HTTPS
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Proxy Route Handler
**File**: `frontend/src/app/api/proxy/[...path]/route.ts`

The proxy:
- Accepts all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Forwards headers (except host, connection, content-length)
- Preserves request body and query parameters
- Returns backend response with proper status codes

### 3. Environment Configuration
**File**: `frontend/.env.example`

```bash
# Server-side only (not exposed to browser)
BACKEND_API_URL=http://localhost:8000/api

# Production
# BACKEND_API_URL=http://72.61.147.33:8888/api
```

## Request Flow Example

### Login Request

1. **User Action**: User submits login form
2. **Frontend**: `apiClient.post('/auth/login/', { email, password })`
3. **Browser Request**: `POST https://dashboard.vercel.app/api/proxy/auth/login/`
4. **Proxy**: Receives HTTPS request, forwards to `http://72.61.147.33:8888/api/auth/login/`
5. **Backend**: Processes login, returns JWT tokens
6. **Proxy**: Receives HTTP response, forwards to browser
7. **Browser**: Receives HTTPS response with tokens

## Benefits

1. **Security**: All browser ↔ frontend communication uses HTTPS
2. **Simplicity**: Backend stays on HTTP (no SSL certificate needed)
3. **Transparent**: Frontend code doesn't need to know about the proxy
4. **Flexible**: Easy to switch backend URLs via environment variable

## Deployment

### Vercel Configuration

Set environment variable in Vercel dashboard:
```
BACKEND_API_URL=http://72.61.147.33:8888/api
```

### Local Development

Create `.env.local`:
```
BACKEND_API_URL=http://localhost:8000/api
```

## Security Considerations

1. **Environment Variable**: `BACKEND_API_URL` is server-side only (not prefixed with `NEXT_PUBLIC_`), so it's never exposed to the browser
2. **CORS**: Backend should trust the frontend domain for CORS headers
3. **Headers**: Proxy forwards authentication tokens securely
4. **Rate Limiting**: Consider adding rate limiting to proxy endpoints if needed

## Debugging

### Check Proxy is Working
Browser DevTools → Network tab → Look for requests to `/api/proxy/*`

### Common Issues
1. **404 on /api/proxy**: Build wasn't successful, rebuild
2. **500 from proxy**: Check backend URL in environment variables
3. **CORS errors**: Backend needs to allow your frontend domain

## Alternative Approaches (Not Used)

### Why Not Just Use HTTPS Backend?
- Requires SSL certificate management
- More complex backend setup
- Our backend is HTTP-only by design

### Why Not NEXT_PUBLIC_API_URL?
- Would expose backend URL to browser
- Can't make HTTP requests from HTTPS page
- Mixed Content error persists

## Summary

This proxy architecture solves the Mixed Content problem elegantly while keeping the backend simple (HTTP-only) and maintaining security (HTTPS for all browser communication).
