import { NextRequest, NextResponse } from 'next/server';

// Backend API base URL - always HTTP
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000/api';

// Log configuration on startup (mask IP for security)
const maskedUrl = BACKEND_API_URL.replace(/(\d+\.\d+\.\d+\.)\d+/, '$1***');
console.log('[Proxy] Backend API URL configured:', !!process.env.BACKEND_API_URL);
console.log('[Proxy] Using URL (masked):', maskedUrl);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    // Check if backend URL is configured
    if (!process.env.BACKEND_API_URL) {
      console.error('[Proxy] ⚠️ BACKEND_API_URL environment variable is NOT SET');
      console.error('[Proxy] Using default value:', BACKEND_API_URL);
      console.error('[Proxy] Please set BACKEND_API_URL in Vercel environment variables');
      
      return NextResponse.json(
        { 
          error: 'Backend API URL not configured',
          message: 'BACKEND_API_URL environment variable is not set in Vercel.',
          instructions: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables → Add BACKEND_API_URL',
          example: 'BACKEND_API_URL=http://72.61.147.33:8888/api',
          currentDefault: BACKEND_API_URL,
        },
        { status: 503 }
      );
    }

    const path = params.path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    
    // Properly construct URL for Django which requires trailing slashes
    const baseUrl = BACKEND_API_URL.replace(/\/+$/, ''); // Remove trailing slashes from base
    let fullPath = path.startsWith('/') ? path : `/${path}`;
    
    // Ensure path ends with trailing slash for Django APPEND_SLASH setting
    if (!fullPath.endsWith('/')) {
      fullPath = `${fullPath}/`;
    }
    
    const url = `${baseUrl}${fullPath}${searchParams ? `?${searchParams}` : ''}`;

    console.log(`[Proxy] ${method} request to backend`);
    console.log(`[Proxy] Path: ${fullPath}`);
    console.log(`[Proxy] Full URL: ${url}`);

    // Get request body for POST/PUT/PATCH
    let body;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await request.text();
      console.log(`[Proxy] Request body length: ${body.length}`);
    }

    // Forward headers from the original request
    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      // Skip host and connection headers
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    console.log(`[Proxy] Forwarding ${Object.keys(headers).length} headers`);

    // Make request to backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      console.log(`[Proxy] Starting fetch to backend...`);
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`[Proxy] ✓ Response received - Status: ${response.status}`);

      // Get response data
      const data = await response.text();
      console.log(`[Proxy] Response body length: ${data.length}`);

      // Return response with same status and headers
      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error(`[Proxy] ✗ Fetch failed:`, fetchError);
      throw fetchError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isTimeout = errorMessage.includes('aborted');
    const isConnectionRefused = errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND');
    const isNetworkError = errorMessage.includes('fetch failed');
    
    console.error('[Proxy] ========== ERROR DETAILS ==========');
    console.error('[Proxy] Message:', errorMessage);
    console.error('[Proxy] Method:', method);
    console.error('[Proxy] Path:', params.path.join('/'));
    console.error('[Proxy] Backend URL:', BACKEND_API_URL);
    console.error('[Proxy] Is Timeout:', isTimeout);
    console.error('[Proxy] Is Connection Refused:', isConnectionRefused);
    console.error('[Proxy] Is Network Error:', isNetworkError);
    console.error('[Proxy] Full error:', error);
    console.error('[Proxy] =====================================');
    
    let details = errorMessage;
    let suggestions: string[] = [];
    
    if (isTimeout) {
      details = 'Backend request timed out after 30 seconds.';
      suggestions = [
        'Check if backend server is running',
        'Verify backend is accessible from Vercel servers',
        'Check for firewall rules blocking Vercel IPs'
      ];
    } else if (isConnectionRefused) {
      details = `Cannot connect to backend. Connection refused or host not found.`;
      suggestions = [
        'Verify BACKEND_API_URL is correct: ' + BACKEND_API_URL,
        'Check if backend server is running and accessible',
        'Verify firewall allows incoming connections from Vercel',
        'Try accessing the backend URL directly from your browser'
      ];
    } else if (isNetworkError) {
      details = 'Network error occurred while connecting to backend.';
      suggestions = [
        'Backend may be unreachable from Vercel servers',
        'Check if backend requires VPN or is on private network',
        'Verify backend firewall allows Vercel IP ranges'
      ];
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to proxy request',
        details,
        suggestions,
        backendConfigured: !!process.env.BACKEND_API_URL,
        technicalDetails: errorMessage,
      },
      { status: 502 }
    );
  }
}
