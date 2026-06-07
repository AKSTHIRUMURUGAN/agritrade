import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Decode a JWT payload without verifying the signature.
 * Full signature verification happens in the API routes using jsonwebtoken.
 * This is safe for routing decisions — the actual API endpoints re-verify.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Base64url decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes — no auth needed
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/farmershares' ||
    pathname.startsWith('/farmershares/') ||
    pathname === '/land' ||
    pathname.startsWith('/land/') ||
    pathname.startsWith('/api/auth');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // No token — redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes — check role claim in token
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const payload = decodeJwtPayload(token);

    if (!payload || payload.role !== 'admin') {
      // Authenticated but not admin — redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/api/admin/:path*',
    '/addLand',
    '/addFarmerShare',
    '/editLand/:path*',
  ],
};
