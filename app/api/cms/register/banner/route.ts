import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titleEn, titleId, imageUrl } = body

    // Validate required fields
    if (!titleEn || !titleId) {
      return NextResponse.json(
        { error: 'Title in both languages is required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('register_content')

    // Update or insert banner data
    const result = await collection.updateOne(
      { section: 'banner' },
      {
        $set: {
          titleEn,
          titleId,
          imageUrl: imageUrl || '',
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Banner updated successfully',
      data: { titleEn, titleId, imageUrl },
    })
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('register_content')

    const banner = await collection.findOne({ section: 'banner' })

    if (!banner) {
      return NextResponse.json({
        titleEn: '',
        titleId: '',
        imageUrl: '',
      })
    }

    return NextResponse.json({
      titleEn: banner.titleEn || '',
      titleId: banner.titleId || '',
      imageUrl: banner.imageUrl || '',
    })
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    )
  }
}
