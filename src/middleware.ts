import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  console.log('[Middleware] Path:', pathname, 'has token?', !!token, 'token length:', token?.length);

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If trying to access protected route without token
  if (!isPublicRoute && !token) {
    console.log('[Middleware] No token cookie, redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access login page, let the component handle redirection
  // (component will redirect based on user role)

  console.log('[Middleware] Allowing request');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
