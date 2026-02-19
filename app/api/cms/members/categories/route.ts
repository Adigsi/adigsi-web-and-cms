import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

interface MemberCategory {
  titleEn: string
  titleId: string
  count: number
  icon: string
}

interface HeadingData {
  subtitleEn: string
  subtitleId: string
  titleEn: string
  titleId: string
}

interface MemberCategoriesData {
  heading: HeadingData
  categories: MemberCategory[]
}

/**
 * ============================================================================
 * MEMBER CATEGORIES SECTION API
 * ============================================================================
 * 
 * Endpoint: POST /api/cms/members/categories
 * Endpoint: GET /api/cms/members/categories
 * 
 * This API manages both the section heading and member categories for the
 * Members page. Both data are stored in a single database document to ensure
 * data consistency and simplify CRUD operations.
 * 
 * ============================================================================
 * DATABASE SCHEMA
 * ============================================================================
 * 
 * Collection: members_content
 * Document Filter: { section: "categories" }
 * 
 * Document Structure:
 * {
 *   _id: ObjectId,
 *   section: "categories",
 *   heading: {
 *     subtitleEn: string,      // Section subtitle in English
 *     subtitleId: string,      // Section subtitle in Indonesian
 *     titleEn: string,         // Section title in English
 *     titleId: string,         // Section title in Indonesian
 *   },
 *   categories: [
 *     {
 *       titleEn: string,       // Category name in English
 *       titleId: string,       // Category name in Indonesian
 *       count: number,         // Number of members in this category
 *       icon: string,          // Icon identifier (e.g., 'network', 'web', 'endpoint')
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
 * REQUEST: POST /api/cms/members/categories
 * Content-Type: application/json
 * 
 * Body format:
 * {
 *   "heading": {
 *     "subtitleEn": "OUR COMMUNITY",
 *     "subtitleId": "KOMUNITAS KAMI",
 *     "titleEn": "ADIGSI Cyber Security Members",
 *     "titleId": "Anggota Cyber Security ADIGSI"
 *   },
 *   "categories": [
 *     {
 *       "titleEn": "Network & Infrastructure Security",
 *       "titleId": "Keamanan Jaringan & Infrastruktur",
 *       "count": 25,
 *       "icon": "network"
 *     },
 *     {
 *       "titleEn": "Web Security",
 *       "titleId": "Keamanan Web",
 *       "count": 18,
 *       "icon": "web"
 *     },
 *     ... (more categories)
 *   ]
 * }
 * 
 * RESPONSE: 200 OK
 * {
 *   "success": true,
 *   "message": "Categories and heading saved successfully",
 *   "data": {
 *     "heading": { ... },
 *     "categories": [ ... ]
 *   }
 * }
 * 
 * REQUEST: GET /api/cms/members/categories
 * 
 * RESPONSE: 200 OK
 * {
 *   "heading": {
 *     "subtitleEn": "OUR COMMUNITY",
 *     "subtitleId": "KOMUNITAS KAMI",
 *     "titleEn": "ADIGSI Cyber Security Members",
 *     "titleId": "Anggota Cyber Security ADIGSI"
 *   },
 *   "categories": [
 *     {
 *       "titleEn": "Network & Infrastructure Security",
 *       "titleId": "Keamanan Jaringan & Infrastruktur",
 *       "count": 25,
 *       "icon": "network"
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
 *   - titleEn: Required, non-empty string
 *   - titleId: Required, non-empty string
 *   - count: Optional, integer >= 0 (default: 0)
 *   - icon: Optional, string (default: 'network')
 * 
 * ============================================================================
 * ICON OPTIONS
 * ============================================================================
 * 
 * Available icons (28 total):
 * network, web, endpoint, app, mssp, data, mobile, risk, secops, threat,
 * identity, digitalrisk, blockchain, iot, messaging, consulting, fraud,
 * cloud, server, database, firewall, vpn, encryption, malware, virus,
 * monitoring, audit, compliance
 * 
 * ============================================================================
 * DEFAULT VALUES
 * ============================================================================
 * 
 * If no document exists in the database, the API returns default values:
 * 
 * Heading:
 * - subtitleEn: "OUR COMMUNITY"
 * - subtitleId: "KOMUNITAS KAMI"
 * - titleEn: "ADIGSI Cyber Security Members"
 * - titleId: "Anggota Cyber Security ADIGSI"
 * 
 * Categories: 18 default categories with predefined names and member counts
 * 
 * ============================================================================
 */

/**
 * Member Categories Section Data Schema
 * 
 * Database Collection: members_content
 * Document Structure:
 * {
 *   _id: ObjectId,
 *   section: "categories",
 *   heading: {
 *     subtitleEn: string,
 *     subtitleId: string,
 *     titleEn: string,
 *     titleId: string
 *   },
 *   categories: [
 *     {
 *       titleEn: string,
 *       titleId: string,
 *       count: number,
 *       icon: string
 *     },
 *     ...
 *   ],
 *   updatedAt: Date,
 *   createdAt: Date
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any

    // Handle both old (separate heading/categories) and new (combined) formats
    let heading: HeadingData
    let categories: MemberCategory[]

    if (body.heading && body.categories) {
      // New combined format
      heading = body.heading
      categories = body.categories
    } else if (body.categories && !body.heading) {
      // Old format: only categories, fetch existing heading
      const db = await getMongoDatabase()
      const existing = await db.collection('members_content').findOne({ section: 'categories' })
      
      heading = existing?.heading || {
        subtitleEn: 'OUR COMMUNITY',
        subtitleId: 'KOMUNITAS KAMI',
        titleEn: 'ADIGSI Cyber Security Members',
        titleId: 'Anggota Cyber Security ADIGSI',
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
      if (!category.titleEn || !category.titleId) {
        return NextResponse.json(
          { error: 'Each category must have title in both languages' },
          { status: 400 }
        )
      }
    }

    const db = await getMongoDatabase()

    const now = new Date()
    const result = await db.collection('members_content').updateOne(
      { section: 'categories' },
      {
        $set: {
          section: 'categories',
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
      message: 'Categories and heading saved successfully',
      data: { heading, categories },
    })
  } catch (error) {
    console.error('Error saving categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()

    const data = await db.collection('members_content').findOne({ section: 'categories' })

    const defaultHeading: HeadingData = {
      subtitleEn: 'OUR COMMUNITY',
      subtitleId: 'KOMUNITAS KAMI',
      titleEn: 'ADIGSI Cyber Security Members',
      titleId: 'Anggota Cyber Security ADIGSI',
    }

    const defaultCategories: MemberCategory[] = [
      { titleEn: 'Network & Infrastructure Security', titleId: 'Keamanan Jaringan & Infrastruktur', count: 25, icon: 'network' },
      { titleEn: 'Web Security', titleId: 'Keamanan Web', count: 18, icon: 'web' },
      { titleEn: 'End Point Security', titleId: 'Keamanan End Point', count: 22, icon: 'endpoint' },
      { titleEn: 'Application Security', titleId: 'Keamanan Aplikasi', count: 20, icon: 'app' },
      { titleEn: 'MSSP', titleId: 'MSSP', count: 15, icon: 'mssp' },
      { titleEn: 'Data Security', titleId: 'Keamanan Data', count: 28, icon: 'data' },
      { titleEn: 'Mobile Security', titleId: 'Keamanan Mobile', count: 16, icon: 'mobile' },
      { titleEn: 'Risk & Compliance', titleId: 'Risiko & Kepatuhan', count: 12, icon: 'risk' },
      { titleEn: 'Security Ops & Incident Response', titleId: 'Operasi Keamanan & Respon Insiden', count: 19, icon: 'secops' },
      { titleEn: 'Threat Intelligence', titleId: 'Intelijen Ancaman', count: 14, icon: 'threat' },
      { titleEn: 'Identity & Access Management', titleId: 'Manajemen Identitas & Akses', count: 17, icon: 'identity' },
      { titleEn: 'Digital Risk Management', titleId: 'Manajemen Risiko Digital', count: 13, icon: 'digitalrisk' },
      { titleEn: 'Blockchain', titleId: 'Blockchain', count: 10, icon: 'blockchain' },
      { titleEn: 'IoT', titleId: 'IoT', count: 11, icon: 'iot' },
      { titleEn: 'Messaging Security', titleId: 'Keamanan Pesan', count: 9, icon: 'messaging' },
      { titleEn: 'Security Consulting & Service', titleId: 'Konsultasi & Layanan Keamanan', count: 21, icon: 'consulting' },
      { titleEn: 'Fraud & Transaction Security', titleId: 'Keamanan Transaksi & Anti-Fraud', count: 16, icon: 'fraud' },
      { titleEn: 'Cloud Security', titleId: 'Keamanan Cloud', count: 24, icon: 'cloud' },
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
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        heading: {
          subtitleEn: 'OUR COMMUNITY',
          subtitleId: 'KOMUNITAS KAMI',
          titleEn: 'ADIGSI Cyber Security Members',
          titleId: 'Anggota Cyber Security ADIGSI',
        },
        categories: [
          { titleEn: 'Network & Infrastructure Security', titleId: 'Keamanan Jaringan & Infrastruktur', count: 25, icon: 'network' },
          { titleEn: 'Web Security', titleId: 'Keamanan Web', count: 18, icon: 'web' },
          { titleEn: 'End Point Security', titleId: 'Keamanan End Point', count: 22, icon: 'endpoint' },
          { titleEn: 'Application Security', titleId: 'Keamanan Aplikasi', count: 20, icon: 'app' },
          { titleEn: 'MSSP', titleId: 'MSSP', count: 15, icon: 'mssp' },
          { titleEn: 'Data Security', titleId: 'Keamanan Data', count: 28, icon: 'data' },
          { titleEn: 'Mobile Security', titleId: 'Keamanan Mobile', count: 16, icon: 'mobile' },
          { titleEn: 'Risk & Compliance', titleId: 'Risiko & Kepatuhan', count: 12, icon: 'risk' },
          { titleEn: 'Security Ops & Incident Response', titleId: 'Operasi Keamanan & Respon Insiden', count: 19, icon: 'secops' },
          { titleEn: 'Threat Intelligence', titleId: 'Intelijen Ancaman', count: 14, icon: 'threat' },
          { titleEn: 'Identity & Access Management', titleId: 'Manajemen Identitas & Akses', count: 17, icon: 'identity' },
          { titleEn: 'Digital Risk Management', titleId: 'Manajemen Risiko Digital', count: 13, icon: 'digitalrisk' },
          { titleEn: 'Blockchain', titleId: 'Blockchain', count: 10, icon: 'blockchain' },
          { titleEn: 'IoT', titleId: 'IoT', count: 11, icon: 'iot' },
          { titleEn: 'Messaging Security', titleId: 'Keamanan Pesan', count: 9, icon: 'messaging' },
          { titleEn: 'Security Consulting & Service', titleId: 'Konsultasi & Layanan Keamanan', count: 21, icon: 'consulting' },
          { titleEn: 'Fraud & Transaction Security', titleId: 'Keamanan Transaksi & Anti-Fraud', count: 16, icon: 'fraud' },
          { titleEn: 'Cloud Security', titleId: 'Keamanan Cloud', count: 24, icon: 'cloud' },
        ],
      },
      { status: 200 }
    )
  }
}
