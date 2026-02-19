import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

interface BannerData {
  titleEn: string
  titleId: string
  imageUrl: string
}

export async function POST(request: NextRequest) {
  try {
    const { titleEn, titleId, imageUrl } = await request.json()

    if (!titleEn || !titleId) {
      return NextResponse.json(
        { error: 'Title in both languages is required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()

    const result = await db.collection('members_content').updateOne(
      { section: 'banner' },
      {
        $set: {
          section: 'banner',
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
      message: 'Banner saved successfully',
      data: { titleEn, titleId, imageUrl },
    })
  } catch (error) {
    console.error('Error saving banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()

    const banner = await db.collection('members_content').findOne({ section: 'banner' })

    if (!banner) {
      return NextResponse.json({
        titleEn: 'ADIGSI MEMBERS',
        titleId: 'ANGGOTA ADIGSI',
        imageUrl: '/images/about-banner.png',
      })
    }

    return NextResponse.json({
      titleEn: banner.titleEn || 'ADIGSI MEMBERS',
      titleId: banner.titleId || 'ANGGOTA ADIGSI',
      imageUrl: banner.imageUrl || '/images/about-banner.png',
    })
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json(
      {
        titleEn: 'ADIGSI MEMBERS',
        titleId: 'ANGGOTA ADIGSI',
        imageUrl: '/images/about-banner.png',
      },
      { status: 200 }
    )
  }
}
