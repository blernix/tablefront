/**
 * Page detection utilities for determining page types in the application
 */

/**
 * Checks if the current path is a reservation page
 * Reservation pages include:
 * 1. Root-level slug: /mon-restaurant
 * 2. Embed reservation page: /embed/reservations/mon-restaurant
 *
 * @param pathname - Current pathname (e.g., '/mon-restaurant' or '/embed/reservations/mon-restaurant')
 * @returns boolean indicating if the page is a reservation page
 */
export function isReservationPage(pathname: string): boolean {
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
 * Checks if the current path is an authenticated/dashboard page
 * These pages require authentication cookies
 *
 * @param pathname - Current pathname
 * @returns boolean indicating if the page is an authenticated page
 */
export function isAuthenticatedPage(pathname: string): boolean {
  if (!pathname) return false;

  const cleanPath = pathname.replace(/\/$/, '');

  // Dashboard and admin paths
  const authPaths = [
    '/dashboard',
    '/login', // Login page still uses auth cookies (token)
    '/signup',
  ];

  // Check if path starts with any auth path
  return authPaths.some((authPath) => cleanPath.startsWith(authPath));
}

/**
 * Helper function to check if a path is a known system path that shouldn't be treated as a reservation page
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

/**
 * Determines if cookie consent banner should be shown on the current page
 * Banner should be shown on authenticated pages but NOT on reservation pages
 *
 * @param pathname - Current pathname
 * @returns boolean indicating if cookie consent should be shown
 */
export function shouldShowCookieConsent(pathname: string): boolean {
  // Never show cookie consent on reservation pages (they don't use cookies)
  if (isReservationPage(pathname)) {
    return false;
  }

  // Show cookie consent on authenticated pages (they use auth cookies)
  // Also show on other pages that might use cookies in the future
  return true;
}
