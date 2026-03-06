import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

const DEFAULT_DATA = {
  joinButton: {
    textEn: 'Join Now',
    textId: 'Daftar',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLScG1BWquhT9vpcgMfHeJy0ummlZOQXhUAxtYXxSmkNTdUDr6g/viewform',
    icon: 'network',
  },
  contactButton: {
    email: 'info@adigsi.id',
    whatsapp: 'https://wa.me/62',
  },
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('home_content')

    const data = await collection.findOne({ section: 'floating-buttons' })

    if (data && data.floatingButtons) {
      return NextResponse.json(data.floatingButtons)
    }

    return NextResponse.json(DEFAULT_DATA)
  } catch (error) {
    console.error('Error fetching floating buttons config:', error)
    return NextResponse.json(DEFAULT_DATA)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { joinButton, contactButton } = body

    if (!joinButton || typeof joinButton !== 'object') {
      return NextResponse.json({ error: 'joinButton is required' }, { status: 400 })
    }
    if (!contactButton || typeof contactButton !== 'object') {
      return NextResponse.json({ error: 'contactButton is required' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('home_content')

    await collection.updateOne(
      { section: 'floating-buttons' },
      {
        $set: {
          section: 'floating-buttons',
          floatingButtons: { joinButton, contactButton },
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ message: 'Floating buttons saved successfully' })
  } catch (error) {
    console.error('Error saving floating buttons config:', error)
    return NextResponse.json({ error: 'Failed to save floating buttons' }, { status: 500 })
  }
}
