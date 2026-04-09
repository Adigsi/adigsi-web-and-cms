import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const expected = process.env.DEVTOOLS_PASSWORD || 'zullstack.dev'

    if (!password || password !== expected) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
