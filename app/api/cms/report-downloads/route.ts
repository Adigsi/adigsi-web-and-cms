import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { fullname, company, position, email, member } = await request.json()

    // Validate required fields
    if (!fullname || !company || !position || !email || !member) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const downloadsCollection = db.collection('report_downloads')
    const reportCollection = db.collection('home_content')

    // Save download data
    await downloadsCollection.insertOne({
      fullname,
      company,
      position,
      email,
      member,
      downloadedAt: new Date(),
      createdAt: new Date()
    })

    // Get PDF file
    const reportData = await reportCollection.findOne({ section: 'report' })
    
    if (reportData && reportData.report && reportData.report.pdfFile) {
      return NextResponse.json({ 
        success: true,
        pdfFile: reportData.report.pdfFile 
      })
    }

    return NextResponse.json(
      { error: 'PDF file not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error saving download data:', error)
    return NextResponse.json(
      { error: 'Failed to save download data' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch all download records for admin dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const memberFilter = searchParams.get('member') || ''

    const db = await getMongoDatabase()
    const collection = db.collection('report_downloads')

    // Build query
    const query: any = {}
    
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    if (memberFilter) {
      query.member = memberFilter
    }

    // Get total count
    const total = await collection.countDocuments(query)

    // Get paginated data
    const downloads = await collection
      .find(query)
      .sort({ downloadedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      downloads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching download data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch download data' },
      { status: 500 }
    )
  }
}
