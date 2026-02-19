import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface EventData {
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  image: string
  registerLink: string
  published: boolean
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = 12
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const published = searchParams.get('published') || ''

    const db = await getMongoDatabase()
    const collection = db.collection('events_content')

    const skip = (page - 1) * limit

    // Build filter query
    const filter: any = { section: 'event' }
    
    // Add search filter (search in title EN and ID)
    if (search) {
      filter.$or = [
        { titleEn: { $regex: search, $options: 'i' } },
        { titleId: { $regex: search, $options: 'i' } },
      ]
    }
    
    // Add category filter
    if (category) {
      filter.$and = filter.$and || []
      filter.$and.push({
        $or: [
          { categoryEn: { $regex: category, $options: 'i' } },
          { categoryId: { $regex: category, $options: 'i' } },
        ]
      })
    }
    
    // Add published filter
    if (published) {
      filter.published = published === 'true'
    }

    const [events, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: events.map((event) => ({
        _id: event._id?.toString(),
        titleEn: event.titleEn,
        titleId: event.titleId,
        categoryEn: event.categoryEn,
        categoryId: event.categoryId,
        image: event.image,
        registerLink: event.registerLink,
        published: event.published ?? true,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: EventData & { _id?: string } = await request.json()

    // Validation
    if (!data.titleEn || !data.titleId || !data.image || !data.categoryEn || !data.categoryId || !data.registerLink) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('events_content')

    if (data._id) {
      // Update existing event
      const result = await collection.updateOne(
        { _id: new ObjectId(data._id), section: 'event' },
        {
          $set: {
            titleEn: data.titleEn,
            titleId: data.titleId,
            categoryEn: data.categoryEn,
            categoryId: data.categoryId,
            image: data.image,
            registerLink: data.registerLink,
            published: data.published,
            updatedAt: new Date(),
          },
        }
      )

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, message: 'Event updated successfully' })
    } else {
      // Create new event
      const result = await collection.insertOne({
        section: 'event',
        titleEn: data.titleEn,
        titleId: data.titleId,
        categoryEn: data.categoryEn,
        categoryId: data.categoryId,
        image: data.image,
        registerLink: data.registerLink,
        published: data.published ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return NextResponse.json({
        success: true,
        message: 'Event created successfully',
        id: result.insertedId.toString(),
      })
    }
  } catch (error) {
    console.error('Error saving event:', error)
    return NextResponse.json(
      { error: 'Failed to save event' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('events_content')

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      section: 'event',
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const body = await request.json()
    const { published } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    if (typeof published !== 'boolean') {
      return NextResponse.json(
        { error: 'Published status is required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('events_content')

    const result = await collection.updateOne(
      { _id: new ObjectId(id), section: 'event' },
      {
        $set: {
          published,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Event status updated successfully' })
  } catch (error) {
    console.error('Error updating event status:', error)
    return NextResponse.json(
      { error: 'Failed to update event status' },
      { status: 500 }
    )
  }
}
