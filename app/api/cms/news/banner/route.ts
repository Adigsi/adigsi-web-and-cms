import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('news_content')

    const banner = await collection.findOne({ section: 'banner' })

    if (!banner) {
      return NextResponse.json({
        titleEn: 'Latest News',
        titleId: 'Berita Terbaru',
        imageUrl: '/images/about-banner.jpg',
      })
    }

    return NextResponse.json({
      titleEn: banner.titleEn || 'Latest News',
      titleId: banner.titleId || 'Berita Terbaru',
      imageUrl: banner.imageUrl || '/images/about-banner.jpg',
    })
  } catch (error) {
    console.error('Error fetching news banner:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banner data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { titleEn, titleId, imageUrl } = data

    const db = await getMongoDatabase()
    const collection = db.collection('news_content')

    await collection.updateOne(
      { section: 'banner' },
      {
        $set: {
          titleEn,
          titleId,
          imageUrl,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          section: 'banner',
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Banner updated successfully',
    })
  } catch (error) {
    console.error('Error saving news banner:', error)
    return NextResponse.json(
      { error: 'Failed to save banner data' },
      { status: 500 }
    )
  }
}
