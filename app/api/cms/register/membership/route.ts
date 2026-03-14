import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

interface Category {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  iconUrl: string
}

interface MembershipData {
  headerSubtitleEn?: string
  headerSubtitleId?: string
  headerTitleEn?: string
  headerTitleId?: string
  showSubtitle?: boolean
  sectionTitleEn: string
  sectionTitleId: string
  sectionDescriptionEn: string
  sectionDescriptionId: string
  categories: Category[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      headerSubtitleEn,
      headerSubtitleId,
      headerTitleEn,
      headerTitleId,
      showSubtitle,
      sectionTitleEn,
      sectionTitleId,
      sectionDescriptionEn,
      sectionDescriptionId,
      categories,
    } = body

    // Validate required fields
    if (!sectionTitleEn || !sectionTitleId) {
      return NextResponse.json(
        { error: 'Section title in both languages is required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category is required' },
        { status: 400 }
      )
    }

    // Validate each category
    for (const category of categories) {
      if (!category.titleEn || !category.titleId) {
        return NextResponse.json(
          { error: 'Title in both languages is required for each category' },
          { status: 400 }
        )
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('register_content')

    // Update or insert membership data
    const result = await collection.updateOne(
      { section: 'membership' },
      {
        $set: {
          headerSubtitleEn: headerSubtitleEn || sectionTitleEn || 'CATEGORY',
          headerSubtitleId: headerSubtitleId || sectionTitleId || 'KATEGORI',
          headerTitleEn: headerTitleEn || 'Membership Category',
          headerTitleId: headerTitleId || 'Kategori Keanggotaan',
          showSubtitle: showSubtitle ?? true,
          sectionTitleEn,
          sectionTitleId,
          sectionDescriptionEn: sectionDescriptionEn || '',
          sectionDescriptionId: sectionDescriptionId || '',
          categories,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Membership categories updated successfully',
      data: {
        headerSubtitleEn: headerSubtitleEn || sectionTitleEn || 'CATEGORY',
        headerSubtitleId: headerSubtitleId || sectionTitleId || 'KATEGORI',
        headerTitleEn: headerTitleEn || 'Membership Category',
        headerTitleId: headerTitleId || 'Kategori Keanggotaan',
        showSubtitle: showSubtitle ?? true,
        sectionTitleEn,
        sectionTitleId,
        sectionDescriptionEn,
        sectionDescriptionId,
        categories,
      },
    })
  } catch (error) {
    console.error('Error updating membership:', error)
    return NextResponse.json(
      { error: 'Failed to update membership' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('register_content')

    const membership = await collection.findOne({ section: 'membership' })

    if (!membership) {
      return NextResponse.json({
        sectionTitleEn: '',
        sectionTitleId: '',
        sectionDescriptionEn: '',
        sectionDescriptionId: '',
        categories: [],
      })
    }

    return NextResponse.json({
      headerSubtitleEn: membership.headerSubtitleEn || membership.sectionTitleEn || 'CATEGORY',
      headerSubtitleId: membership.headerSubtitleId || membership.sectionTitleId || 'KATEGORI',
      headerTitleEn: membership.headerTitleEn || 'Membership Category',
      headerTitleId: membership.headerTitleId || 'Kategori Keanggotaan',
      showSubtitle: membership.showSubtitle ?? true,
      sectionTitleEn: membership.sectionTitleEn || '',
      sectionTitleId: membership.sectionTitleId || '',
      sectionDescriptionEn: membership.sectionDescriptionEn || '',
      sectionDescriptionId: membership.sectionDescriptionId || '',
      categories: membership.categories || [],
    })
  } catch (error) {
    console.error('Error fetching membership:', error)
    return NextResponse.json(
      { error: 'Failed to fetch membership' },
      { status: 500 }
    )
  }
}
