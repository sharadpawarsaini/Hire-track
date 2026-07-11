import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const verified = token ? await verifyJWT(token) : null;
  const { pathname } = request.nextUrl;

  const isAppRoute = pathname.startsWith('/dashboard') ||
                    pathname.startsWith('/jobs') ||
                    pathname.startsWith('/candidates') ||
                    pathname.startsWith('/pipeline') ||
                    pathname.startsWith('/interviews') ||
                    pathname.startsWith('/activity');

  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  if (isAppRoute && !verified) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && verified) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/jobs/:path*',
    '/candidates/:path*',
    '/pipeline/:path*',
    '/interviews/:path*',
    '/activity/:path*',
    '/login',
    '/signup'
  ]
};
