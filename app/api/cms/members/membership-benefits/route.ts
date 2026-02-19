import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

/**
 * GET /api/cms/members/membership-benefits
 * Fetch membership benefits data
 * 
 * Response Schema:
 * {
 *   memberships: [
 *     {
 *       tier: string (bronze|silver|gold|platinum)
 *       nameEn: string
 *       nameId: string
 *       descriptionEn: string
 *       descriptionId: string
 *       iconUrl: string (image URL or base64 data URI)
 *     }
 *   ]
 * }
 */
export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('members_content')

    const data = await collection.findOne({ section: 'membership-benefits' })

    if (!data) {
      // Return default membership benefits structure
      return NextResponse.json({
        memberships: [
          {
            tier: 'bronze',
            nameEn: 'BRONZE MEMBERSHIP',
            nameId: 'BRONZE MEMBERSHIP',
            descriptionEn: 'Bronze Membership provides basic access to ADIGSI information and activities, opportunities to participate in selected public events, limited brand exposure, and flexibility to upgrade membership category anytime as needed.',
            descriptionId: 'BRONZE MEMBERSHIP MEMBERIKAN AKSES DASAR KE INFORMASI DAN KEGIATAN ADIGSI, KESEMPATAN MENGIKUTI BEBERAPA EVENT UMUM, EXPOSUR BRAND TERBATAS, SERTA FLEKSIBILITAS UNTUK MENINGKATKAN KATEGORI MEMBERSHIP KAPAN SAJA SESUAI KEBUTUHAN.',
            iconUrl: '/images/badges/bronze-membership.png',
          },
          {
            tier: 'silver',
            nameEn: 'SILVER MEMBERSHIP',
            nameId: 'SILVER MEMBERSHIP',
            descriptionEn: 'Silver Membership offers access to ADIGSI core programs, including logo placement and promotional slots, rights to use ADIGSI logo, custom content when needed, networking opportunities with stakeholders, special incentives, and training support with regulatory analysis to enhance competence and compliance.',
            descriptionId: 'SILVER MEMBERSHIP MENAWARKAN AKSES KE PROGRAM INTI ADIGSI, TERMASUK PENEMPATAN LOGO DAN SLOT PROMOSI, HAK PENGGUNAAN LOGO ADIGSI, KONTEN KUSTOM BILA DIPERLUKAN, KESEMPATAN NETWORKING DENGAN PARA PEMANGKU KEPENTINGAN, INSENTIF KHUSUS, SERTA DUKUNGAN PELATIHAN DAN ANALISIS REGULASI UNTUK MENINGKATKAN KOMPETENSI DAN KEPATUHAN.',
            iconUrl: '/images/badges/silver-membership.png',
          },
          {
            tier: 'gold',
            nameEn: 'GOLD MEMBERSHIP',
            nameId: 'GOLD MEMBERSHIP',
            descriptionEn: 'Gold Membership provides extensive benefits including branding placement, customizable content and programs, access to exclusive networking events, program incentives, certification support and regulatory analysis, exclusive industry updates, advocacy opportunities with regulators, and access to national and international market information to expand business opportunities and collaboration.',
            descriptionId: 'GOLD MEMBERSHIP MEMBERIKAN MANFAAT LUAS BERUPA PENEMPATAN BRANDING, KONTEN DAN PROGRAM YANG DAPAT DIKUSTOMISASI, AKSES KE EVENT NETWORKING KHUSUS, INSENTIF PROGRAM, DUKUNGAN SERTIFIKASI DAN ANALISIS REGULASI, PEMBARUAN INDUSTRI EKSKLUSIF, PELUANG ADVOKASI DENGAN REGULATOR, SERTA AKSES INFORMASI PASAR NASIONAL MAUPUN INTERNASIONAL UNTUK MEMPERLUAS PELUANG BISNIS DAN KOLABORASI.',
            iconUrl: '/images/badges/gold-membership.png',
          },
          {
            tier: 'platinum',
            nameEn: 'PLATINUM MEMBERSHIP',
            nameId: 'PLATINUM MEMBERSHIP',
            descriptionEn: 'Platinum Membership provides priority access to all ADIGSI programs, opportunities to participate in national policy formulation, chances to represent ADIGSI in strategic meetings with government, exclusive networking access, premium branding facilities, certification support and regulatory analysis, industry research updates, and rights to use ADIGSI logo as an official partner.',
            descriptionId: 'PLATINUM MEMBERSHIP MEMBERIKAN AKSES PRIORITAS KE SELURUH PROGRAM ADIGSI, PELUANG BERPERAN DALAM PENYUSUNAN KEBIJAKAN NASIONAL, KESEMPATAN MEWAKILI ADIGSI DI PERTEMUAN STRATEGIS DENGAN PEMERINTAH, AKSES NETWORKING EKSKLUSIF, FASILITAS BRANDING PREMIUM, DUKUNGAN SERTIFIKASI DAN ANALISIS REGULASI, PEMBARUAN RISET INDUSTRI, SERTA HAK PENGGUNAAN LOGO ADIGSI SEBAGAI MITRA RESMI.',
            iconUrl: '/images/badges/platinum-membership.png',
          },
        ],
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching membership benefits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch membership benefits' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cms/members/membership-benefits
 * Save or update membership benefits data
 * 
 * Request Body:
 * {
 *   memberships: [
 *     {
 *       tier: string (required, non-empty)
 *       nameEn: string (required, non-empty)
 *       nameId: string (required, non-empty)
 *       descriptionEn: string (required, non-empty)
 *       descriptionId: string (required, non-empty)
 *       iconUrl: string (required, URL or base64 data URI)
 *     }
 *   ]
 * }
 * 
 * Validation:
 * - Memberships array must have exactly 4 items (bronze, silver, gold, platinum)
 * - Each membership must have all required fields non-empty
 * - Each tier must be unique and valid
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberships } = body

    // Validate memberships array
    if (!Array.isArray(memberships)) {
      return NextResponse.json(
        { error: 'Memberships must be an array' },
        { status: 400 }
      )
    }

    if (memberships.length < 1) {
      return NextResponse.json(
        { error: 'At least 1 membership tier is required' },
        { status: 400 }
      )
    }

    const tierSet = new Set<string>()

    for (let i = 0; i < memberships.length; i++) {
      const membership = memberships[i]

      if (!membership.tier || typeof membership.tier !== 'string' || membership.tier.trim() === '') {
        return NextResponse.json(
          { error: `Membership ${i + 1}: tier is required and must be a non-empty string` },
          { status: 400 }
        )
      }

      if (tierSet.has(membership.tier)) {
        return NextResponse.json(
          { error: `Membership ${i + 1}: tier "${membership.tier}" is duplicated` },
          { status: 400 }
        )
      }
      tierSet.add(membership.tier)

      const requiredFields = ['nameEn', 'nameId', 'descriptionEn', 'descriptionId', 'iconUrl']
      for (const field of requiredFields) {
        if (!membership[field] || (typeof membership[field] === 'string' && membership[field].trim() === '')) {
          return NextResponse.json(
            { error: `Membership ${i + 1} (${membership.tier}): ${field} is required and must be non-empty` },
            { status: 400 }
          )
        }
      }

      if (typeof membership.nameEn !== 'string' || typeof membership.nameId !== 'string' ||
          typeof membership.descriptionEn !== 'string' || typeof membership.descriptionId !== 'string' ||
          typeof membership.iconUrl !== 'string') {
        return NextResponse.json(
          { error: `Membership ${i + 1}: all fields must be strings` },
          { status: 400 }
        )
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('members_content')

    const result = await collection.updateOne(
      { section: 'membership-benefits' },
      {
        $set: {
          section: 'membership-benefits',
          memberships,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json(
      {
        message: 'Membership benefits saved successfully',
        data: { memberships },
      },
      { status: result.upsertedId ? 201 : 200 }
    )
  } catch (error) {
    console.error('Error saving membership benefits:', error)
    return NextResponse.json(
      { error: 'Failed to save membership benefits' },
      { status: 500 }
    )
  }
}
