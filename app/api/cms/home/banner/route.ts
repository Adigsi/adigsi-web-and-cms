import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('home_content')
    
    const data = await collection.findOne({ section: 'banner' })
    
    if (data && data.banner) {
      const banner = data.banner

      // Migrate from old schema (aboutButton*/joinButton*) to new schema (primaryButton/secondaryButton)
      if (!banner.primaryButton && (banner.aboutButtonTextEn || banner.aboutButtonLink)) {
        banner.primaryButton = {
          enabled: true,
          textEn: banner.aboutButtonTextEn ?? '',
          textId: banner.aboutButtonTextId ?? '',
          link: banner.aboutButtonLink ?? '',
        }
      }
      if (!banner.secondaryButton && (banner.joinButtonTextEn || banner.joinButtonLink)) {
        banner.secondaryButton = {
          enabled: true,
          textEn: banner.joinButtonTextEn ?? '',
          textId: banner.joinButtonTextId ?? '',
          link: banner.joinButtonLink ?? '',
        }
      }

      return NextResponse.json(banner)
    }

    // Return default data if not found
    return NextResponse.json({
      titleSmallEn: 'WELCOME TO ADIGSI',
      titleSmallId: 'SELAMAT DATANG DI ADIGSI',
      titleLargeEn: "Safeguarding Indonesia's Digital Future",
      titleLargeId: 'Mengamankan Masa Depan Digital Indonesia',
      descriptionEn: 'Becoming a key pillar in building and strengthening a resilient, innovative, and sustainable cybersecurity ecosystem in Indonesia.',
      descriptionId: 'Menjadi pilar utama dalam membangun dan memperkuat ekosistem keamanan siber yang tangguh, inovatif, dan berkelanjutan di Indonesia.',
      primaryButton: {
        enabled: true,
        textEn: 'About Us',
        textId: 'Tentang Kami',
        link: '/about',
      },
      secondaryButton: {
        enabled: true,
        textEn: 'Join Now',
        textId: 'Bergabung Sekarang',
        link: 'https://docs.google.com/forms/d/e/1FAIpQLScG1BWquhT9vpcgMfHeJy0ummlZOQXhUAxtYXxSmkNTdUDr6g/viewform',
      },
    })
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banner data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const bannerData = await request.json()

    // Validate required fields
    const requiredStringFields = [
      'titleSmallEn', 'titleSmallId', 'titleLargeEn', 'titleLargeId',
      'descriptionEn', 'descriptionId',
    ]

    for (const field of requiredStringFields) {
      if (!bannerData[field] || typeof bannerData[field] !== 'string' || !bannerData[field].trim()) {
        return NextResponse.json(
          { error: `Field ${field} is required and must not be empty` },
          { status: 400 }
        )
      }
    }

    // Validate optional button objects
    for (const buttonKey of ['primaryButton', 'secondaryButton'] as const) {
      const btn = bannerData[buttonKey]
      if (btn !== null && btn !== undefined) {
        if (typeof btn !== 'object') {
          return NextResponse.json(
            { error: `${buttonKey} must be an object` },
            { status: 400 }
          )
        }
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('home_content')

    const result = await collection.updateOne(
      { section: 'banner' },
      {
        $set: {
          section: 'banner',
          banner: bannerData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      message: 'Banner saved successfully',
      data: bannerData
    })
  } catch (error) {
    console.error('Error saving banner:', error)
    return NextResponse.json(
      { error: 'Failed to save banner data' },
      { status: 500 }
    )
  }
}
