import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

/**
 * GET /api/cms/members/partner-logos
 * Fetch partner logos data
 * 
 * Response Schema:
 * {
 *   heading: {
 *     subtitleEn: string
 *     subtitleId: string
 *     titleEn: string
 *     titleId: string
 *   }
 *   categories: [
 *     {
 *       categoryNameEn: string
 *       categoryNameId: string
 *       width: number (px)
 *       height: number (px)
 *       logos: [
 *         {
 *           alt: string
 *           imageUrl: string (image URL or base64 data URI)
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('members_content')

    const data = await collection.findOne({ section: 'partner-logos' })

    if (!data) {
      // Return default partner logos structure
      return NextResponse.json({
        heading: {
          subtitleEn: 'OUR PARTNERS',
          subtitleId: 'MITRA KAMI',
          titleEn: 'ADIGSI Members',
          titleId: 'Anggota ADIGSI',
        },
        categories: [
          {
            categoryNameEn: 'Platinum',
            categoryNameId: 'Platinum',
            width: 220,
            height: 140,
            logos: [],
          },
          {
            categoryNameEn: 'Gold',
            categoryNameId: 'Gold',
            width: 190,
            height: 115,
            logos: [],
          },
          {
            categoryNameEn: 'Silver',
            categoryNameId: 'Silver',
            width: 160,
            height: 95,
            logos: [],
          },
          {
            categoryNameEn: 'Bronze',
            categoryNameId: 'Bronze',
            width: 130,
            height: 75,
            logos: [],
          },
        ],
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching partner logos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partner logos' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cms/members/partner-logos
 * Save or update partner logos data
 * 
 * Request Body:
 * {
 *   heading: {
 *     subtitleEn: string (required, non-empty)
 *     subtitleId: string (required, non-empty)
 *     titleEn: string (required, non-empty)
 *     titleId: string (required, non-empty)
 *   }
 *   categories: [
 *     {
 *       categoryNameEn: string (required, non-empty)
 *       categoryNameId: string (required, non-empty)
 *       width: number (required, > 0)
 *       height: number (required, > 0)
 *       logos: [
 *         {
 *           alt: string (any value allowed)
 *           imageUrl: string (URL or base64 data URI)
 *         }
 *       ]
 *     }
 *   ]
 * }
 * 
 * Validation:
 * - Heading must have all 4 fields non-empty
 * - Categories must have at least 1 item
 * - Each category must have non-empty names and positive dimensions
 * - Logos array can be empty
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { heading, categories } = body

    // Validate heading
    if (!heading || typeof heading !== 'object') {
      return NextResponse.json(
        { error: 'Heading is required and must be an object' },
        { status: 400 }
      )
    }

    const requiredHeadingFields = ['subtitleEn', 'subtitleId', 'titleEn', 'titleId']
    for (const field of requiredHeadingFields) {
      if (!heading[field] || typeof heading[field] !== 'string' || heading[field].trim() === '') {
        return NextResponse.json(
          { error: `Heading.${field} is required and must be non-empty` },
          { status: 400 }
        )
      }
    }

    // Validate categories
    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Categories must be an array' },
        { status: 400 }
      )
    }

    if (categories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category is required' },
        { status: 400 }
      )
    }

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]

      if (!cat.categoryNameEn || typeof cat.categoryNameEn !== 'string' || cat.categoryNameEn.trim() === '') {
        return NextResponse.json(
          { error: `Category ${i + 1}: categoryNameEn is required and must be non-empty` },
          { status: 400 }
        )
      }

      if (!cat.categoryNameId || typeof cat.categoryNameId !== 'string' || cat.categoryNameId.trim() === '') {
        return NextResponse.json(
          { error: `Category ${i + 1}: categoryNameId is required and must be non-empty` },
          { status: 400 }
        )
      }

      if (typeof cat.width !== 'number' || cat.width <= 0) {
        return NextResponse.json(
          { error: `Category ${i + 1}: width must be a positive number` },
          { status: 400 }
        )
      }

      if (typeof cat.height !== 'number' || cat.height <= 0) {
        return NextResponse.json(
          { error: `Category ${i + 1}: height must be a positive number` },
          { status: 400 }
        )
      }

      if (!Array.isArray(cat.logos)) {
        return NextResponse.json(
          { error: `Category ${i + 1}: logos must be an array` },
          { status: 400 }
        )
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('members_content')

    const result = await collection.updateOne(
      { section: 'partner-logos' },
      {
        $set: {
          section: 'partner-logos',
          heading,
          categories,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json(
      {
        message: 'Partner logos saved successfully',
        data: { heading, categories },
      },
      { status: result.upsertedId ? 201 : 200 }
    )
  } catch (error) {
    console.error('Error saving partner logos:', error)
    return NextResponse.json(
      { error: 'Failed to save partner logos' },
      { status: 500 }
    )
  }
}
