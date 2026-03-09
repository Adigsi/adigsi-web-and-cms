import { NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('reports')

    const report = await collection.findOne({ pinned: true, published: true })

    if (!report) {
      return NextResponse.json({ pinned: false })
    }

    const hasPdf = typeof report.pdfFile === 'string' && report.pdfFile.length > 0

    return NextResponse.json({
      pinned: true,
      _id: report._id.toString(),
      titleEn: report.titleEn,
      titleId: report.titleId,
      descriptionEn: report.descriptionEn,
      descriptionId: report.descriptionId,
      cover: report.cover,
      tags: report.tags || [],
      hasPdf,
    })
  } catch (error) {
    console.error('Error fetching pinned report:', error)
    return NextResponse.json({ error: 'Failed to fetch pinned report' }, { status: 500 })
  }
}
