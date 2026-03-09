import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

const DEFAULT_BANNER = {
  titleEn: 'Knowledge Hub',
  titleId: 'Pusat Pengetahuan',
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('knowledge_hub_content')
    const data = await collection.findOne({ section: 'banner' })

    if (data) {
      return NextResponse.json({
        titleEn: data.titleEn || DEFAULT_BANNER.titleEn,
        titleId: data.titleId || DEFAULT_BANNER.titleId,
      })
    }

    return NextResponse.json(DEFAULT_BANNER)
  } catch (error) {
    console.error('Error fetching knowledge hub banner:', error)
    return NextResponse.json({ error: 'Failed to fetch banner' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { titleEn, titleId } = await request.json()

    if (!titleEn || !titleId) {
      return NextResponse.json({ error: 'Title (EN and ID) is required' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('knowledge_hub_content')

    await collection.updateOne(
      { section: 'banner' },
      { $set: { section: 'banner', titleEn, titleId, updatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving knowledge hub banner:', error)
    return NextResponse.json({ error: 'Failed to save banner' }, { status: 500 })
  }
}
