import { NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('events_content')

    // Get unique categories from both English and Indonesian
    const eventsData = await collection
      .find({ section: 'event' })
      .project({ categoryEn: 1, categoryId: 1 })
      .toArray()

    // Extract unique categories
    const categoriesSet = new Set<string>()
    
    eventsData.forEach((item) => {
      if (item.categoryEn && item.categoryEn.trim()) {
        categoriesSet.add(item.categoryEn.trim())
      }
      if (item.categoryId && item.categoryId.trim()) {
        categoriesSet.add(item.categoryId.trim())
      }
    })

    // Convert to sorted array
    const categories = Array.from(categoriesSet).sort()

    return NextResponse.json({
      success: true,
      categories,
    })
  } catch (error) {
    console.error('Error fetching event categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
