import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

interface ReportData {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  buttonTextEn: string
  buttonTextId: string
  pdfFile: string
  image: string
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('home_content')
    
    const data = await collection.findOne({ section: 'report' })
    
    console.log('📦 DB query result:', data)
    
    if (data && data.report) {
      console.log('✅ Returning existing data:', data.report)
      return NextResponse.json(data.report)
    }

    // Return default data if not found
    const defaultData = {
      titleEn: 'Indonesia Cybersecurity Industry Report',
      titleId: 'Laporan Industri Keamanan Siber Indonesia',
      descriptionEn: "Kadin's Industry Report and Strategic Guide highlights the need for a strong cybersecurity framework to support Indonesia's digital economy. The report outlines six strategic pillars: cyber resilience, governance, talent development, public-private partnerships, global standards alignment, and industry growth.\n\nDespite progress, cyber threats persist. Industry players play a key role in accelerating cybersecurity initiatives, ensuring national security and global competitiveness.",
      descriptionId: 'Laporan Industri dan Panduan Strategis Kadin menyoroti kebutuhan akan kerangka keamanan siber yang kuat untuk mendukung ekonomi digital Indonesia. Laporan ini menguraikan enam pilar strategis: ketahanan siber, tata kelola, pengembangan talenta, kemitraan publik-swasta, keselarasan standar global, dan pertumbuhan industri.\n\nMeskipun ada kemajuan, ancaman siber tetap ada. Pelaku industri memainkan peran kunci dalam mempercepat inisiatif keamanan siber, memastikan keamanan nasional dan daya saing global.',
      buttonTextEn: 'Download Here',
      buttonTextId: 'Unduh Di Sini',
      pdfFile: '',
      image: '/images/design-mode/report.png'
    }
    console.log('⚠️ No data found, returning default:', defaultData)
    return NextResponse.json(defaultData)
  } catch (error) {
    console.error('Error fetching report data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const reportData = await request.json()

    // Validate required fields
    const requiredFields = ['titleEn', 'titleId', 'descriptionEn', 'descriptionId', 'buttonTextEn', 'buttonTextId', 'image']

    for (const field of requiredFields) {
      if (!reportData[field] || typeof reportData[field] !== 'string' || !reportData[field].trim()) {
        return NextResponse.json(
          { error: `Field ${field} is required and must not be empty` },
          { status: 400 }
        )
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('home_content')

    const result = await collection.updateOne(
      { section: 'report' },
      {
        $set: {
          report: reportData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error saving report data:', error)
    return NextResponse.json(
      { error: 'Failed to save report data' },
      { status: 500 }
    )
  }
}
