import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'
import { hashCmsPassword, verifyCmsPassword } from '@/lib/cms-auth'
import { verifyCmsSessionToken } from '@/lib/cms-session'
import { getMongoDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(CMS_AUTH_COOKIE)?.value

    if (!sessionCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const session = await verifyCmsSessionToken(sessionCookie)

    if (!session) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const { currentPassword, newPassword } = body ?? {}

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 },
      )
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { message: 'New password must be at least 8 characters' },
        { status: 400 },
      )
    }

    const database = await getMongoDatabase()
    const usersCollection = database.collection('cms_users')

    const user = await usersCollection.findOne({ _id: new ObjectId(session.sub) })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const isCurrentPasswordValid = verifyCmsPassword(currentPassword, user as Parameters<typeof verifyCmsPassword>[1])

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 })
    }

    const newPasswordHash = hashCmsPassword(newPassword)

    await usersCollection.updateOne(
      { _id: new ObjectId(session.sub) },
      { $set: { passwordHash: newPasswordHash } },
    )

    return NextResponse.json({ message: 'Password changed successfully' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { message: 'Error changing password', error: errorMessage },
      { status: 500 },
    )
  }
}
