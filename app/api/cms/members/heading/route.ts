import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

interface HeadingData {
  subtitleEn: string
  subtitleId: string
  titleEn: string
  titleId: string
}

export async function POST(request: NextRequest) {
  try {
    const { subtitleEn, subtitleId, titleEn, titleId } = await request.json() as HeadingData

    if (!subtitleEn || !subtitleId || !titleEn || !titleId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()

    const result = await db.collection('members_content').updateOne(
      { section: 'heading' },
      {
        $set: {
          section: 'heading',
          subtitleEn,
          subtitleId,
          titleEn,
          titleId,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Heading saved successfully',
      data: { subtitleEn, subtitleId, titleEn, titleId },
    })
  } catch (error) {
    console.error('Error saving heading:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()

    const data = await db.collection('members_content').findOne({ section: 'heading' })

    if (!data) {
      return NextResponse.json({
        subtitleEn: 'OUR COMMUNITY',
        subtitleId: 'KOMUNITAS KAMI',
        titleEn: 'ADIGSI Cyber Security Members',
        titleId: 'Anggota Cyber Security ADIGSI',
      })
    }

    return NextResponse.json({
      subtitleEn: data.subtitleEn,
      subtitleId: data.subtitleId,
      titleEn: data.titleEn,
      titleId: data.titleId,
    })
  } catch (error) {
    console.error('Error fetching heading:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
