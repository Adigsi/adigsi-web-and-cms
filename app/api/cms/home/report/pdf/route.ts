import { NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('home_content')
    
    const data = await collection.findOne({ section: 'report' })
    
    if (data && data.report && data.report.pdfFile) {
      return NextResponse.json({ pdfFile: data.report.pdfFile })
    }

    return NextResponse.json({ pdfFile: '' })
  } catch (error) {
    console.error('Error fetching PDF:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PDF file' },
      { status: 500 }
    )
  }
}
