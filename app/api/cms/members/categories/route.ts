import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

interface MemberCategory {
  titleEn: string
  titleId: string
  count: number
  icon: string
}

interface MemberCategoriesData {
  categories: MemberCategory[]
}

export async function POST(request: NextRequest) {
  try {
    const { categories } = await request.json() as MemberCategoriesData

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category is required' },
        { status: 400 }
      )
    }

    // Validate each category
    for (const category of categories) {
      if (!category.titleEn || !category.titleId) {
        return NextResponse.json(
          { error: 'Each category must have title in both languages' },
          { status: 400 }
        )
      }
    }

    const db = await getMongoDatabase()

    const result = await db.collection('members_content').updateOne(
      { section: 'categories' },
      {
        $set: {
          section: 'categories',
          categories,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Categories saved successfully',
      data: { categories },
    })
  } catch (error) {
    console.error('Error saving categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getMongoDatabase()

    const data = await db.collection('members_content').findOne({ section: 'categories' })

    if (!data || !data.categories) {
      return NextResponse.json({
        categories: [
          { titleEn: 'Network & Infrastructure Security', titleId: 'Keamanan Jaringan & Infrastruktur', count: 25, icon: 'network' },
          { titleEn: 'Web Security', titleId: 'Keamanan Web', count: 18, icon: 'web' },
          { titleEn: 'End Point Security', titleId: 'Keamanan End Point', count: 22, icon: 'endpoint' },
          { titleEn: 'Application Security', titleId: 'Keamanan Aplikasi', count: 20, icon: 'app' },
          { titleEn: 'MSSP', titleId: 'MSSP', count: 15, icon: 'mssp' },
          { titleEn: 'Data Security', titleId: 'Keamanan Data', count: 28, icon: 'data' },
          { titleEn: 'Mobile Security', titleId: 'Keamanan Mobile', count: 16, icon: 'mobile' },
          { titleEn: 'Risk & Compliance', titleId: 'Risiko & Kepatuhan', count: 12, icon: 'risk' },
          { titleEn: 'Security Ops & Incident Response', titleId: 'Operasi Keamanan & Respon Insiden', count: 19, icon: 'secops' },
          { titleEn: 'Threat Intelligence', titleId: 'Intelijen Ancaman', count: 14, icon: 'threat' },
          { titleEn: 'Identity & Access Management', titleId: 'Manajemen Identitas & Akses', count: 17, icon: 'identity' },
          { titleEn: 'Digital Risk Management', titleId: 'Manajemen Risiko Digital', count: 13, icon: 'digitalrisk' },
          { titleEn: 'Blockchain', titleId: 'Blockchain', count: 10, icon: 'blockchain' },
          { titleEn: 'IoT', titleId: 'IoT', count: 11, icon: 'iot' },
          { titleEn: 'Messaging Security', titleId: 'Keamanan Pesan', count: 9, icon: 'messaging' },
          { titleEn: 'Security Consulting & Service', titleId: 'Konsultasi & Layanan Keamanan', count: 21, icon: 'consulting' },
          { titleEn: 'Fraud & Transaction Security', titleId: 'Keamanan Transaksi & Anti-Fraud', count: 16, icon: 'fraud' },
          { titleEn: 'Cloud Security', titleId: 'Keamanan Cloud', count: 24, icon: 'cloud' },
        ],
      })
    }

    return NextResponse.json({
      categories: data.categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        categories: [
          { titleEn: 'Network & Infrastructure Security', titleId: 'Keamanan Jaringan & Infrastruktur', count: 25, icon: 'network' },
          { titleEn: 'Web Security', titleId: 'Keamanan Web', count: 18, icon: 'web' },
          { titleEn: 'End Point Security', titleId: 'Keamanan End Point', count: 22, icon: 'endpoint' },
          { titleEn: 'Application Security', titleId: 'Keamanan Aplikasi', count: 20, icon: 'app' },
          { titleEn: 'MSSP', titleId: 'MSSP', count: 15, icon: 'mssp' },
          { titleEn: 'Data Security', titleId: 'Keamanan Data', count: 28, icon: 'data' },
          { titleEn: 'Mobile Security', titleId: 'Keamanan Mobile', count: 16, icon: 'mobile' },
          { titleEn: 'Risk & Compliance', titleId: 'Risiko & Kepatuhan', count: 12, icon: 'risk' },
          { titleEn: 'Security Ops & Incident Response', titleId: 'Operasi Keamanan & Respon Insiden', count: 19, icon: 'secops' },
          { titleEn: 'Threat Intelligence', titleId: 'Intelijen Ancaman', count: 14, icon: 'threat' },
          { titleEn: 'Identity & Access Management', titleId: 'Manajemen Identitas & Akses', count: 17, icon: 'identity' },
          { titleEn: 'Digital Risk Management', titleId: 'Manajemen Risiko Digital', count: 13, icon: 'digitalrisk' },
          { titleEn: 'Blockchain', titleId: 'Blockchain', count: 10, icon: 'blockchain' },
          { titleEn: 'IoT', titleId: 'IoT', count: 11, icon: 'iot' },
          { titleEn: 'Messaging Security', titleId: 'Keamanan Pesan', count: 9, icon: 'messaging' },
          { titleEn: 'Security Consulting & Service', titleId: 'Konsultasi & Layanan Keamanan', count: 21, icon: 'consulting' },
          { titleEn: 'Fraud & Transaction Security', titleId: 'Keamanan Transaksi & Anti-Fraud', count: 16, icon: 'fraud' },
          { titleEn: 'Cloud Security', titleId: 'Keamanan Cloud', count: 24, icon: 'cloud' },
        ],
      },
      { status: 200 }
    )
  }
}
