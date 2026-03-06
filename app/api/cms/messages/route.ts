import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'new'|'need_to_answer'|'answered'|'archived'|''
    const isRead = searchParams.get('isRead') // 'true'|'false'|''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const db = await getMongoDatabase()
    const collection = db.collection('messages')

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {}
    if (status) filter.status = status
    if (isRead === 'true') filter.isRead = true
    if (isRead === 'false') filter.isRead = false

    const [messages, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ])

    return NextResponse.json({
      messages: messages.map((m) => ({ ...m, _id: m._id.toString() })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullname, email, company, position, message } = body

    if (!fullname?.trim()) return NextResponse.json({ error: 'fullname is required' }, { status: 400 })
    if (!email?.trim()) return NextResponse.json({ error: 'email is required' }, { status: 400 })
    if (!company?.trim()) return NextResponse.json({ error: 'company is required' }, { status: 400 })
    if (!position?.trim()) return NextResponse.json({ error: 'position is required' }, { status: 400 })
    if (!message?.trim()) return NextResponse.json({ error: 'message is required' }, { status: 400 })

    const db = await getMongoDatabase()
    const collection = db.collection('messages')

    const doc = {
      fullname: fullname.trim(),
      email: email.trim(),
      company: company.trim(),
      position: position.trim(),
      message: message.trim(),
      isRead: false,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(doc)

    return NextResponse.json(
      { message: 'Message sent successfully', id: result.insertedId.toString() },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
