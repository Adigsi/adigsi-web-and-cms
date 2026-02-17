import { NextResponse } from 'next/server'

import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'
import { authenticateCmsUser } from '@/lib/cms-auth'
import { createCmsSessionToken } from '@/lib/cms-session'

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

  try {
    const authenticatedUser = await authenticateCmsUser(email, password)

    if (!authenticatedUser) {
      return NextResponse.json(
        { message: 'Email atau password salah.' },
        { status: 401 },
      )
    }

    const sessionToken = await createCmsSessionToken(authenticatedUser)
    const response = NextResponse.json({
      message: 'Login berhasil.',
      user: {
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role,
      },
    })

    response.cookies.set(CMS_AUTH_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    })

    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Login Error]', errorMessage)
    return NextResponse.json(
      { message: 'Server gagal memproses login.' },
      { status: 500 },
    )
  }
}
