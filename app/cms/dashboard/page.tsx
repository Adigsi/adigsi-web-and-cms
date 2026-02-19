'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, ChevronLeft, ChevronRight, FileText, Calendar, Users, Building2, Award, Download, UserPlus } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface DownloadRecord {
  _id: string
  fullname: string
  company: string
  position: string
  email: string
  member: string
  downloadedAt: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

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
    category: 'Category'
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
    category: 'Kategori'
  }
}

export default function CMSDashboard() {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.en
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [search, setSearch] = useState('')
  const [memberFilter, setMemberFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
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

  const fetchDownloads = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(memberFilter && { member: memberFilter })
      })

      const response = await fetch(`/api/cms/report-downloads?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDownloads(data.downloads)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching downloads:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
    fetchDownloads()
  }, [pagination.page, memberFilter])

  useEffect(() => {
    fetchStatistics()
  }, [])

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 })
    fetchDownloads()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">{t.dashboard}</h1>
      
      {/* Website Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.websiteContentStatistics} ({t.totalContent}: {statistics.news + statistics.events})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{t.totalNews}</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {isStatsLoading ? '...' : statistics.news}
                </p>
              </div>
              <FileText className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{t.totalEvents}</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {isStatsLoading ? '...' : statistics.events}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-purple-600 opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* Members Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.membersStatistics} ({t.totalMembers}: {statistics.cybersecurityMembers.totalMembers + statistics.digitalMembers.totalMembers})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{t.cybersecurityCategories}</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {isStatsLoading ? '...' : statistics.cybersecurityMembers.categories}
                </p>
              </div>
              <Award className="h-8 w-8 text-indigo-600 opacity-20" />
            </div>
          </Card>

          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{t.cybersecurityMembers}</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {isStatsLoading ? '...' : statistics.cybersecurityMembers.totalMembers}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{t.digitalCategories}</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {isStatsLoading ? '...' : statistics.digitalMembers.categories}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600 opacity-20" />
            </div>
          </Card>

          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{t.digitalMembers}</h3>
                <p className="text-3xl font-bold text-teal-600">
                  {isStatsLoading ? '...' : statistics.digitalMembers.totalMembers}
                </p>
              </div>
              <Users className="h-8 w-8 text-teal-600 opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* Partner Logos Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.partnerStatistics} ({t.totalPartners}: {statistics.partnerLogos.total})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isStatsLoading ? (
            <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{t.loading}</h3>
                  <p className="text-3xl font-bold text-gray-400">...</p>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {statistics.partnerLogos.categories.map((category, index) => {
                const colors = [
                  { text: 'text-amber-600', icon: 'text-amber-600' },
                  { text: 'text-yellow-600', icon: 'text-yellow-600' },
                  { text: 'text-gray-500', icon: 'text-gray-500' },
                  { text: 'text-orange-600', icon: 'text-orange-600' },
                ]
                const color = colors[index % colors.length]

                return (
                  <Card key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">{category.categoryName || `${t.category} ${index + 1}`}</h3>
                        <p className={`text-3xl font-bold ${color.text}`}>
                          {category.count}
                        </p>
                      </div>
                      <Building2 className={`h-8 w-8 ${color.icon} opacity-20`} />
                    </div>
                  </Card>
                )
              })}
              {/* <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Partners</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {statistics.partnerLogos.total}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600 opacity-20" />
                </div>
              </Card> */}
            </>
          )}
        </div>
      </div>

      {/* Download Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.reportDownloadStatistics}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{t.totalDownloads}</h3>
                <p className="text-3xl font-bold text-primary">
                  {isStatsLoading ? '...' : statistics.downloads.total}
                </p>
              </div>
              <Download className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{t.adigsiMembers}</h3>
                <p className="text-3xl font-bold text-green-600">
                  {isStatsLoading ? '...' : statistics.downloads.members}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{t.nonMembers}</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {isStatsLoading ? '...' : statistics.downloads.nonMembers}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600 opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* Downloads Table Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.downloadRecordsHistory}</h2>
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
          <div className="p-6 border-b border-gray-200">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch}>{t.search}</Button>
              </div>
              
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t.allMembers}</option>
                <option value="Yes">{t.adigsiMembers}</option>
                <option value="No">{t.nonMembers}</option>
              </select>
            </div>
          </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">{t.loading}</div>
          ) : downloads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">{t.noRecords}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.fullName}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.company}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.position}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.email}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.member}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.downloadedAt}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {downloads.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.fullname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.member === 'Yes' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {record.member}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.downloadedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && downloads.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {t.showing} {((pagination.page - 1) * pagination.limit) + 1} {t.to}{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} {t.of}{' '}
              {pagination.total} {t.results}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                {t.previous}
              </Button>
              <Button
                variant="outline"
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
              >
                {t.next}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
      </div>
    </div>
  )
}
