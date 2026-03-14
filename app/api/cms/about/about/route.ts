import { getMongoDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('about_content')

    const data = await collection.findOne({ section: 'about' })

    if (!data) {
      return NextResponse.json({
        subtitleEn: 'About ADIGSI',
        subtitleId: 'Tentang ADIGSI',
        showSubtitle: true,
        titleEn: '',
        titleId: '',
        descriptionEn: '',
        descriptionId: '',
        visionEn: '',
        visionId: '',
        missions: [
          { en: '', id: '' }
        ]
      })
    }

    return NextResponse.json({
      subtitleEn: data.subtitleEn || 'About ADIGSI',
      subtitleId: data.subtitleId || 'Tentang ADIGSI',
      showSubtitle: data.showSubtitle ?? true,
      titleEn: data.titleEn || '',
      titleId: data.titleId || '',
      descriptionEn: data.descriptionEn || '',
      descriptionId: data.descriptionId || '',
      visionEn: data.visionEn || '',
      visionId: data.visionId || '',
      missions: data.missions || [{ en: '', id: '' }]
    })
  } catch (error) {
    console.error('Error fetching about data:', error)
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      subtitleEn,
      subtitleId,
      showSubtitle,
      titleEn,
      titleId,
      descriptionEn,
      descriptionId,
      visionEn,
      visionId,
      missions,
    } = body

    // Validate required fields
    if (!titleEn || !titleId || !descriptionEn || !descriptionId || !visionEn || !visionId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('about_content')

    // Upsert the about data
    const result = await collection.updateOne(
      { section: 'about' },
      {
        $set: {
          section: 'about',
          subtitleEn: subtitleEn || 'About ADIGSI',
          subtitleId: subtitleId || 'Tentang ADIGSI',
          showSubtitle: showSubtitle ?? true,
          titleEn,
          titleId,
          descriptionEn,
          descriptionId,
          visionEn,
          visionId,
          missions: missions || [],
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'About data saved successfully',
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId
    })
  } catch (error) {
    console.error('Error saving about data:', error)
    return NextResponse.json({ error: 'Failed to save about data' }, { status: 500 })
  }
}
