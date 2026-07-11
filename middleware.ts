import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname already includes language prefix
  const supportedLanguages = ['pt-BR', 'en'];
  const pathnameHasLanguage = supportedLanguages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathnameHasLanguage) {
    return NextResponse.next();
  }

  // Detect user's preferred language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  let preferredLanguage = 'pt-BR'; // default

  if (acceptLanguage.includes('en')) {
    preferredLanguage = 'en';
  }

  // Store language preference in response headers for client-side access
  const response = NextResponse.next();
  response.headers.set('x-preferred-language', preferredLanguage);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};
