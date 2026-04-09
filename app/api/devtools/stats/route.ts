import { NextResponse } from 'next/server'
import { captureServerStats } from '@/lib/server-stats'

function verifyPassword(request: Request): boolean {
  const password = request.headers.get('x-devtools-password')
  const expected = process.env.DEVTOOLS_PASSWORD || 'zullstack.dev'
  return password === expected
}

export async function GET(request: Request) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = await captureServerStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('[devtools] Failed to capture stats:', error)
    return NextResponse.json({ error: 'Failed to capture stats' }, { status: 500 })
  }
}
