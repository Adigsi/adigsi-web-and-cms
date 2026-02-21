import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

interface CarousellSlide {
  image: string
  link?: string
  published?: boolean
}

interface CarousellData {
  slides: CarousellSlide[]
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('home_content')

    const data = await collection.findOne({ section: 'carousell' })

    if (data && data.carousell) {
      return NextResponse.json(data.carousell)
    }

    const defaultData: CarousellData = {
      slides: [
        {
          image: '/images/hero-background.webp',
          link: '',
          published: true,
        },
        {
          image: '/images/cybersecurity-hero.jpg',
          link: '',
          published: true,
        },
        {
          image: '/images/image-hero-banner.webp',
          link: '',
          published: true,
        },
      ],
    }

    return NextResponse.json(defaultData)
  } catch (error) {
    console.error('Error fetching carousell:', error)
    return NextResponse.json(
      { error: 'Failed to fetch carousell data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const carousellData = await request.json()

    if (!carousellData || !Array.isArray(carousellData.slides)) {
      return NextResponse.json(
        { error: 'Slides are required' },
        { status: 400 }
      )
    }

    if (carousellData.slides.length === 0) {
      return NextResponse.json(
        { error: 'At least one slide is required' },
        { status: 400 }
      )
    }

    for (let i = 0; i < carousellData.slides.length; i++) {
      const slide = carousellData.slides[i]
      const isPublished = typeof slide.published === 'boolean' ? slide.published : false
      const hasImage = typeof slide.image === 'string' && slide.image.trim().length > 0

      if (isPublished && !hasImage) {
        return NextResponse.json(
          { error: `Slide ${i + 1}: image is required when published` },
          { status: 400 }
        )
      }

      if (slide.link && typeof slide.link !== 'string') {
        return NextResponse.json(
          { error: `Slide ${i + 1}: link must be a string` },
          { status: 400 }
        )
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('home_content')

    await collection.updateOne(
      { section: 'carousell' },
      {
        $set: {
          section: 'carousell',
          carousell: carousellData,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      message: 'Carousell saved successfully',
      data: carousellData,
    })
  } catch (error) {
    console.error('Error saving carousell:', error)
    return NextResponse.json(
      { error: 'Failed to save carousell data' },
      { status: 500 }
    )
  }
}
