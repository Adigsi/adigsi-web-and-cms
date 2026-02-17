import { NextResponse } from 'next/server'

import { CMS_AUTH_COOKIE } from '@/lib/cms-auth'

export async function POST() {
  const response = NextResponse.json({ message: 'Logout berhasil.' })

  response.cookies.set(CMS_AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
