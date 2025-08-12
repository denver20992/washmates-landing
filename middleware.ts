import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Redirect /lander to root
  if (url.pathname === '/lander' || url.pathname === '/lander/') {
    url.pathname = '/'
    return NextResponse.redirect(url, { status: 301 })
  }

  // Redirect non-www to www
  if (hostname === 'washmates.ca' || hostname.startsWith('washmates.ca:')) {
    const newUrl = new URL(request.url)
    newUrl.hostname = 'www.washmates.ca'
    return NextResponse.redirect(newUrl, { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}