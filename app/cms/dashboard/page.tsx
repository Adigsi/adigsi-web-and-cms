'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, ChevronLeft, ChevronRight, FileText, Calendar, Users, Building2, Award, Download, UserPlus } from 'lucide-react'

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
  downloads: {
    total: number
    members: number
    nonMembers: number
  }
  registrations: number
}

export default function CMSDashboard() {
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
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Website Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Website Content Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total News</h3>
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
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Events</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {isStatsLoading ? '...' : statistics.events}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-purple-600 opacity-20" />
            </div>
          </Card>

          {/* <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Organizations</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {isStatsLoading ? '...' : statistics.organizations}
                </p>
              </div>
              <Building2 className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </Card> */}

          {/* <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Partners</h3>
                <p className="text-3xl font-bold text-teal-600">
                  {isStatsLoading ? '...' : statistics.partners}
                </p>
              </div>
              <Users className="h-10 w-10 text-teal-600 opacity-20" />
            </div>
          </Card> */}

          {/* <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Member Categories</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {isStatsLoading ? '...' : statistics.memberCategories}
                </p>
              </div>
              <Award className="h-10 w-10 text-indigo-600 opacity-20" />
            </div>
          </Card> */}

          {/* <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Report Downloads</h3>
                <p className="text-3xl font-bold text-green-600">
                  {isStatsLoading ? '...' : statistics.downloads.total}
                </p>
              </div>
              <Download className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </Card> */}

          {/* <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Registrations</h3>
                <p className="text-3xl font-bold text-pink-600">
                  {isStatsLoading ? '...' : statistics.registrations}
                </p>
              </div>
              <UserPlus className="h-10 w-10 text-pink-600 opacity-20" />
            </div>
          </Card> */}
        </div>
      </div>

      {/* Download Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Download Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Downloads</h3>
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
                <h3 className="text-sm font-medium text-gray-600 mb-2">ADIGSI Members</h3>
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
                <h3 className="text-sm font-medium text-gray-600 mb-2">Non-Members</h3>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Download Records History</h2>
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-0">
          <div className="p-6 border-b border-gray-200">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, company, position, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch}>Search</Button>
              </div>
              
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Members</option>
                <option value="Yes">ADIGSI Members</option>
                <option value="No">Non-Members</option>
              </select>
            </div>
          </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : downloads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No download records found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloaded At
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
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
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
