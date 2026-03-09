import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

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
      { _id: new ObjectId(id) },
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

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid registration form ID' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('registration_forms')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Registration form not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    console.error('Error deleting registration form:', error)
    return NextResponse.json({ error: 'Failed to delete registration form' }, { status: 500 })
  }
}
