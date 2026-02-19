import { getMongoDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('about_content')

    const data = await collection.findOne({ section: 'organization' })

    if (!data) {
      return NextResponse.json({
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
    const { groups } = body

    // Validate required fields
    if (!groups || !Array.isArray(groups)) {
      return NextResponse.json({ error: 'Groups array is required' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('about_content')

    // Upsert the organization data
    const result = await collection.updateOne(
      { section: 'organization' },
      {
        $set: {
          section: 'organization',
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
