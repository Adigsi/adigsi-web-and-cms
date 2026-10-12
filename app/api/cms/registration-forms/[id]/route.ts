import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getCmsSessionFromRequest, notDeleted, softDeleteOne } from '@/lib/soft-delete'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid registration form ID' }, { status: 400 })
    }

    const body = await request.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: Record<string, any> = { updatedAt: new Date() }

    if (typeof body.isRead === 'boolean') update.isRead = body.isRead
    if (body.status) update.status = body.status

    const db = await getMongoDatabase()
    const collection = db.collection('registration_forms')

    const result = await collection.updateOne(
      { _id: new ObjectId(id), ...notDeleted },
      { $set: update },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Registration form not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Updated successfully' })
  } catch (error) {
    console.error('Error updating registration form:', error)
    return NextResponse.json({ error: 'Failed to update registration form' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getCmsSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid registration form ID' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('registration_forms')

    const deleted = await softDeleteOne(collection, { _id: new ObjectId(id) }, session)

    if (!deleted) {
      return NextResponse.json({ error: 'Registration form not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    console.error('Error deleting registration form:', error)
    return NextResponse.json({ error: 'Failed to delete registration form' }, { status: 500 })
  }
}
