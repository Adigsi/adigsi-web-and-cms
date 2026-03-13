import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { getMediaUrlValidationError } from '@/lib/upload/validate-media-payload'

interface Testimonial {
  quoteEn: string
  quoteId: string
  name: string
  positionEn: string
  positionId: string
  image: string
}

interface WelcomeData {
  titleSmallEn: string
  titleSmallId: string
  titleLargeEn: string
  titleLargeId: string
  testimonials: Testimonial[]
}

export async function GET() {
  try {
    const db = await getMongoDatabase()
    const collection = db.collection('home_content')
    
    const data = await collection.findOne({ section: 'welcome' })
    
    console.log('📦 DB query result:', data)
    
    if (data && data.welcome) {
      console.log('✅ Returning existing data:', data.welcome)
      return NextResponse.json(data.welcome)
    }

    // Return default data if not found
    const defaultData = {
      titleSmallEn: 'Welcome to Adigsi',
      titleSmallId: 'Selamat Datang di Adigsi',
      titleLargeEn: 'Indonesian Digitalization and Cybersecurity Association',
      titleLargeId: 'Asosiasi Digital dan Keamanan Siber Indonesia',
      testimonials: [
        {
          quoteEn: '"Sebagai perwakilan dunia usaha nasional, kebutuhan yang tinggi untuk keamanan siber sangat dibutuhkan agar tidak menganggu business process. Maka ADIGSI hadir untuk memperkuat keamanan siber nasional demi melindungi berbagai kepentingan industri"',
          quoteId: '"Sebagai perwakilan dunia usaha nasional, kebutuhan yang tinggi untuk keamanan siber sangat dibutuhkan agar tidak menganggu business process. Maka ADIGSI hadir untuk memperkuat keamanan siber nasional demi melindungi berbagai kepentingan industri"',
          name: 'Firlie H. Ganinduto',
          positionEn: 'Chairman of ADIGSI',
          positionId: 'Ketua Umum ADIGSI',
          image: '/images/firlie.png'
        },
        {
          quoteEn: 'Synergy between government, businesses, and the private sector is essential to strengthen our cybersecurity ecosystem. ADIGSI is expected to be an important platform for sharing knowledge, strengthening coordination between industry and government, and improving response to increasingly sophisticated cyber threats',
          quoteId: 'Sinergi antara pemerintah, pelaku usaha, dan sektor swasta sangat diperlukan untuk memperkuat ekosistem keamanan siber kita. ADIKSI diharapkan menjadi platform penting untuk berbagi pengetahuan, memperkuat koordinasi antara sektor industri dan pemerintah, serta meningkatkan respons terhadap ancaman siber yang semakin canggih',
          name: 'Slamet Aji Pamungkas',
          positionEn: 'Chairman of ADIGSI Supervisory Board',
          positionId: 'Ketua Dewan Pengawas ADIGSI',
          image: '/images/slamet.png'
        }
      ]
    }
    console.log('⚠️ No data found, returning default:', defaultData)
    return NextResponse.json(defaultData)
  } catch (error) {
    console.error('Error fetching welcome data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch welcome data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const welcomeData = await request.json()

    // Validate required fields
    const requiredFields = ['titleSmallEn', 'titleSmallId', 'titleLargeEn', 'titleLargeId', 'testimonials']

    for (const field of requiredFields) {
      if (field !== 'testimonials') {
        if (!welcomeData[field] || typeof welcomeData[field] !== 'string' || !welcomeData[field].trim()) {
          return NextResponse.json(
            { error: `Field ${field} is required and must not be empty` },
            { status: 400 }
          )
        }
      }
    }

    // Validate testimonials array
    if (!Array.isArray(welcomeData.testimonials) || welcomeData.testimonials.length === 0) {
      return NextResponse.json(
        { error: 'At least one testimonial is required' },
        { status: 400 }
      )
    }

    for (let i = 0; i < welcomeData.testimonials.length; i++) {
      const testimonial = welcomeData.testimonials[i]
      const testimonialFields = ['quoteEn', 'quoteId', 'name', 'positionEn', 'positionId', 'image']
      
      for (const field of testimonialFields) {
        if (!testimonial[field] || typeof testimonial[field] !== 'string' || !testimonial[field].trim()) {
          return NextResponse.json(
            { error: `Testimonial ${i + 1}: ${field} is required and must not be empty` },
            { status: 400 }
          )
        }
      }

      const imageError = getMediaUrlValidationError(testimonial.image, `testimonials[${i}].image`)
      if (imageError) {
        return NextResponse.json({ error: imageError }, { status: 400 })
      }
    }

    const db = await getMongoDatabase()
    const collection = db.collection('home_content')

    const result = await collection.updateOne(
      { section: 'welcome' },
      {
        $set: {
          section: 'welcome',
          welcome: welcomeData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      message: 'Welcome data saved successfully',
      data: welcomeData
    })
  } catch (error) {
    console.error('Error saving welcome data:', error)
    return NextResponse.json(
      { error: 'Failed to save welcome data' },
      { status: 500 }
    )
  }
}
