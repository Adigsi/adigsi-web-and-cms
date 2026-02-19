import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyCmsSessionToken } from '@/lib/cms-session'
import { getMongoDatabase } from '@/lib/mongodb'
import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
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

    const database = await getMongoDatabase()
    const usersCollection = database.collection('cms_users')
    
    const user = await usersCollection.findOne({
      _id: new ObjectId(session.sub)
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || null,
        role: user.role || 'admin',
        language: user.language || 'en' // Default to English if not set
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { message: 'Error fetching user profile', error: errorMessage },
      { status: 500 }
    )
  }
}
