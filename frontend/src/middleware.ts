// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass for license page, static assets and api routes
  if (
    pathname.startsWith('/license-required') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Check license status from backend
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/license/status`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    if (!data.valid) {
      return NextResponse.redirect(new URL('/license-required', request.url));
    }
  } catch {
    // If backend is down, allow access (fail-open for development)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
