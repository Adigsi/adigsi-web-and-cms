'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Edit2, Trash2, Plus, Search, X, Pin, PinOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface BannerData {
  titleEn: string
  titleId: string
}

interface ReportData {
  _id: string
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  cover: string
  tags: string[]
  published: boolean
  pinned: boolean
  hasPdf: boolean
  createdAt: string
}

interface ReportTag {
  _id: string
  nameEn: string
  nameId: string
  active: boolean
}

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

export default function CMSKnowledgeHubPage() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    banner: false,
    tags: false,
    reports: false,
    downloads: false,
  })

  // Banner
  const [bannerData, setBannerData] = useState<BannerData>({ titleEn: 'Knowledge Hub', titleId: 'Pusat Pengetahuan' })
  const [originalBannerData, setOriginalBannerData] = useState<BannerData>(bannerData)

  // Reports
  const [reports, setReports] = useState<ReportData[]>([])
  const [reportPage, setReportPage] = useState(1)
  const [reportTotalPages, setReportTotalPages] = useState(1)
  const [reportSearch, setReportSearch] = useState('')
  const [reportPublishedFilter, setReportPublishedFilter] = useState('')
  const [previewCover, setPreviewCover] = useState<string | null>(null)

  // Tags
  const [reportTags, setReportTags] = useState<ReportTag[]>([])
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<ReportTag | null>(null)
  const [tagFormData, setTagFormData] = useState({ nameEn: '', nameId: '' })
  const [isSavingTag, setIsSavingTag] = useState(false)

  // Downloads
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [dlPagination, setDlPagination] = useState<PaginationData>({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const [dlSearch, setDlSearch] = useState('')
  const [dlMemberFilter, setDlMemberFilter] = useState('')
  const [isDlLoading, setIsDlLoading] = useState(false)

  // Fetch banner on mount
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch('/api/cms/reports/banner')
        if (res.ok) {
          const data = await res.json()
          setBannerData({ titleEn: data.titleEn || '', titleId: data.titleId || '' })
          setOriginalBannerData({ titleEn: data.titleEn || '', titleId: data.titleId || '' })
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBanner()
  }, [])

  const hasChanges = (current: unknown, original: unknown) =>
    JSON.stringify(current) !== JSON.stringify(original)

  const handleSaveBanner = async () => {
    setIsSaving('banner')
    try {
      const res = await fetch('/api/cms/reports/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      })
      if (!res.ok) throw new Error('Failed to save banner')
      setOriginalBannerData(bannerData)
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Banner saved', id: 'Banner disimpan' }) })
    } catch (e) {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Failed to save banner', id: 'Gagal menyimpan banner' }), variant: 'destructive' })
    } finally {
      setIsSaving(null)
    }
  }

  // Tags
  const fetchTags = async () => {
    try {
      const res = await fetch('/api/cms/reports/tags')
      if (res.ok) {
        const data = await res.json()
        setReportTags(data.tags || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (expandedSections.tags) fetchTags()
  }, [expandedSections.tags])

  const handleOpenTagModal = (tag?: ReportTag) => {
    if (tag) {
      setEditingTag(tag)
      setTagFormData({ nameEn: tag.nameEn, nameId: tag.nameId })
    } else {
      setEditingTag(null)
      setTagFormData({ nameEn: '', nameId: '' })
    }
    setIsTagModalOpen(true)
  }

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false)
    setEditingTag(null)
    setTagFormData({ nameEn: '', nameId: '' })
  }

  const handleSaveTag = async () => {
    if (!tagFormData.nameEn.trim() || !tagFormData.nameId.trim()) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Both English and Indonesian names are required', id: 'Nama dalam Inggris dan Indonesia wajib diisi' }),
        variant: 'destructive',
      })
      return
    }
    setIsSavingTag(true)
    try {
      let res: Response
      if (editingTag) {
        res = await fetch(`/api/cms/reports/tags?id=${editingTag._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tagFormData),
        })
      } else {
        res = await fetch('/api/cms/reports/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tagFormData),
        })
      }
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save tag')
      }
      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: editingTag
          ? t({ en: 'Tag updated successfully', id: 'Tag berhasil diperbarui' })
          : t({ en: 'Tag created successfully', id: 'Tag berhasil dibuat' }),
      })
      handleCloseTagModal()
      fetchTags()
    } catch (error) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to save tag', id: 'Gagal menyimpan tag' }),
        variant: 'destructive',
      })
    } finally {
      setIsSavingTag(false)
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm(t({ en: 'Are you sure you want to delete this tag?', id: 'Apakah Anda yakin ingin menghapus tag ini?' }))) return
    try {
      const res = await fetch(`/api/cms/reports/tags?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete tag')
      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: t({ en: 'Tag deleted successfully', id: 'Tag berhasil dihapus' }),
      })
      fetchTags()
    } catch {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Failed to delete tag', id: 'Gagal menghapus tag' }),
        variant: 'destructive',
      })
    }
  }

  const handleToggleTagStatus = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/cms/reports/tags?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      })
      if (!res.ok) throw new Error('Failed to update tag status')
      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: !currentActive
          ? t({ en: 'Tag activated', id: 'Tag diaktifkan' })
          : t({ en: 'Tag deactivated', id: 'Tag dinonaktifkan' }),
      })
      fetchTags()
    } catch {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Failed to update tag status', id: 'Gagal memperbarui status tag' }),
        variant: 'destructive',
      })
    }
  }

  // Reports
  const fetchReports = useCallback(async (page: number, search: string, published: string) => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '12' })
      if (search) params.set('search', search)
      if (published) params.set('published', published)
      const res = await fetch(`/api/cms/reports?${params}`)
      if (res.ok) {
        const data = await res.json()
        setReports(data.data)
        setReportPage(data.pagination.page)
        setReportTotalPages(data.pagination.totalPages)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    if (expandedSections.reports) {
      fetchReports(1, reportSearch, reportPublishedFilter)
    }
  }, [expandedSections.reports])

  useEffect(() => {
    if (!expandedSections.reports) return
    const timeout = setTimeout(() => fetchReports(1, reportSearch, reportPublishedFilter), 400)
    return () => clearTimeout(timeout)
  }, [reportSearch, reportPublishedFilter])

  const handleDeleteReport = async (id: string) => {
    if (!confirm(t({ en: 'Delete this report?', id: 'Hapus laporan ini?' }))) return
    try {
      const res = await fetch(`/api/cms/reports?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Report deleted', id: 'Laporan dihapus' }) })
      fetchReports(reportPage, reportSearch, reportPublishedFilter)
    } catch {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Failed to delete', id: 'Gagal menghapus' }), variant: 'destructive' })
    }
  }

  const handleTogglePublished = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/cms/reports?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !current }),
      })
      if (!res.ok) throw new Error()
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Status updated', id: 'Status diperbarui' }) })
      fetchReports(reportPage, reportSearch, reportPublishedFilter)
    } catch {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Failed to update', id: 'Gagal memperbarui' }), variant: 'destructive' })
    }
  }

  const handlePin = async (id: string, isPinned: boolean) => {
    if (isPinned) return // already pinned, no action
    try {
      const res = await fetch(`/api/cms/reports?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: true }),
      })
      if (!res.ok) throw new Error()
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Report pinned to homepage', id: 'Laporan di-pin ke beranda' }) })
      fetchReports(reportPage, reportSearch, reportPublishedFilter)
    } catch {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Failed to pin', id: 'Gagal pin laporan' }), variant: 'destructive' })
    }
  }

  const handleUnpin = async (id: string) => {
    try {
      const res = await fetch(`/api/cms/reports?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: false }),
      })
      if (!res.ok) throw new Error()
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Report unpinned', id: 'Laporan di-unpin' }) })
      fetchReports(reportPage, reportSearch, reportPublishedFilter)
    } catch {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Failed to unpin', id: 'Gagal unpin laporan' }), variant: 'destructive' })
    }
  }

  // Downloads
  const fetchDownloads = useCallback(async (page: number, search: string, member: string) => {
    setIsDlLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '10' })
      if (search) params.set('search', search)
      if (member) params.set('member', member)
      const res = await fetch(`/api/cms/report-downloads?${params}`)
      if (res.ok) {
        const data = await res.json()
        setDownloads(data.downloads)
        setDlPagination(data.pagination)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsDlLoading(false)
    }
  }, [])

  useEffect(() => {
    if (expandedSections.downloads) {
      fetchDownloads(1, dlSearch, dlMemberFilter)
    }
  }, [expandedSections.downloads])

  useEffect(() => {
    if (!expandedSections.downloads) return
    const timeout = setTimeout(() => fetchDownloads(1, dlSearch, dlMemberFilter), 400)
    return () => clearTimeout(timeout)
  }, [dlSearch, dlMemberFilter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">{t({ en: 'Loading...', id: 'Memuat...' })}</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'Knowledge Hub Management', id: 'Manajemen Knowledge Hub' })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage reports, banner, and download records', id: 'Kelola laporan, banner, dan riwayat unduhan' })}
        </p>
      </div>

      {/* Banner Section */}
      <Card className="p-6">
        <div
          className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
          onClick={() => setExpandedSections((s) => ({ ...s, banner: !s.banner }))}
        >
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Banner', id: 'Banner' })}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t({ en: 'Page banner title', id: 'Judul banner halaman' })}</p>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.banner ? 'rotate-0' : '-rotate-90'}`} />
        </div>
        {expandedSections.banner && (
          <div className="space-y-4 mt-4">
            <div>
              <Label>{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
              <Input value={bannerData.titleEn} onChange={(e) => setBannerData({ ...bannerData, titleEn: e.target.value })} />
            </div>
            <div>
              <Label>{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })}</Label>
              <Input value={bannerData.titleId} onChange={(e) => setBannerData({ ...bannerData, titleId: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveBanner} disabled={isSaving === 'banner' || !hasChanges(bannerData, originalBannerData)}>
                {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
              </Button>
              {hasChanges(bannerData, originalBannerData) && (
                <Button variant="outline" onClick={() => setBannerData(originalBannerData)} disabled={isSaving === 'banner'}>
                  {t({ en: 'Cancel', id: 'Batalkan' })}
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Tags Section */}
      <Card className="p-6">
        <div
          className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
          onClick={() => setExpandedSections((s) => ({ ...s, tags: !s.tags }))}
        >
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Report Tags', id: 'Tag Laporan' })}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t({ en: 'Manage bilingual tags used to filter reports', id: 'Kelola tag bilingual yang digunakan untuk filter laporan' })}
            </p>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.tags ? 'rotate-0' : '-rotate-90'}`} />
        </div>

        {expandedSections.tags && (
          <div className="mt-4 space-y-4">
            <Button onClick={() => handleOpenTagModal()} className="gap-2">
              <Plus className="h-4 w-4" />
              {t({ en: 'Add Tag', id: 'Tambah Tag' })}
            </Button>

            {reportTags.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                {t({ en: 'No tags yet. Add one to get started.', id: 'Belum ada tag. Tambahkan untuk memulai.' })}
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">{t({ en: 'Name (English)', id: 'Nama (English)' })}</th>
                      <th className="text-left py-3 px-4 font-semibold">{t({ en: 'Name (Bahasa Indonesia)', id: 'Nama (Bahasa Indonesia)' })}</th>
                      <th className="text-center py-3 px-4 font-semibold">{t({ en: 'Status', id: 'Status' })}</th>
                      <th className="text-center py-3 px-4 font-semibold">{t({ en: 'Actions', id: 'Aksi' })}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reportTags.map((tag) => (
                      <tr key={tag._id} className="hover:bg-muted/50">
                        <td className="py-3 px-4">{tag.nameEn}</td>
                        <td className="py-3 px-4">{tag.nameId}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <Switch
                              checked={tag.active ?? true}
                              onCheckedChange={() => handleToggleTagStatus(tag._id, tag.active ?? true)}
                            />
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              (tag.active ?? true)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {(tag.active ?? true)
                                ? t({ en: 'Active', id: 'Aktif' })
                                : t({ en: 'Inactive', id: 'Nonaktif' })}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenTagModal(tag)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteTag(tag._id)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Reports Section */}
      <Card className="p-6">
        <div
          className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
          onClick={() => setExpandedSections((s) => ({ ...s, reports: !s.reports }))}
        >
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Reports', id: 'Laporan' })}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t({ en: 'Manage downloadable reports', id: 'Kelola laporan yang dapat diunduh' })}</p>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.reports ? 'rotate-0' : '-rotate-90'}`} />
        </div>

        {expandedSections.reports && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Button onClick={() => router.push('/cms/knowledge-hub/form')}>
                <Plus className="h-4 w-4 mr-2" />
                {t({ en: 'Add Report', id: 'Tambah Laporan' })}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={t({ en: 'Search reports...', id: 'Cari laporan...' })}
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                />
              </div>
              <select
                className="h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={reportPublishedFilter}
                onChange={(e) => setReportPublishedFilter(e.target.value)}
              >
                <option value="">{t({ en: 'All Status', id: 'Semua Status' })}</option>
                <option value="true">{t({ en: 'Published', id: 'Dipublikasikan' })}</option>
                <option value="false">{t({ en: 'Unpublished', id: 'Belum Dipublikasikan' })}</option>
              </select>
              {(reportSearch || reportPublishedFilter) && (
                <Button variant="ghost" size="sm" onClick={() => { setReportSearch(''); setReportPublishedFilter('') }}>
                  <X className="h-4 w-4 mr-1" />{t({ en: 'Reset', id: 'Reset' })}
                </Button>
              )}
            </div>

            {/* Note about pin */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Pin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {t({
                  en: 'Only one report can be pinned at a time. The pinned report is shown on the homepage "Our Latest Publication" section.',
                  id: 'Hanya satu laporan yang dapat di-pin sekaligus. Laporan yang di-pin ditampilkan di bagian "Publikasi Terbaru Kami" di beranda.',
                })}
              </p>
            </div>

            {/* Reports Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-2 font-semibold text-muted-foreground w-16">{t({ en: 'Cover', id: 'Cover' })}</th>
                    <th className="py-3 px-2 font-semibold text-muted-foreground">{t({ en: 'Title', id: 'Judul' })}</th>
                    <th className="py-3 px-2 font-semibold text-muted-foreground">{t({ en: 'Tags', id: 'Tag' })}</th>
                    <th className="py-3 px-2 font-semibold text-muted-foreground text-center">{t({ en: 'PDF', id: 'PDF' })}</th>
                    <th className="py-3 px-2 font-semibold text-muted-foreground text-center">{t({ en: 'Published', id: 'Publikasi' })}</th>
                    <th className="py-3 px-2 font-semibold text-muted-foreground text-center">{t({ en: 'Pin', id: 'Pin' })}</th>
                    <th className="py-3 px-2 font-semibold text-muted-foreground text-center">{t({ en: 'Actions', id: 'Aksi' })}</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        {t({ en: 'No reports found', id: 'Tidak ada laporan ditemukan' })}
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-2">
                          {report.cover ? (
                            <div
                              className="relative w-12 h-16 rounded overflow-hidden border border-border cursor-pointer"
                              onClick={() => setPreviewCover(report.cover)}
                            >
                              <Image src={report.cover} alt={report.titleEn} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-16 rounded border border-border bg-muted flex items-center justify-center text-muted-foreground text-xs">
                              N/A
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-medium text-foreground line-clamp-2 max-w-xs">
                            {language === 'en' ? report.titleEn : report.titleId}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {language === 'en' ? report.titleId : report.titleEn}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-1 max-w-48">
                            {(report.tags || []).slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs border border-border">
                                {tag}
                              </span>
                            ))}
                            {(report.tags || []).length > 3 && (
                              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs border border-border">
                                +{report.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${report.hasPdf ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                            {report.hasPdf ? '✓' : '—'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Switch
                            checked={report.published}
                            onCheckedChange={() => handleTogglePublished(report._id, report.published)}
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => report.pinned ? handleUnpin(report._id) : handlePin(report._id, report.pinned)}
                            title={report.pinned
                              ? t({ en: 'Unpin from homepage', id: 'Unpin dari beranda' })
                              : t({ en: 'Pin to homepage', id: 'Pin ke beranda' })}
                            className={`p-1.5 rounded-lg transition-colors ${
                              report.pinned
                                ? 'text-primary bg-primary/10 hover:bg-primary/20'
                                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                            }`}
                          >
                            {report.pinned ? <Pin className="h-4 w-4 fill-current" /> : <PinOff className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/cms/knowledge-hub/form?id=${report._id}`)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteReport(report._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Reports Pagination */}
            {reportTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Button variant="outline" size="sm" disabled={reportPage <= 1} onClick={() => fetchReports(reportPage - 1, reportSearch, reportPublishedFilter)}>
                  {t({ en: 'Previous', id: 'Sebelumnya' })}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {reportPage} / {reportTotalPages}
                </span>
                <Button variant="outline" size="sm" disabled={reportPage >= reportTotalPages} onClick={() => fetchReports(reportPage + 1, reportSearch, reportPublishedFilter)}>
                  {t({ en: 'Next', id: 'Selanjutnya' })}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Download Records Section */}
      <Card className="p-6">
        <div
          className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
          onClick={() => setExpandedSections((s) => ({ ...s, downloads: !s.downloads }))}
        >
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Download Records', id: 'Riwayat Unduhan' })}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t({ en: 'History of report downloads', id: 'Riwayat pengunduhan laporan' })}</p>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.downloads ? 'rotate-0' : '-rotate-90'}`} />
        </div>

        {expandedSections.downloads && (
          <div className="mt-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={t({ en: 'Search by name, company, email...', id: 'Cari nama, perusahaan, email...' })}
                  value={dlSearch}
                  onChange={(e) => setDlSearch(e.target.value)}
                />
              </div>
              <select
                className="h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={dlMemberFilter}
                onChange={(e) => setDlMemberFilter(e.target.value)}
              >
                <option value="">{t({ en: 'All', id: 'Semua' })}</option>
                <option value="Anggota ADIGSI">{t({ en: 'ADIGSI Members', id: 'Anggota ADIGSI' })}</option>
                <option value="Non-Anggota">{t({ en: 'Non-Members', id: 'Non-Anggota' })}</option>
              </select>
              {(dlSearch || dlMemberFilter) && (
                <Button variant="ghost" size="sm" onClick={() => { setDlSearch(''); setDlMemberFilter('') }}>
                  <X className="h-4 w-4 mr-1" />{t({ en: 'Reset', id: 'Reset' })}
                </Button>
              )}
            </div>

            {/* Downloads Table */}
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
                  {isDlLoading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">{t({ en: 'Loading...', id: 'Memuat...' })}</td>
                    </tr>
                  ) : downloads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">{t({ en: 'No records found', id: 'Tidak ada catatan ditemukan' })}</td>
                    </tr>
                  ) : (
                    downloads.map((record) => (
                      <tr key={record._id.toString()} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-2 font-medium text-foreground">{record.fullname}</td>
                        <td className="py-3 px-2 text-muted-foreground">{record.company}</td>
                        <td className="py-3 px-2 text-muted-foreground">{record.position}</td>
                        <td className="py-3 px-2 text-muted-foreground">{record.email}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.member === 'Anggota ADIGSI'
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-muted text-muted-foreground'
                          }`}>
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

            {/* Downloads Pagination */}
            {dlPagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  {t({ en: 'Showing', id: 'Menampilkan' })} {Math.min((dlPagination.page - 1) * dlPagination.limit + 1, dlPagination.total)}–{Math.min(dlPagination.page * dlPagination.limit, dlPagination.total)} {t({ en: 'of', id: 'dari' })} {dlPagination.total}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={dlPagination.page <= 1} onClick={() => fetchDownloads(dlPagination.page - 1, dlSearch, dlMemberFilter)}>
                    {t({ en: 'Previous', id: 'Sebelumnya' })}
                  </Button>
                  <Button variant="outline" size="sm" disabled={dlPagination.page >= dlPagination.totalPages} onClick={() => fetchDownloads(dlPagination.page + 1, dlSearch, dlMemberFilter)}>
                    {t({ en: 'Next', id: 'Selanjutnya' })}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Tag Modal */}
      {isTagModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {editingTag
                  ? t({ en: 'Edit Tag', id: 'Edit Tag' })
                  : t({ en: 'Add Tag', id: 'Tambah Tag' })}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tag-name-en">{t({ en: 'Name (English)', id: 'Nama (English)' })}</Label>
                  <Input
                    id="tag-name-en"
                    value={tagFormData.nameEn}
                    onChange={(e) => setTagFormData({ ...tagFormData, nameEn: e.target.value })}
                    placeholder={t({ en: 'e.g. Cybersecurity', id: 'mis. Keamanan Siber' })}
                  />
                </div>
                <div>
                  <Label htmlFor="tag-name-id">{t({ en: 'Name (Bahasa Indonesia)', id: 'Nama (Bahasa Indonesia)' })}</Label>
                  <Input
                    id="tag-name-id"
                    value={tagFormData.nameId}
                    onChange={(e) => setTagFormData({ ...tagFormData, nameId: e.target.value })}
                    placeholder={t({ en: 'e.g. Keamanan Siber', id: 'mis. Keamanan Siber' })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleSaveTag} disabled={isSavingTag} className="flex-1">
                  {isSavingTag ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save', id: 'Simpan' })}
                </Button>
                <Button variant="outline" onClick={handleCloseTagModal} disabled={isSavingTag} className="flex-1">
                  {t({ en: 'Cancel', id: 'Batalkan' })}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tag Modal */}
      {isTagModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {editingTag
                  ? t({ en: 'Edit Tag', id: 'Edit Tag' })
                  : t({ en: 'Add Tag', id: 'Tambah Tag' })}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tag-name-en">{t({ en: 'Name (English)', id: 'Nama (English)' })}</Label>
                  <Input
                    id="tag-name-en"
                    value={tagFormData.nameEn}
                    onChange={(e) => setTagFormData({ ...tagFormData, nameEn: e.target.value })}
                    placeholder={t({ en: 'e.g. Cybersecurity', id: 'mis. Keamanan Siber' })}
                  />
                </div>
                <div>
                  <Label htmlFor="tag-name-id">{t({ en: 'Name (Bahasa Indonesia)', id: 'Nama (Bahasa Indonesia)' })}</Label>
                  <Input
                    id="tag-name-id"
                    value={tagFormData.nameId}
                    onChange={(e) => setTagFormData({ ...tagFormData, nameId: e.target.value })}
                    placeholder={t({ en: 'e.g. Keamanan Siber', id: 'mis. Keamanan Siber' })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleSaveTag} disabled={isSavingTag} className="flex-1">
                  {isSavingTag ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save', id: 'Simpan' })}
                </Button>
                <Button variant="outline" onClick={handleCloseTagModal} disabled={isSavingTag} className="flex-1">
                  {t({ en: 'Cancel', id: 'Batalkan' })}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Cover Preview Modal */}
      {previewCover && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setPreviewCover(null)}
        >
          <div className="relative max-w-sm w-full bg-card rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewCover(null)}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-black/40 text-white hover:bg-black/60"
            >
              <X className="h-4 w-4" />
            </button>
            <Image src={previewCover} alt="Cover preview" width={400} height={560} className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  )
}
