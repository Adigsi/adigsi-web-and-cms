import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface NewsData {
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  contentEn: string
  contentId: string
  image: string
  readTimeEn: string
  readTimeId: string
  sourceUrl?: string
  published: boolean
  slug?: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function ensureUniqueSlug(baseSlug: string, collection: any): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const existing = await collection.findOne({ slug, section: 'news' })
    if (!existing) {
      return slug
    }
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 12
    const skip = (page - 1) * limit

    const db = await getMongoDatabase()
    const collection = db.collection('news_content')

    const news = await collection
      .find({ section: 'news' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await collection.countDocuments({ section: 'news' })

    return NextResponse.json({
      success: true,
      data: news.map((item) => ({
        _id: item._id.toString(),
        slug: item.slug,
        titleEn: item.titleEn,
        titleId: item.titleId,
        categoryEn: item.categoryEn,
        categoryId: item.categoryId,
        contentEn: item.contentEn,
        contentId: item.contentId,
        image: item.image,
        readTimeEn: item.readTimeEn,
        readTimeId: item.readTimeId,
        sourceUrl: item.sourceUrl,
        published: item.published,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: NewsData & { _id?: string } = await request.json()
    const { _id, titleEn, titleId, categoryEn, categoryId, contentEn, contentId, image, readTimeEn, readTimeId, sourceUrl, published } = data

    if (!titleEn || !titleId || !categoryEn || !categoryId || !contentEn || !contentId || !image || !readTimeEn || !readTimeId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('news_content')

    if (_id) {
      // Update existing news (slug is NOT updated)
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            titleEn,
            titleId,
            categoryEn,
            categoryId,
            contentEn,
            contentId,
            image,
            readTimeEn,
            readTimeId,
            sourceUrl,
            published,
            updatedAt: new Date(),
          },
        }
      )
    } else {
      // Create new news - generate slug from titleEn
      const baseSlug = generateSlug(titleEn)
      const uniqueSlug = await ensureUniqueSlug(baseSlug, collection)
      
      await collection.insertOne({
        section: 'news',
        slug: uniqueSlug,
        titleEn,
        titleId,
        categoryEn,
        categoryId,
        contentEn,
        contentId,
        image,
        readTimeEn,
        readTimeId,
        sourceUrl,
        published,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({
      success: true,
      message: _id ? 'News updated successfully' : 'News created successfully',
    })
  } catch (error) {
    console.error('Error saving news:', error)
    return NextResponse.json(
      { error: 'Failed to save news' },
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
        { error: 'News ID is required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('news_content')

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      section: 'news',
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      )
    }

    const { published } = await request.json()

    const db = await getMongoDatabase()
    const collection = db.collection('news_content')

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          published,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: 'News status updated successfully',
    })
  } catch (error) {
    console.error('Error updating news status:', error)
    return NextResponse.json(
      { error: 'Failed to update news status' },
      { status: 500 }
    )
  }
}
