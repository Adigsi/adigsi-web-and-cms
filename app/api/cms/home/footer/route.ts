import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('home_content')
    
    const data = await collection.findOne({ section: 'footer' })
    
    if (data && data.footer) {
      return NextResponse.json(data.footer)
    }

    // Return default data if not found
    return NextResponse.json({
      aboutTitleEn: 'About ADIGSI',
      aboutTitleId: 'Tentang ADIGSI',
      aboutDescriptionEn: 'ADIGSI was founded with the vision of becoming a key pillar in building a strong and sustainable cybersecurity ecosystem. ADIGSI promotes collaboration between government, private sector, academia, and international organizations to address the ever-evolving cyber threats.',
      aboutDescriptionId: 'ADIGSI didirikan dengan visi menjadi pilar utama dalam membangun ekosistem keamanan siber yang kuat dan berkelanjutan. ADIGSI mempromosikan kolaborasi antara pemerintah, sektor swasta, akademisi, dan organisasi internasional untuk mengatasi ancaman siber yang terus berkembang.',
      instagramUrl: 'https://instagram.com/adigsi.id',
      whatsappUrl: 'https://wa.me/6285121117245',
      linkedinUrl: 'https://www.linkedin.com/company/asosiasi-digitalisasi-dan-keamanan-siber-indonesia-adigsi',
      email: 'info@adigsi.id',
      phone: '+62 851-2111-7245',
      addressEn: 'Bakrie Tower, Jl. Epicentrum Utama Raya No.2 18th Floor, Karet Kuningan, Setiabudi District, Jakarta, 12940',
      addressId: 'Bakrie Tower, Jl. Epicentrum Utama Raya No.2 18th Floor, Karet Kuningan, Setiabudi District, Jakarta, 12940',
      copyrightYear: new Date().getFullYear().toString()
    })
  } catch (error) {
    console.error('Error fetching footer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const footerData = await request.json()

    // Validate required fields
    const requiredFields = [
      'aboutTitleEn', 'aboutTitleId', 'aboutDescriptionEn', 'aboutDescriptionId',
      'instagramUrl', 'whatsappUrl', 'linkedinUrl',
      'email', 'phone', 'addressEn', 'addressId', 'copyrightYear'
    ]

    for (const field of requiredFields) {
      if (!footerData[field] || typeof footerData[field] !== 'string' || !footerData[field].trim()) {
        return NextResponse.json(
          { error: `Field ${field} is required and must not be empty` },
          { status: 400 }
        )
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('home_content')

    const result = await collection.updateOne(
      { section: 'footer' },
      {
        $set: {
          section: 'footer',
          footer: footerData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      message: 'Footer saved successfully',
      data: footerData
    })
  } catch (error) {
    console.error('Error saving footer:', error)
    return NextResponse.json(
      { error: 'Failed to save footer data' },
      { status: 500 }
    )
  }
}
