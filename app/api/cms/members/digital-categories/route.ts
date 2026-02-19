import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

interface DigitalCategory {
  nameEn: string
  nameId: string
  count: number
  icon: string
}

interface HeadingData {
  subtitleEn: string
  subtitleId: string
  titleEn: string
  titleId: string
}

interface DigitalCategoriesData {
  heading: HeadingData
  categories: DigitalCategory[]
}

/**
 * ============================================================================
 * DIGITAL MEMBER CATEGORIES SECTION API
 * ============================================================================
 * 
 * Endpoint: POST /api/cms/members/digital-categories
 * Endpoint: GET /api/cms/members/digital-categories
 * 
 * This API manages both the section heading and digital member categories for
 * the Digital Members page. Both data are stored in a single database document
 * to ensure data consistency and simplify CRUD operations.
 * 
 * ============================================================================
 * DATABASE SCHEMA
 * ============================================================================
 * 
 * Collection: members_content
 * Document Filter: { section: "digital-categories" }
 * 
 * Document Structure:
 * {
 *   _id: ObjectId,
 *   section: "digital-categories",
 *   heading: {
 *     subtitleEn: string,      // Section subtitle in English
 *     subtitleId: string,      // Section subtitle in Indonesian
 *     titleEn: string,         // Section title in English
 *     titleId: string,         // Section title in Indonesian
 *   },
 *   categories: [
 *     {
 *       nameEn: string,        // Category name in English
 *       nameId: string,        // Category name in Indonesian
 *       count: number,         // Number of members in this category
 *       icon: string,          // Icon identifier (e.g., 'ecommerce', 'logistic', etc.)
 *     },
 *     ... (more categories)
 *   ],
 *   updatedAt: Date,           // Last update timestamp
 *   createdAt: Date,           // Creation timestamp
 * }
 * 
 * ============================================================================
 * API USAGE
 * ============================================================================
 * 
 * REQUEST: POST /api/cms/members/digital-categories
 * Content-Type: application/json
 * 
 * Body format:
 * {
 *   "heading": {
 *     "subtitleEn": "DIGITAL ECOSYSTEM",
 *     "subtitleId": "EKOSISTEM DIGITAL",
 *     "titleEn": "ADIGSI Digital Members",
 *     "titleId": "Anggota Digital ADIGSI"
 *   },
 *   "categories": [
 *     {
 *       "nameEn": "Ecommerce",
 *       "nameId": "E-commerce",
 *       "count": 32,
 *       "icon": "ecommerce"
 *     },
 *     {
 *       "nameEn": "Logistic",
 *       "nameId": "Logistik",
 *       "count": 18,
 *       "icon": "logistic"
 *     },
 *     ... (more categories)
 *   ]
 * }
 * 
 * RESPONSE: 200 OK
 * {
 *   "success": true,
 *   "message": "Digital categories and heading saved successfully",
 *   "data": {
 *     "heading": { ... },
 *     "categories": [ ... ]
 *   }
 * }
 * 
 * REQUEST: GET /api/cms/members/digital-categories
 * 
 * RESPONSE: 200 OK
 * {
 *   "heading": {
 *     "subtitleEn": "DIGITAL ECOSYSTEM",
 *     "subtitleId": "EKOSISTEM DIGITAL",
 *     "titleEn": "ADIGSI Digital Members",
 *     "titleId": "Anggota Digital ADIGSI"
 *   },
 *   "categories": [
 *     {
 *       "nameEn": "Ecommerce",
 *       "nameId": "E-commerce",
 *       "count": 32,
 *       "icon": "ecommerce"
 *     },
 *     ... (more categories)
 *   ]
 * }
 * 
 * ============================================================================
 * VALIDATION RULES
 * ============================================================================
 * 
 * Heading Fields:
 * - subtitleEn: Required, non-empty string
 * - subtitleId: Required, non-empty string
 * - titleEn: Required, non-empty string
 * - titleId: Required, non-empty string
 * 
 * Categories:
 * - Must have at least 1 category
 * - Each category must have:
 *   - nameEn: Required, non-empty string
 *   - nameId: Required, non-empty string
 *   - count: Optional, integer >= 0 (default: 0)
 *   - icon: Optional, string (default: 'ecommerce')
 * 
 * ============================================================================
 * DIGITAL ICON OPTIONS
 * ============================================================================
 * 
 * Available icons for digital categories (11 total):
 * ecommerce, logistic, financial, edutech, telecom, media, healthcare,
 * venture, consultant, university, bumn
 * 
 * ============================================================================
 * DEFAULT VALUES
 * ============================================================================
 * 
 * If no document exists in the database, the API returns default values:
 * 
 * Heading:
 * - subtitleEn: "DIGITAL ECOSYSTEM"
 * - subtitleId: "EKOSISTEM DIGITAL"
 * - titleEn: "ADIGSI Digital Members"
 * - titleId: "Anggota Digital ADIGSI"
 * 
 * Categories: 11 default digital categories with predefined names and member counts
 * 
 * ============================================================================
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any

    // Handle both old (separate heading/categories) and new (combined) formats
    let heading: HeadingData
    let categories: DigitalCategory[]

    if (body.heading && body.categories) {
      // New combined format
      heading = body.heading
      categories = body.categories
    } else if (body.categories && !body.heading) {
      // Old format: only categories, fetch existing heading
      const db = await getMongoDatabase()
      const existing = await db.collection('members_content').findOne({ section: 'digital-categories' })
      
      heading = existing?.heading || {
        subtitleEn: 'DIGITAL ECOSYSTEM',
        subtitleId: 'EKOSISTEM DIGITAL',
        titleEn: 'ADIGSI Digital Members',
        titleId: 'Anggota Digital ADIGSI',
      }
      categories = body.categories
    } else {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    // Validate heading
    if (!heading.subtitleEn || !heading.subtitleId || !heading.titleEn || !heading.titleId) {
      return NextResponse.json(
        { error: 'All heading fields are required' },
        { status: 400 }
      )
    }

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category is required' },
        { status: 400 }
      )
    }

    // Validate each category
    for (const category of categories) {
      if (!category.nameEn || !category.nameId) {
        return NextResponse.json(
          { error: 'Each category must have name in both languages' },
          { status: 400 }
        )
      }
    }

    const db = await getMongoDatabase()

    const now = new Date()
    const result = await db.collection('members_content').updateOne(
      { section: 'digital-categories' },
      {
        $set: {
          section: 'digital-categories',
          heading,
          categories,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Digital categories and heading saved successfully',
      data: { heading, categories },
    })
  } catch (error) {
    console.error('Error saving digital categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()

    const data = await db.collection('members_content').findOne({ section: 'digital-categories' })

    const defaultHeading: HeadingData = {
      subtitleEn: 'DIGITAL ECOSYSTEM',
      subtitleId: 'EKOSISTEM DIGITAL',
      titleEn: 'ADIGSI Digital Members',
      titleId: 'Anggota Digital ADIGSI',
    }

    const defaultCategories: DigitalCategory[] = [
      { nameEn: 'Ecommerce', nameId: 'E-commerce', count: 32, icon: 'ecommerce' },
      { nameEn: 'Logistic', nameId: 'Logistik', count: 18, icon: 'logistic' },
      { nameEn: 'Financial Services', nameId: 'Layanan Keuangan', count: 45, icon: 'financial' },
      { nameEn: 'Edutech', nameId: 'Teknologi Pendidikan', count: 21, icon: 'edutech' },
      { nameEn: 'Telecommunication', nameId: 'Telekomunikasi', count: 15, icon: 'telecom' },
      { nameEn: 'Media/Publisher/EO', nameId: 'Media/Publisher/EO', count: 28, icon: 'media' },
      { nameEn: 'Healthcare', nameId: 'Layanan Kesehatan', count: 24, icon: 'healthcare' },
      { nameEn: 'Venture Capital', nameId: 'Modal Ventura', count: 12, icon: 'venture' },
      { nameEn: 'Consultant', nameId: 'Konsultan', count: 19, icon: 'consultant' },
      { nameEn: 'University/School', nameId: 'Universitas/Sekolah', count: 35, icon: 'university' },
      { nameEn: 'BUMN', nameId: 'BUMN', count: 16, icon: 'bumn' },
    ]

    if (!data) {
      return NextResponse.json({
        heading: defaultHeading,
        categories: defaultCategories,
      })
    }

    return NextResponse.json({
      heading: data.heading || defaultHeading,
      categories: data.categories || defaultCategories,
    })
  } catch (error) {
    console.error('Error fetching digital categories:', error)
    return NextResponse.json(
      {
        heading: {
          subtitleEn: 'DIGITAL ECOSYSTEM',
          subtitleId: 'EKOSISTEM DIGITAL',
          titleEn: 'ADIGSI Digital Members',
          titleId: 'Anggota Digital ADIGSI',
        },
        categories: [
          { nameEn: 'Ecommerce', nameId: 'E-commerce', count: 32, icon: 'ecommerce' },
          { nameEn: 'Logistic', nameId: 'Logistik', count: 18, icon: 'logistic' },
          { nameEn: 'Financial Services', nameId: 'Layanan Keuangan', count: 45, icon: 'financial' },
          { nameEn: 'Edutech', nameId: 'Teknologi Pendidikan', count: 21, icon: 'edutech' },
          { nameEn: 'Telecommunication', nameId: 'Telekomunikasi', count: 15, icon: 'telecom' },
          { nameEn: 'Media/Publisher/EO', nameId: 'Media/Publisher/EO', count: 28, icon: 'media' },
          { nameEn: 'Healthcare', nameId: 'Layanan Kesehatan', count: 24, icon: 'healthcare' },
          { nameEn: 'Venture Capital', nameId: 'Modal Ventura', count: 12, icon: 'venture' },
          { nameEn: 'Consultant', nameId: 'Konsultan', count: 19, icon: 'consultant' },
          { nameEn: 'University/School', nameId: 'Universitas/Sekolah', count: 35, icon: 'university' },
          { nameEn: 'BUMN', nameId: 'BUMN', count: 16, icon: 'bumn' },
        ],
      },
      { status: 200 }
    )
  }
}
