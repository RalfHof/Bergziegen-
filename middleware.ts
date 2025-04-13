import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('auth')?.value === 'true';

  const protectedPaths = ['/touren'];

  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/touren/:path*'],
};
