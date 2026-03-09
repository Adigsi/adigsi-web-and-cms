import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface TagData {
  nameEn: string
  nameId: string
}

export async function GET(request: NextRequest) {
  try {
    const activeOnly = request.nextUrl.searchParams.get('active') === 'true'

    const db = await getMongoDatabase()
    const collection = db.collection('report_tags')

    const filter = activeOnly ? { active: true } : {}

    const tags = await collection
      .find(filter)
      .sort({ nameEn: 1 })
      .toArray()

    return NextResponse.json({
      success: true,
      tags: tags.map((tag) => ({
        _id: tag._id?.toString(),
        nameEn: tag.nameEn,
        nameId: tag.nameId,
        active: tag.active ?? true,
      })),
    })
  } catch (error) {
    console.error('Error fetching report tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: TagData = await request.json()

    if (!data.nameEn || !data.nameId) {
      return NextResponse.json(
        { error: 'Tag name in English and Indonesian are required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('report_tags')

    const result = await collection.insertOne({
      nameEn: data.nameEn.trim(),
      nameId: data.nameId.trim(),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: 'Tag created successfully',
      _id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 })
    }

    const data: TagData = await request.json()

    if (!data.nameEn || !data.nameId) {
      return NextResponse.json(
        { error: 'Tag name in English and Indonesian are required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('report_tags')

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          nameEn: data.nameEn.trim(),
          nameId: data.nameId.trim(),
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Tag updated successfully' })
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 })
    }

    const body = await request.json()
    if (typeof body.active !== 'boolean') {
      return NextResponse.json({ error: 'active (boolean) is required' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('report_tags')

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { active: body.active, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Tag ${body.active ? 'activated' : 'deactivated'} successfully`,
    })
  } catch (error) {
    console.error('Error toggling tag status:', error)
    return NextResponse.json({ error: 'Failed to update tag status' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('report_tags')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}
