import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { CMS_AUTH_COOKIE } from '@/lib/cms-auth'

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(CMS_AUTH_COOKIE)?.value
  const isLoggedIn = sessionCookie === 'authenticated'
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/cms') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/cms/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cms/:path*', '/login'],
}
