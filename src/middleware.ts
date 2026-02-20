import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Check if a path is a reservation page (public slug)
 * Reservation pages include:
 * 1. Root-level slug: /mon-restaurant
 * 2. Embed reservation page: /embed/reservations/mon-restaurant
 */
function isReservationPath(pathname: string): boolean {
  if (!pathname || pathname === '/') return false;

  // Remove trailing slash
  const cleanPath = pathname.replace(/\/$/, '');

  // Check for root-level slug pattern (single segment, not a known system path)
  const isRootSlug =
    !cleanPath.startsWith('/_next') &&
    !cleanPath.startsWith('/api') &&
    !cleanPath.startsWith('/public') &&
    !cleanPath.startsWith('/static') &&
    !cleanPath.includes('.') && // No file extensions
    !cleanPath.includes('//') && // No double slashes
    cleanPath !== '/' &&
    cleanPath.split('/').length === 2 && // Exactly one segment after root
    !isKnownSystemPath(cleanPath);

  // Check for embed reservation pattern
  const isEmbedReservation =
    cleanPath.startsWith('/embed/reservations/') && cleanPath.split('/').length >= 4; // Has a slug after /embed/reservations/

  return isRootSlug || isEmbedReservation;
}

/**
 * Helper function to check if a path is a known system path
 */
function isKnownSystemPath(pathname: string): boolean {
  const systemPaths = [
    '/',
    '/legal',
    '/privacy',
    '/cookies',
    '/cgv',
    '/signup',
    '/login',
    '/dashboard',
    '/forgot-password',
    '/reset-password',
    '/embed', // Just /embed without a slug
  ];

  return systemPaths.includes(pathname);
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const allCookies = request.cookies.getAll();

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Reservation pages are also public (no authentication required)
  const isReservationRoute = isReservationPath(pathname);

  // If trying to access protected route without token
  if (!isPublicRoute && !isReservationRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access login page, let the component handle redirection
  // (component will redirect based on user role)

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
