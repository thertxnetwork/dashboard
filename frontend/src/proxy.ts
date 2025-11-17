import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to login page
  if (pathname === '/login') {
    return NextResponse.next();
  }
  
  // Redirect root to login (client-side will redirect to dashboard if authenticated)
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  // Allow all other routes (authentication is handled client-side)
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};
