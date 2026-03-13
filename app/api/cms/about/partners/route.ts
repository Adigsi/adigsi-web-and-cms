import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { getMediaUrlValidationError } from '@/lib/upload/validate-media-payload'

interface Logo {
  alt: string
  imageUrl: string
}

interface Category {
  titleEn: string
  titleId: string
  logos: Logo[]
}

interface PartnersData {
  categories: Category[]
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as PartnersData

    // Validate structure
    if (!data.categories || !Array.isArray(data.categories)) {
      return NextResponse.json(
        { error: 'Invalid partners data structure' },
        { status: 400 }
      )
    }

    // Validate each category
    for (let i = 0; i < data.categories.length; i++) {
      const category = data.categories[i]
      if (!category.titleEn || !category.titleId) {
        return NextResponse.json(
          { error: 'Each category must have English and Indonesian titles' },
          { status: 400 }
        )
      }
      if (!Array.isArray(category.logos)) {
        return NextResponse.json(
          { error: 'Logos must be an array' },
          { status: 400 }
        )
      }
      // Validate media URLs for logos
      for (let logoIndex = 0; logoIndex < category.logos.length; logoIndex++) {
        const logo = category.logos[logoIndex]
        const imageError = getMediaUrlValidationError(logo.imageUrl, `categories[${i}].logos[${logoIndex}].imageUrl`)
        if (imageError) {
          return NextResponse.json({ error: imageError }, { status: 400 })
        }
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('about_content')

    // Upsert partners data
    const result = await collection.updateOne(
      { section: 'partners' },
      {
        $set: {
          section: 'partners',
          categories: data.categories,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Partners data saved successfully',
      data: {
        categories: data.categories
      }
    })
  } catch (error) {
    console.error('Error saving partners data:', error)
    return NextResponse.json(
      { error: 'Failed to save partners data' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('about_content')

    const partnersData = await collection.findOne({ section: 'partners' })

    if (!partnersData) {
      // Return default structure
      const defaultData = {
        categories: [
          {
            titleEn: 'Government Organizations',
            titleId: 'Organisasi Pemerintah',
            logos: []
          },
          {
            titleEn: 'International Institutions',
            titleId: 'Institusi Internasional',
            logos: []
          },
          {
            titleEn: 'Associations',
            titleId: 'Asosiasi',
            logos: []
          },
          {
            titleEn: 'Companies',
            titleId: 'Perusahaan',
            logos: []
          }
        ]
      }
      return NextResponse.json(defaultData)
    }

    return NextResponse.json({
      categories: partnersData.categories || []
    })
  } catch (error) {
    console.error('Error fetching partners data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partners data' },
      { status: 500 }
    )
  }
}
