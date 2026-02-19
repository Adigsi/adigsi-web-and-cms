import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'
import { verifyCmsSessionToken } from '@/lib/cms-session'

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(CMS_AUTH_COOKIE)?.value
  const session = sessionCookie
    ? await verifyCmsSessionToken(sessionCookie).catch((error) => {
        console.error('[Middleware Session Verify Error]', error instanceof Error ? error.message : error)
        return null
      })
    : null
  const isLoggedIn = Boolean(session)
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
