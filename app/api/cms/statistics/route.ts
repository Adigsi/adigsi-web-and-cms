import { NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getMongoDatabase()
    
    // Get counts from various collections
    const [
      newsCount,
      eventsCount,
      organizationData,
      partnersData,
      memberCategoriesData,
      digitalCategoriesData,
      partnerLogosData,
      downloadsCount,
      registrationsCount
    ] = await Promise.all([
      // News count - count documents with section: 'news'
      db.collection('news_content').countDocuments({ section: 'news' }),
      
      // Events count - count documents with section: 'event'
      db.collection('events_content').countDocuments({ section: 'event' }),
      
      // Organization structure count
      db.collection('about_content').findOne({ section: 'organization' }),
      
      // Partners count
      db.collection('about_content').findOne({ section: 'partners' }),
      
      // Cybersecurity Member categories
      db.collection('members_content').findOne({ section: 'categories' }),
      
      // Digital Member categories
      db.collection('members_content').findOne({ section: 'digital-categories' }),
      
      // Partner logos by category
      db.collection('members_content').findOne({ section: 'partner-logos' }),
      
      // Report downloads count
      db.collection('report_downloads').countDocuments(),
      
      // Registrations count
      db.collection('registrations').countDocuments()
    ])

    // Calculate counts from arrays
    const organizationsCount = organizationData?.organizations?.length || 0
    const partnersCount = partnersData?.partners?.length || 0
    const memberCategoriesCount = memberCategoriesData?.categories?.length || 0
    
    // Calculate cybersecurity member categories and total members
    const cybersecurityCategories = memberCategoriesData?.categories || []
    const cybersecurityTotalMembers = cybersecurityCategories.reduce((sum: number, cat: any) => sum + (cat.count || 0), 0)
    
    // Calculate digital member categories and total members
    const digitalCategories = digitalCategoriesData?.categories || []
    const digitalTotalMembers = digitalCategories.reduce((sum: number, cat: any) => sum + (cat.count || 0), 0)
    
    // Calculate partner logos by category
    const partnerCategories = partnerLogosData?.categories || []
    const partnersByCategory = partnerCategories.map((cat: any) => ({
      categoryName: cat.categoryNameEn || '',
      count: cat.logos?.length || 0
    }))
    const totalPartnerLogos = partnerCategories.reduce((sum: number, cat: any) => sum + (cat.logos?.length || 0), 0)

    // Get additional download statistics
    const downloadStats = await db.collection('report_downloads').aggregate([
      {
        $group: {
          _id: '$member',
          count: { $sum: 1 }
        }
      }
    ]).toArray()

    const memberDownloads = downloadStats.find(s => s._id === 'Yes')?.count || 0
    const nonMemberDownloads = downloadStats.find(s => s._id === 'No')?.count || 0

    return NextResponse.json({
      news: newsCount,
      events: eventsCount,
      organizations: organizationsCount,
      partners: partnersCount,
      memberCategories: memberCategoriesCount,
      cybersecurityMembers: {
        categories: cybersecurityCategories.length,
        totalMembers: cybersecurityTotalMembers
      },
      digitalMembers: {
        categories: digitalCategories.length,
        totalMembers: digitalTotalMembers
      },
      partnerLogos: {
        categories: partnersByCategory,
        total: totalPartnerLogos
      },
      downloads: {
        total: downloadsCount,
        members: memberDownloads,
        nonMembers: nonMemberDownloads
      },
      registrations: registrationsCount
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
