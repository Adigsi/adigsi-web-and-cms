import { NextResponse } from 'next/server'

import { CMS_AUTH_COOKIE, isValidCmsCredential } from '@/lib/cms-auth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email dan password wajib diisi.' },
      { status: 400 },
    )
  }

  if (!isValidCmsCredential(email, password)) {
    return NextResponse.json(
      { message: 'Email atau password salah.' },
      { status: 401 },
    )
  }

  const response = NextResponse.json({ message: 'Login berhasil.' })

  response.cookies.set(CMS_AUTH_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return response
}
