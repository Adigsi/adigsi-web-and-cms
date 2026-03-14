import { getMongoDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { getMediaUrlValidationError } from '@/lib/upload/validate-media-payload'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('about_content')

    const data = await collection.findOne({ section: 'organization' })

    if (!data) {
      return NextResponse.json({
        headingSubtitleEn: 'Organization',
        headingSubtitleId: 'Organisasi',
        headingTitleEn: 'Organization Structure',
        headingTitleId: 'Struktur Organisasi',
        showSubtitle: true,
        groups: [
          {
            titleEn: '',
            titleId: '',
            members: [
              {
                name: '',
                positionEn: '',
                positionId: '',
                imageUrl: ''
              }
            ]
          }
        ]
      })
    }

    return NextResponse.json({
      headingSubtitleEn: data.headingSubtitleEn || 'Organization',
      headingSubtitleId: data.headingSubtitleId || 'Organisasi',
      headingTitleEn: data.headingTitleEn || 'Organization Structure',
      headingTitleId: data.headingTitleId || 'Struktur Organisasi',
      showSubtitle: data.showSubtitle ?? true,
      groups: data.groups || []
    })
  } catch (error) {
    console.error('Error fetching organization data:', error)
    return NextResponse.json({ error: 'Failed to fetch organization data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { headingSubtitleEn, headingSubtitleId, headingTitleEn, headingTitleId, showSubtitle, groups } = body

    // Validate required fields
    if (!groups || !Array.isArray(groups)) {
      return NextResponse.json({ error: 'Groups array is required' }, { status: 400 })
    }

    // Validate media URLs in member images
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      const group = groups[groupIndex]
      if (!group.members || !Array.isArray(group.members)) {
        return NextResponse.json({ error: `Group ${groupIndex + 1}: members must be an array` }, { status: 400 })
      }
      for (let memberIndex = 0; memberIndex < group.members.length; memberIndex++) {
        const member = group.members[memberIndex]
        if (member.imageUrl) {
          const imageError = getMediaUrlValidationError(member.imageUrl, `groups[${groupIndex}].members[${memberIndex}].imageUrl`)
          if (imageError) {
            return NextResponse.json({ error: imageError }, { status: 400 })
          }
        }
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('about_content')

    // Upsert the organization data
    const result = await collection.updateOne(
      { section: 'organization' },
      {
        $set: {
          section: 'organization',
          headingSubtitleEn: headingSubtitleEn || 'Organization',
          headingSubtitleId: headingSubtitleId || 'Organisasi',
          headingTitleEn: headingTitleEn || 'Organization Structure',
          headingTitleId: headingTitleId || 'Struktur Organisasi',
          showSubtitle: showSubtitle ?? true,
          groups,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Organization data saved successfully',
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId
    })
  } catch (error) {
    console.error('Error saving organization data:', error)
    return NextResponse.json({ error: 'Failed to save organization data' }, { status: 500 })
  }
}
