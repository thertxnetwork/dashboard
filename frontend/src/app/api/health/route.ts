import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.BACKEND_API_URL;
  
  return NextResponse.json({
    status: 'ok',
    proxy: 'configured',
    backendUrl: backendUrl || 'NOT CONFIGURED - using default http://localhost:8000/api',
    isConfigured: !!backendUrl,
    message: backendUrl 
      ? 'Proxy is configured and ready' 
      : '⚠️ BACKEND_API_URL environment variable is not set. Please configure it in Vercel settings.',
  });
}
