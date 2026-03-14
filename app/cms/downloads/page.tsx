'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X, Download } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'

interface DownloadRecord {
  _id: string
  fullname: string
  company: string
  position: string
  email: string
  member: string
  reportId?: string
  reportTitleEn?: string
  reportTitleId?: string
  downloadedAt: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function CMSDownloadsPage() {
  const { t } = useLanguage()

  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [memberFilter, setMemberFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchDownloads = useCallback(async (page: number, nextSearch: string, member: string) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '10' })
      if (nextSearch) params.set('search', nextSearch)
      if (member) params.set('member', member)
      const res = await fetch(`/api/cms/report-downloads?${params}`)
      if (res.ok) {
        const data = await res.json()
        setDownloads(data.downloads || [])
        setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => fetchDownloads(1, search, memberFilter), 400)
    return () => clearTimeout(timeout)
  }, [fetchDownloads, search, memberFilter])

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Download className="w-6 h-6" />
          {t({ en: 'Download Records', id: 'Riwayat Unduhan' })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Track report downloads from users', id: 'Lacak riwayat unduhan laporan dari pengguna' })}
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder={t({ en: 'Search by name, company, email...', id: 'Cari nama, perusahaan, email...' })}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
            >
              <option value="">{t({ en: 'All', id: 'Semua' })}</option>
              <option value="Anggota ADIGSI">{t({ en: 'ADIGSI Members', id: 'Anggota ADIGSI' })}</option>
              <option value="Non-Anggota">{t({ en: 'Non-Members', id: 'Non-Anggota' })}</option>
            </select>
            {(search || memberFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setMemberFilter('')
                }}
              >
                <X className="h-4 w-4 mr-1" />
                {t({ en: 'Reset', id: 'Reset' })}
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-2 font-semibold text-muted-foreground">{t({ en: 'Full Name', id: 'Nama Lengkap' })}</th>
                  <th className="py-3 px-2 font-semibold text-muted-foreground">{t({ en: 'Company', id: 'Perusahaan' })}</th>
                  <th className="py-3 px-2 font-semibold text-muted-foreground">{t({ en: 'Position', id: 'Jabatan' })}</th>
                  <th className="py-3 px-2 font-semibold text-muted-foreground">{t({ en: 'Email', id: 'Email' })}</th>
                  <th className="py-3 px-2 font-semibold text-muted-foreground">{t({ en: 'Member', id: 'Anggota' })}</th>
                  <th className="py-3 px-2 font-semibold text-muted-foreground">{t({ en: 'Report', id: 'Laporan' })}</th>
                  <th className="py-3 px-2 font-semibold text-muted-foreground">{t({ en: 'Downloaded At', id: 'Diunduh Pada' })}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      {t({ en: 'Loading...', id: 'Memuat...' })}
                    </td>
                  </tr>
                ) : downloads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      {t({ en: 'No records found', id: 'Tidak ada catatan ditemukan' })}
                    </td>
                  </tr>
                ) : (
                  downloads.map((record) => (
                    <tr key={record._id.toString()} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-2 font-medium text-foreground">{record.fullname}</td>
                      <td className="py-3 px-2 text-muted-foreground">{record.company}</td>
                      <td className="py-3 px-2 text-muted-foreground">{record.position}</td>
                      <td className="py-3 px-2 text-muted-foreground">{record.email}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${record.member === 'Anggota ADIGSI'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-muted text-muted-foreground'
                            }`}
                        >
                          {record.member}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground text-xs max-w-40 line-clamp-2">
                        {record.reportTitleEn || record.reportTitleId || '—'}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground text-xs whitespace-nowrap">{formatDate(record.downloadedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                {t({ en: 'Showing', id: 'Menampilkan' })}{' '}
                {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} {t({ en: 'of', id: 'dari' })}{' '}
                {pagination.total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchDownloads(pagination.page - 1, search, memberFilter)}
                >
                  {t({ en: 'Previous', id: 'Sebelumnya' })}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchDownloads(pagination.page + 1, search, memberFilter)}
                >
                  {t({ en: 'Next', id: 'Selanjutnya' })}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
