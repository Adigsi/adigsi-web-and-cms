import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('home_content')
    
    const data = await collection.findOne({ section: 'banner' })
    
    if (data && data.banner) {
      return NextResponse.json(data.banner)
    }

    // Return default data if not found
    return NextResponse.json({
      titleSmallEn: 'WELCOME TO ADIGSI',
      titleSmallId: 'SELAMAT DATANG DI ADIGSI',
      titleLargeEn: "Safeguarding Indonesia's Digital Future",
      titleLargeId: 'Mengamankan Masa Depan Digital Indonesia',
      descriptionEn: 'Becoming a key pillar in building and strengthening a resilient, innovative, and sustainable cybersecurity ecosystem in Indonesia.',
      descriptionId: 'Menjadi pilar utama dalam membangun dan memperkuat ekosistem keamanan siber yang tangguh, inovatif, dan berkelanjutan di Indonesia.',
      backgroundImage: '/images/image-hero-banner.webp',
      aboutButtonTextEn: 'About Us',
      aboutButtonTextId: 'Tentang Kami',
      aboutButtonLink: '/about',
      joinButtonTextEn: 'Join Now',
      joinButtonTextId: 'Bergabung Sekarang',
      joinButtonLink: 'https://docs.google.com/forms/d/e/1FAIpQLScG1BWquhT9vpcgMfHeJy0ummlZOQXhUAxtYXxSmkNTdUDr6g/viewform'
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
    const requiredFields = [
      'titleSmallEn', 'titleSmallId', 'titleLargeEn', 'titleLargeId',
      'descriptionEn', 'descriptionId', 'backgroundImage',
      'aboutButtonTextEn', 'aboutButtonTextId', 'aboutButtonLink',
      'joinButtonTextEn', 'joinButtonTextId', 'joinButtonLink'
    ]

    for (const field of requiredFields) {
      if (!bannerData[field] || typeof bannerData[field] !== 'string' || !bannerData[field].trim()) {
        return NextResponse.json(
          { error: `Field ${field} is required and must not be empty` },
          { status: 400 }
        )
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
