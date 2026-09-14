import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('march_token')?.value;

  const isLoginPage = pathname === '/login';
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/reports');

  // Verify JWT token if present
  let isValidToken = false;
  if (tokenCookie) {
    const payload = await verifyAuthToken(tokenCookie);
    if (payload) {
      isValidToken = true;
    }
  }

  // If already logged in and visiting login page, redirect to dashboard
  if (isLoginPage && isValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If visiting protected route without valid token, redirect to login
  if (isProtectedRoute && !isValidToken) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/dashboard') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    // Clear stale cookie if invalid
    if (tokenCookie) {
      response.cookies.delete('march_token');
      response.cookies.delete('march_user');
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/orders/:path*',
    '/products/:path*',
    '/reports/:path*',
    '/login',
  ],
};
