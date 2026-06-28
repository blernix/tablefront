import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Role = 'admin' | 'restaurant' | 'server' | 'commercial';

interface JwtPayload {
  exp: number;
  role?: Role;
  [key: string]: unknown;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const payload = JSON.parse(json);

    if (!payload.exp || typeof payload.exp !== 'number') return null;

    return payload as JwtPayload;
  } catch {
    return null;
  }
}

function isValidToken(payload: JwtPayload | null): boolean {
  if (!payload) return false;
  return payload.exp * 1000 > Date.now();
}

function matchRole(pathname: string, role: Role): boolean {
  switch (role) {
    case 'admin':
      return pathname.startsWith('/admin');
    case 'restaurant':
    case 'server':
      return pathname.startsWith('/dashboard');
    case 'commercial':
      return pathname.startsWith('/commercial');
    default:
      return false;
  }
}

function getRoleRedirect(role: Role): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'restaurant':
    case 'server':
      return '/dashboard';
    case 'commercial':
      return '/commercial';
    default:
      return '/login';
  }
}

const PUBLIC_PREFIXES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/ville/',
];

const PUBLIC_PATHS = new Set([
  '/',
  '/legal',
  '/privacy',
  '/cookies',
  '/cgv',
  '/site-sur-mesure',
  '/developpement-web',
  '/debug-sentry',
]);

function isPublicRoute(pathname: string): boolean {
  const clean = pathname.replace(/\/$/, '') || '/';

  if (
    /\.(png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|css|js|json|xml|txt|webmanifest)$/.test(clean)
  ) {
    return true;
  }

  if (PUBLIC_PATHS.has(clean)) return true;

  if (PUBLIC_PREFIXES.some((prefix) => clean.startsWith(prefix))) return true;

  if (clean.startsWith('/embed/reservations/')) return true;

  if (
    clean !== '/' &&
    !clean.includes('.') &&
    !clean.includes('//') &&
    clean.split('/').length === 2 &&
    !clean.startsWith('/_next') &&
    !clean.startsWith('/api')
  ) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const payload = token ? decodeJwtPayload(token) : null;
  const isAuthenticated = isValidToken(payload);
  const role = payload?.role ?? null;

  if (isPublicRoute(cleanPath)) {
    if (isAuthenticated && role) {
      const isAuthPage = PUBLIC_PREFIXES.some((p) => cleanPath.startsWith(p));
      if (isAuthPage && matchRole(cleanPath, role)) {
        return NextResponse.next();
      }
      if (isAuthPage) {
        return NextResponse.redirect(new URL(getRoleRedirect(role), request.url));
      }
    }
    return NextResponse.next();
  }

  if (!isAuthenticated || !role) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }

  if (!matchRole(cleanPath, role)) {
    return NextResponse.redirect(new URL(getRoleRedirect(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.webmanifest).*)'],
};
