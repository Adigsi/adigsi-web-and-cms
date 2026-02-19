import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titleEn, titleId, buttonTextEn, buttonTextId, buttonUrl } = body

    // Validate required fields
    if (!titleEn || !titleId) {
      return NextResponse.json(
        { error: 'Title in both languages is required' },
        { status: 400 }
      )
    }

    if (!buttonUrl) {
      return NextResponse.json(
        { error: 'Button URL is required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('register_content')

    // Update or insert join data
    const result = await collection.updateOne(
      { section: 'join' },
      {
        $set: {
          titleEn,
          titleId,
          buttonTextEn: buttonTextEn || 'Join Now',
          buttonTextId: buttonTextId || 'Bergabung Sekarang',
          buttonUrl,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Join section updated successfully',
      data: { titleEn, titleId, buttonTextEn, buttonTextId, buttonUrl },
    })
  } catch (error) {
    console.error('Error updating join section:', error)
    return NextResponse.json(
      { error: 'Failed to update join section' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('register_content')

    const join = await collection.findOne({ section: 'join' })

    if (!join) {
      return NextResponse.json({
        titleEn: '',
        titleId: '',
        buttonTextEn: 'Join Now',
        buttonTextId: 'Bergabung Sekarang',
        buttonUrl: '',
      })
    }

    return NextResponse.json({
      titleEn: join.titleEn || '',
      titleId: join.titleId || '',
      buttonTextEn: join.buttonTextEn || 'Join Now',
      buttonTextId: join.buttonTextId || 'Bergabung Sekarang',
      buttonUrl: join.buttonUrl || '',
    })
  } catch (error) {
    console.error('Error fetching join section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch join section' },
      { status: 500 }
    )
  }
}
