import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

interface BannerData {
  titleEn: string
  titleId: string
  imageUrl: string
}

const defaultBannerData: BannerData = {
  titleEn: 'Adigsi Activity Agenda',
  titleId: 'Agenda Kegiatan Adigsi',
  imageUrl: '/images/about-banner.jpg',
}

export async function POST(request: NextRequest) {
  try {
    const data: BannerData = await request.json()

    // Validation
    if (!data.titleEn || !data.titleId) {
      return NextResponse.json(
        { error: 'Title in English and Indonesian are required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('events_content')

    // Upsert banner data
    await collection.updateOne(
      { section: 'banner' },
      {
        $set: {
          section: 'banner',
          ...data,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error saving banner:', error)
    return NextResponse.json(
      { error: 'Failed to save banner' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('events_content')

    const banner = await collection.findOne({ section: 'banner' })

    if (banner) {
      return NextResponse.json({
        titleEn: banner.titleEn || defaultBannerData.titleEn,
        titleId: banner.titleId || defaultBannerData.titleId,
        imageUrl: banner.imageUrl || defaultBannerData.imageUrl,
      })
    }

    return NextResponse.json(defaultBannerData)
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json(defaultBannerData)
  }
}
