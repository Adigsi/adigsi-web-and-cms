import { NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

// Used by scripts/deploy/activate-release.sh to verify a new release before keeping it
export async function GET() {
  try {
    const db = await getMongoDatabase()
    await db.command({ ping: 1 })

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({ status: 'error' }, { status: 503 })
  }
}
