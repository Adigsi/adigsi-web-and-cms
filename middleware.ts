import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'
import { verifyCmsSessionToken } from '@/lib/cms-session'

// Behind nginx, request.url is the internal server address (e.g. https://localhost:3000/cms),
// so redirects use the Host header the browser actually sent (nginx: proxy_set_header Host $host)
function redirectTo(request: NextRequest, pathname: string) {
  const url = new URL(pathname, request.url)
  const host = request.headers.get('host')

  if (host) {
    url.port = ''
    url.host = host
  }

  return NextResponse.redirect(url)
}

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
    return redirectTo(request, '/login')
  }

  if (pathname === '/login' && isLoggedIn) {
    return redirectTo(request, '/cms/dashboard')
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cms/:path*', '/login'],
}
