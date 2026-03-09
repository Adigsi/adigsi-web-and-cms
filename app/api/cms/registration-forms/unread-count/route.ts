import { NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('registration_forms')
    const count = await collection.countDocuments({ isRead: false })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching registration forms unread count:', error)
    return NextResponse.json({ count: 0 })
  }
}
