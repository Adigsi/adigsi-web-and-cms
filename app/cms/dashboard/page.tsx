'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { FileText, Calendar, Users, Building2, Award, Download, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface Statistics {
  news: number
  events: number
  organizations: number
  partners: number
  memberCategories: number
  cybersecurityMembers: {
    categories: number
    totalMembers: number
  }
  digitalMembers: {
    categories: number
    totalMembers: number
  }
  partnerLogos: {
    categories: Array<{ categoryName: string; count: number }>
    total: number
  }
  downloads: {
    total: number
    members: number
    nonMembers: number
  }
  registrations: number
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    websiteContentStatistics: 'Content Statistics',
    totalContent: 'Total Content',
    totalNews: 'Total News',
    totalEvents: 'Total Events',
    membersStatistics: 'Members Statistics',
    totalMembers: 'Total Members',
    cybersecurityCategories: 'Cybersecurity Categories',
    cybersecurityMembers: 'Cybersecurity Members',
    digitalCategories: 'Digital Categories',
    digitalMembers: 'Digital Members',
    partnerStatistics: 'Partner Statistics',
    totalPartners: 'Total Partners',
    reportDownloadStatistics: 'Report Download Statistics',
    totalDownloads: 'Total Downloads',
    adigsiMembers: 'ADIGSI Members',
    nonMembers: 'Non-Members',
    downloadRecordsHistory: 'Download Records History',
    searchPlaceholder: 'Search by name, company, position, or email...',
    allMembers: 'All Members',
    search: 'Search',
    fullName: 'Full Name',
    company: 'Company',
    position: 'Position',
    email: 'Email',
    member: 'Member',
    downloadedAt: 'Downloaded At',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    results: 'results',
    previous: 'Previous',
    next: 'Next',
    loading: 'Loading...',
    noRecords: 'No download records found',
    category: 'Category',
    viewDownloadHistory: 'View Download Records →'
  },
  id: {
    dashboard: 'Dashboard',
    websiteContentStatistics: 'Statistik Konten',
    totalContent: 'Total Konten',
    totalNews: 'Total Berita',
    totalEvents: 'Total Kegiatan',
    membersStatistics: 'Statistik Anggota',
    totalMembers: 'Total Anggota',
    cybersecurityCategories: 'Kategori Cybersecurity',
    cybersecurityMembers: 'Anggota Cybersecurity',
    digitalCategories: 'Kategori Digital',
    digitalMembers: 'Anggota Digital',
    partnerStatistics: 'Statistik Partner',
    totalPartners: 'Total Partner',
    reportDownloadStatistics: 'Statistik Unduhan Laporan',
    totalDownloads: 'Total Unduhan',
    adigsiMembers: 'Anggota ADIGSI',
    nonMembers: 'Non-Anggota',
    downloadRecordsHistory: 'Riwayat Catatan Unduhan',
    searchPlaceholder: 'Cari berdasarkan nama, perusahaan, posisi, atau email...',
    allMembers: 'Semua Anggota',
    search: 'Cari',
    fullName: 'Nama Lengkap',
    company: 'Perusahaan',
    position: 'Posisi',
    email: 'Email',
    member: 'Anggota',
    downloadedAt: 'Diunduh Pada',
    showing: 'Menampilkan',
    to: 'hingga',
    of: 'dari',
    results: 'hasil',
    previous: 'Sebelumnya',
    next: 'Selanjutnya',
    loading: 'Memuat...',
    noRecords: 'Tidak ada catatan unduhan ditemukan',
    category: 'Kategori',
    viewDownloadHistory: 'Lihat Riwayat Unduhan →'
  }
}

export default function CMSDashboard() {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.en
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [statistics, setStatistics] = useState<Statistics>({
    news: 0,
    events: 0,
    organizations: 0,
    partners: 0,
    memberCategories: 0,
    cybersecurityMembers: {
      categories: 0,
      totalMembers: 0
    },
    digitalMembers: {
      categories: 0,
      totalMembers: 0
    },
    partnerLogos: {
      categories: [],
      total: 0
    },
    downloads: {
      total: 0,
      members: 0,
      nonMembers: 0
    },
    registrations: 0
  })

  const fetchStatistics = async () => {
    setIsStatsLoading(true)
    try {
      const response = await fetch('/api/cms/statistics')
      if (response.ok) {
        const data = await response.json()
        setStatistics(data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setIsStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground mt-6">{t.dashboard}</h1>

      {/* Website Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">{t.websiteContentStatistics} ({t.totalContent}: {statistics.news + statistics.events})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.totalNews}</h3>
                <p className="text-3xl font-bold text-primary">
                  {isStatsLoading ? '...' : statistics.news}
                </p>
              </div>
              <FileText className="h-10 w-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.totalEvents}</h3>
                <p className="text-3xl font-bold text-purple-500">
                  {isStatsLoading ? '...' : statistics.events}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-purple-500 opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* Members Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">{t.membersStatistics} ({t.totalMembers}: {statistics.cybersecurityMembers.totalMembers + statistics.digitalMembers.totalMembers})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.cybersecurityCategories}</h3>
                <p className="text-3xl font-bold text-indigo-500">
                  {isStatsLoading ? '...' : statistics.cybersecurityMembers.categories}
                </p>
              </div>
              <Award className="h-8 w-8 text-indigo-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.cybersecurityMembers}</h3>
                <p className="text-3xl font-bold text-primary">
                  {isStatsLoading ? '...' : statistics.cybersecurityMembers.totalMembers}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.digitalCategories}</h3>
                <p className="text-3xl font-bold text-purple-500">
                  {isStatsLoading ? '...' : statistics.digitalMembers.categories}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.digitalMembers}</h3>
                <p className="text-3xl font-bold text-teal-500">
                  {isStatsLoading ? '...' : statistics.digitalMembers.totalMembers}
                </p>
              </div>
              <Users className="h-8 w-8 text-teal-500 opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* Partner Logos Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">{t.partnerStatistics} ({t.totalPartners}: {statistics.partnerLogos.total})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isStatsLoading ? (
            <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.loading}</h3>
                  <p className="text-3xl font-bold text-muted-foreground">...</p>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {statistics.partnerLogos.categories.map((category, index) => {
                const colors = [
                  { text: 'text-amber-500', icon: 'text-amber-500' },
                  { text: 'text-yellow-500', icon: 'text-yellow-500' },
                  { text: 'text-muted-foreground', icon: 'text-muted-foreground' },
                  { text: 'text-orange-500', icon: 'text-orange-500' },
                ]
                const color = colors[index % colors.length]

                return (
                  <Card key={index} className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">{category.categoryName || `${t.category} ${index + 1}`}</h3>
                        <p className={`text-3xl font-bold ${color.text}`}>
                          {category.count}
                        </p>
                      </div>
                      <Building2 className={`h-8 w-8 ${color.icon} opacity-20`} />
                    </div>
                  </Card>
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* Download Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">{t.reportDownloadStatistics}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.totalDownloads}</h3>
                <p className="text-3xl font-bold text-primary">
                  {isStatsLoading ? '...' : statistics.downloads.total}
                </p>
              </div>
              <Download className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.adigsiMembers}</h3>
                <p className="text-3xl font-bold text-teal-500">
                  {isStatsLoading ? '...' : statistics.downloads.members}
                </p>
              </div>
              <Users className="h-8 w-8 text-teal-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.nonMembers}</h3>
                <p className="text-3xl font-bold text-primary">
                  {isStatsLoading ? '...' : statistics.downloads.nonMembers}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>
        </div>
        <div className="mt-4">
          <Link
            href="/cms/knowledge-hub"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            {t.viewDownloadHistory}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
