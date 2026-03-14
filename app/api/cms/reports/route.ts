import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getMediaUrlValidationError } from '@/lib/upload/validate-media-payload'

interface ReportData {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  cover: string
  tags: string[]
  pdfFile: string
  published: boolean
  pinned: boolean
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const search = searchParams.get('search') || ''
    const publishedFilter = searchParams.get('published') || ''
    const pinnedFilter = searchParams.get('pinned') || ''

    const db = await getMongoDatabase()
    const collection = db.collection('reports')
    const skip = (page - 1) * limit

    const filter: Record<string, unknown> = {}

    if (search) {
      filter.$or = [
        { titleEn: { $regex: search, $options: 'i' } },
        { titleId: { $regex: search, $options: 'i' } },
      ]
    }

    if (publishedFilter) {
      filter.published = publishedFilter === 'true'
    }

    if (pinnedFilter) {
      filter.pinned = pinnedFilter === 'true'
    }

    const tagFilter = searchParams.get('tag') || ''
    if (tagFilter) {
      filter.tags = tagFilter
    }

    const [reports, total] = await Promise.all([
      collection
        .find(filter)
        .project({ pdfFile: 0 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ])

    const reportsWithId = reports.map((r) => ({
      ...r,
      _id: r._id.toString(),
      hasPdf: true, // pdfFile is projected out; assume stored
    }))

    return NextResponse.json({
      success: true,
      data: reportsWithId,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ReportData = await request.json()
    const { titleEn, titleId, descriptionEn, descriptionId, cover, tags, pdfFile, published } =
      body

    if (!titleEn || !titleId) {
      return NextResponse.json({ error: 'Title (EN and ID) is required' }, { status: 400 })
    }

    // Validate media fields (URL-only, no base64)
    if (cover) {
      const coverError = getMediaUrlValidationError(cover, 'cover')
      if (coverError) {
        return NextResponse.json({ error: coverError }, { status: 400 })
      }
    }

    if (pdfFile) {
      const pdfError = getMediaUrlValidationError(pdfFile, 'pdfFile')
      if (pdfError) {
        return NextResponse.json({ error: pdfError }, { status: 400 })
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('reports')

    const now = new Date()
    const result = await collection.insertOne({
      titleEn,
      titleId,
      descriptionEn: descriptionEn || '',
      descriptionId: descriptionId || '',
      cover: cover || '',
      tags: Array.isArray(tags) ? tags : [],
      pdfFile: pdfFile || '',
      published: published ?? false,
      pinned: false,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({ success: true, _id: result.insertedId.toString() })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Valid report ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const db = await getMongoDatabase()
    const collection = db.collection('reports')

    // If pinning this report, unpin all others first
    if (body.pinned === true) {
      await collection.updateMany({ pinned: true }, { $set: { pinned: false } })
    }

    const updateFields: Record<string, unknown> = { updatedAt: new Date() }
    const allowed = [
      'titleEn', 'titleId', 'descriptionEn', 'descriptionId',
      'cover', 'tags', 'pdfFile', 'published', 'pinned',
    ] as const

    for (const key of allowed) {
      if (key in body) {
        // Validate media fields if present
        if (key === 'cover' && body[key]) {
          const coverError = getMediaUrlValidationError(body[key], 'cover')
          if (coverError) {
            return NextResponse.json({ error: coverError }, { status: 400 })
          }
        }
        if (key === 'pdfFile' && body[key]) {
          const pdfError = getMediaUrlValidationError(body[key], 'pdfFile')
          if (pdfError) {
            return NextResponse.json({ error: pdfError }, { status: 400 })
          }
        }
        updateFields[key] = body[key]
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Valid report ID is required' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('reports')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 })
  }
}
