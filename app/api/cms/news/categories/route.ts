import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface CategoryData {
  nameEn: string
  nameId: string
}

export async function GET(request: NextRequest) {
  try {
    const activeOnly = request.nextUrl.searchParams.get('active') === 'true'

    const db = await getMongoDatabase()
    const collection = db.collection('news_categories')

    const filter = activeOnly ? { active: true } : {}

    const categories = await collection
      .find(filter)
      .sort({ nameEn: 1 })
      .toArray()

    return NextResponse.json({
      success: true,
      categories: categories.map((cat) => ({
        _id: cat._id?.toString(),
        nameEn: cat.nameEn,
        nameId: cat.nameId,
        active: cat.active ?? true,
      })),
    })
  } catch (error) {
    console.error('Error fetching news categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CategoryData = await request.json()

    if (!data.nameEn || !data.nameId) {
      return NextResponse.json(
        { error: 'Category name in English and Indonesian are required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('news_categories')

    const result = await collection.insertOne({
      nameEn: data.nameEn.trim(),
      nameId: data.nameId.trim(),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      _id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const data: CategoryData = await request.json()

    if (!data.nameEn || !data.nameId) {
      return NextResponse.json(
        { error: 'Category name in English and Indonesian are required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('news_categories')

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          nameEn: data.nameEn.trim(),
          nameId: data.nameId.trim(),
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    if (typeof body.active !== 'boolean') {
      return NextResponse.json(
        { error: 'active (boolean) is required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('news_categories')

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { active: body.active, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Category ${body.active ? 'activated' : 'deactivated'} successfully`,
    })
  } catch (error) {
    console.error('Error toggling category status:', error)
    return NextResponse.json(
      { error: 'Failed to update category status' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const collection = db.collection('news_categories')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
