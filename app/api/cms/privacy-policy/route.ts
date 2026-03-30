import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bannerTitleEn, bannerTitleId, contentEn, contentId } = body

    if (!bannerTitleEn || !bannerTitleId) {
      return NextResponse.json(
        { error: 'Banner title in both languages is required' },
        { status: 400 },
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('legal_content')

    await collection.updateOne(
      { section: 'privacy_policy' },
      {
        $set: {
          bannerTitleEn,
          bannerTitleId,
          contentEn: contentEn || '',
          contentId: contentId || '',
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({
      success: true,
      message: 'Privacy Policy updated successfully',
    })
  } catch (error) {
    console.error('Error updating privacy-policy:', error)
    return NextResponse.json(
      { error: 'Failed to update Privacy Policy' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('legal_content')

    const doc = await collection.findOne({ section: 'privacy_policy' })

    return NextResponse.json({
      bannerTitleEn: doc?.bannerTitleEn || 'Privacy Policy',
      bannerTitleId: doc?.bannerTitleId || 'Kebijakan Privasi',
      contentEn: doc?.contentEn || '',
      contentId: doc?.contentId || '',
    })
  } catch (error) {
    console.error('Error fetching privacy-policy:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Privacy Policy' },
      { status: 500 },
    )
  }
}
