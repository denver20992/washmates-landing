import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  const pathname = url.pathname

  // Always redirect /lander to root
  if (pathname === '/lander' || pathname === '/lander/') {
    url.pathname = '/'
    return NextResponse.redirect(url, { status: 301 })
  }

  // Redirect non-www to www for production domain
  if (hostname === 'washmates.ca' || hostname.startsWith('washmates.ca:')) {
    const newUrl = new URL(request.url)
    newUrl.hostname = 'www.washmates.ca'
    newUrl.pathname = pathname === '/lander' || pathname === '/lander/' ? '/' : pathname
    return NextResponse.redirect(newUrl, { status: 301 })
  }

  // Ensure root path serves the main page
  if (pathname === '/') {
    return NextResponse.next()
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