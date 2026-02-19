import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyCmsSessionToken } from '@/lib/cms-session'
import { getMongoDatabase } from '@/lib/mongodb'
import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(CMS_AUTH_COOKIE)?.value
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const session = await verifyCmsSessionToken(sessionCookie)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Invalid session' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => null)
    const language = body?.language

    if (!language || !['en', 'id'].includes(language)) {
      return NextResponse.json(
        { message: 'Invalid language preference' },
        { status: 400 }
      )
    }

    const database = await getMongoDatabase()
    const usersCollection = database.collection('cms_users')
    
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(session.sub) },
      { $set: { language } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Language preference updated successfully',
      language
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { message: 'Error updating language preference', error: errorMessage },
      { status: 500 }
    )
  }
}
