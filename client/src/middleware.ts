import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin/dashboard)
  const path = request.nextUrl.pathname;

  // Define paths that should be protected
  const isAdminPath = path.startsWith('/admin') && !path.startsWith('/admin/login');
  
  // Check if the user is authenticated by looking for the token in cookies
  const token = request.cookies.get('token')?.value || '';
  
  // If it's an admin path and there's no token, redirect to the login page
  if (isAdminPath && !token) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  // Specify which paths this middleware applies to
  matcher: ['/admin/:path*'],
};
