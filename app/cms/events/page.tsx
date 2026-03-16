'use client'

import { useState, useEffect, useCallback } from 'react'
import { Edit2, Trash2, Plus, Search, X } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'
import { useFileUpload } from '@/hooks/use-file-upload'

interface BannerData {
  titleEn: string
  titleId: string
}

interface EventCategory {
  _id: string
  nameEn: string
  nameId: string
  active: boolean
}

interface EventData {
  _id?: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  image: string
  registerLink: string
  published: boolean
  date?: string
  time?: string
  location?: string
  publishedDate?: string
}

interface EventsResponse {
  success: boolean
  data: EventData[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function CMSEventsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('banner')

  // Banner section state
  const [bannerData, setBannerData] = useState<BannerData>({
    titleEn: 'Adigsi Activity Agenda',
    titleId: 'Agenda Kegiatan Adigsi',
  })

  const [originalBannerData, setOriginalBannerData] = useState<BannerData>(bannerData)

  // Events section state
  const [events, setEvents] = useState<EventData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isEditingModal, setIsEditingModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [publishedFilter, setPublishedFilter] = useState('')
  const [availableCategories, setAvailableCategories] = useState<EventCategory[]>([])
  const [formData, setFormData] = useState<EventData>({
    titleEn: '',
    titleId: '',
    categoryEn: '',
    categoryId: '',
    image: '',
    registerLink: '',
    published: true,
    date: '',
    time: '',
    location: '',
    publishedDate: '',
  })

  // Category CRUD state
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([])
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null)
  const [catFormData, setCatFormData] = useState({ nameEn: '', nameId: '' })
  const [isSavingCat, setIsSavingCat] = useState(false)

  // Fetch banner data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannerRes = await fetch('/api/cms/events/banner')

        if (bannerRes.ok) {
          const data = await bannerRes.json()
          setBannerData({
            titleEn: data.titleEn || '',
            titleId: data.titleId || '',
          })
          setOriginalBannerData({
            titleEn: data.titleEn || '',
            titleId: data.titleId || '',
          })
        }
      } catch (error) {
        console.error('Error fetching banner data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch events
  const fetchEvents = async (page: number) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(publishedFilter && { published: publishedFilter }),
      })

      const response = await fetch(`/api/cms/events/events?${params}`)
      if (response.ok) {
        const data: EventsResponse = await response.json()
        setEvents(data.data)
        setCurrentPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents(1)
      fetchCategories()
    } else if (activeTab === 'categories') {
      fetchCategories()
    }
  }, [activeTab])

  // Auto-fetch when filters change
  useEffect(() => {
    if (activeTab === 'events' && (categoryFilter || publishedFilter)) {
      setCurrentPage(1)
      fetchEvents(1)
    }
  }, [categoryFilter, publishedFilter])

  // Debounced search
  useEffect(() => {
    if (activeTab !== 'events') return

    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        setCurrentPage(1)
        fetchEvents(1)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/cms/events/categories')
      if (response.ok) {
        const data = await response.json()
        setAvailableCategories(data.categories || [])
        setEventCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleOpenCatModal = (category?: EventCategory) => {
    if (category) {
      setEditingCategory(category)
      setCatFormData({ nameEn: category.nameEn, nameId: category.nameId })
    } else {
      setEditingCategory(null)
      setCatFormData({ nameEn: '', nameId: '' })
    }
    setIsCatModalOpen(true)
  }

  const handleCloseCatModal = () => {
    setIsCatModalOpen(false)
    setEditingCategory(null)
    setCatFormData({ nameEn: '', nameId: '' })
  }

  const handleSaveCategory = async () => {
    if (!catFormData.nameEn.trim() || !catFormData.nameId.trim()) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Both English and Indonesian names are required', id: 'Nama dalam Inggris dan Indonesia wajib diisi' }),
        variant: 'destructive',
      })
      return
    }

    setIsSavingCat(true)
    try {
      let response: Response
      if (editingCategory) {
        response = await fetch(`/api/cms/events/categories?id=${editingCategory._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catFormData),
        })
      } else {
        response = await fetch('/api/cms/events/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catFormData),
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save category')
      }

      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: editingCategory
          ? t({ en: 'Category updated successfully', id: 'Kategori berhasil diperbarui' })
          : t({ en: 'Category created successfully', id: 'Kategori berhasil dibuat' }),
      })
      handleCloseCatModal()
      fetchCategories()
    } catch (error) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to save category', id: 'Gagal menyimpan kategori' }),
        variant: 'destructive',
      })
    } finally {
      setIsSavingCat(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm(t({ en: 'Are you sure you want to delete this category?', id: 'Apakah Anda yakin ingin menghapus kategori ini?' }))) return

    try {
      const response = await fetch(`/api/cms/events/categories?id=${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete category')
      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: t({ en: 'Category deleted successfully', id: 'Kategori berhasil dihapus' }),
      })
      fetchCategories()
    } catch (error) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Failed to delete category', id: 'Gagal menghapus kategori' }),
        variant: 'destructive',
      })
    }
  }

  const handleToggleCategoryStatus = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/cms/events/categories?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      })
      if (!response.ok) throw new Error('Failed to update category status')
      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: !currentActive
          ? t({ en: 'Category activated', id: 'Kategori diaktifkan' })
          : t({ en: 'Category deactivated', id: 'Kategori dinonaktifkan' }),
      })
      fetchCategories()
    } catch (error) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Failed to update category status', id: 'Gagal memperbarui status kategori' }),
        variant: 'destructive',
      })
    }
  }

  const handleResetFilters = async () => {
    setSearchQuery('')
    setCategoryFilter('')
    setPublishedFilter('')
    setCurrentPage(1)

    // Fetch immediately with no filters
    try {
      const response = await fetch(`/api/cms/events/events?page=1`)
      if (response.ok) {
        const data: EventsResponse = await response.json()
        setEvents(data.data)
        setCurrentPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const hasChanges = (current: any, original: any): boolean => {
    return JSON.stringify(current) !== JSON.stringify(original)
  }

  const handleCancelBanner = () => {
    setBannerData(originalBannerData)
  }

  const handleSaveBanner = async () => {
    setIsSaving('banner')

    try {
      const response = await fetch('/api/cms/events/banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save banner')
      }

      setOriginalBannerData(bannerData)

      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: t({ en: 'Banner saved successfully', id: 'Banner berhasil disimpan' }),
      })
    } catch (error) {
      console.error('Error saving banner:', error)
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to save changes', id: 'Gagal menyimpan perubahan' }),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(null)
    }
  }

  const handleOpenModal = (event?: EventData) => {
    if (event) {
      setEditingEvent(event)
      setFormData(event)
    } else {
      setEditingEvent(null)
      setFormData({
        titleEn: '',
        titleId: '',
        categoryEn: '',
        categoryId: '',
        image: '',
        registerLink: '',
        published: true,
        date: '',
        time: '',
        location: '',
        publishedDate: '',
      })
    }
    setIsEditingModal(true)
  }

  const handleCloseModal = () => {
    setIsEditingModal(false)
    setEditingEvent(null)
    setFormData({
      titleEn: '',
      titleId: '',
      categoryEn: '',
      categoryId: '',
      image: '',
      registerLink: '',
      published: true,
      date: '',
      time: '',
      location: '',
      publishedDate: '',
    })
  }

  const handleSaveEvent = async () => {
    if (!formData.titleEn || !formData.titleId || !formData.image || !formData.categoryEn || !formData.categoryId || !formData.registerLink) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'All fields are required', id: 'Semua field harus diisi' }),
        variant: 'destructive',
      })
      return
    }

    setIsSaving('event')

    try {
      const response = await fetch('/api/cms/events/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save event')
      }

      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: editingEvent
          ? t({ en: 'Event updated successfully', id: 'Event berhasil diperbarui' })
          : t({ en: 'Event created successfully', id: 'Event berhasil dibuat' }),
      })

      handleCloseModal()
      fetchEvents(1)
      fetchCategories() // Refresh categories
    } catch (error) {
      console.error('Error saving event:', error)
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to save event', id: 'Gagal menyimpan event' }),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(null)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm(t({ en: 'Are you sure you want to delete this event?', id: 'Apakah Anda yakin ingin menghapus event ini?' }))) {
      return
    }

    try {
      const response = await fetch(`/api/cms/events/events?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: t({ en: 'Event deleted successfully', id: 'Event berhasil dihapus' }),
      })

      fetchEvents(currentPage)
      fetchCategories() // Refresh categories
    } catch (error) {
      console.error('Error deleting event:', error)
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Failed to delete event', id: 'Gagal menghapus event' }),
        variant: 'destructive',
      })
    }
  }

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/cms/events/events?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      })

      if (!response.ok) {
        throw new Error('Failed to update event status')
      }

      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: t({ en: 'Event status updated', id: 'Status event berhasil diperbarui' }),
      })

      fetchEvents(currentPage)
    } catch (error) {
      console.error('Error updating event status:', error)
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Failed to update event status', id: 'Gagal memperbarui status event' }),
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t({ en: 'Events Page Management', id: 'Manajemen Halaman Events' })}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t({ en: 'Manage content sections for the Events page', id: 'Kelola konten section untuk halaman Events' })}
            </p>
          </div>
          <Card className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              {t({ en: 'Loading...', id: 'Memuat...' })}
            </div>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="banner" className="h-full" onValueChange={setActiveTab}>
          {/* Sticky header */}
          <div className="sticky top-16 md:top-0 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 pt-4 pb-3 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
            <h1 className="text-2xl font-bold text-foreground">{t({ en: 'Events Page Management', id: 'Manajemen Halaman Events' })}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t({ en: 'Manage content sections for the Events page', id: 'Kelola konten section untuk halaman Events' })}
            </p>
            <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-primary/10 p-1 rounded-md mt-3">
              <TabsTrigger value="banner">{t({ en: 'Page Title', id: 'Judul Halaman' })}</TabsTrigger>
              <TabsTrigger value="categories">{t({ en: 'Event Categories', id: 'Kategori Event' })}</TabsTrigger>
              <TabsTrigger value="events">{t({ en: 'Events', id: 'Event' })}</TabsTrigger>
            </TabsList>
          </div>

          {/* Banner Tab */}
          <TabsContent value="banner">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="banner-title-en">{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
                      <Input
                        id="banner-title-en"
                        value={bannerData.titleEn}
                        onChange={(e) => setBannerData({ ...bannerData, titleEn: e.target.value })}
                        placeholder={t({ en: 'Enter banner title in English', id: 'Masukkan judul banner dalam English' })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="banner-title-id">{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })}</Label>
                      <Input
                        id="banner-title-id"
                        value={bannerData.titleId}
                        onChange={(e) => setBannerData({ ...bannerData, titleId: e.target.value })}
                        placeholder={t({ en: 'Enter banner title in Indonesian', id: 'Masukkan judul banner dalam Indonesia' })}
                      />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="sticky bottom-0 z-10 mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.06)] flex items-center gap-3">
                <Button onClick={handleSaveBanner} disabled={isSaving === 'banner' || !hasChanges(bannerData, originalBannerData)}>
                  {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
                {hasChanges(bannerData, originalBannerData) && (
                  <Button variant="outline" onClick={handleCancelBanner} disabled={isSaving === 'banner'}>
                    {t({ en: 'Cancel Changes', id: 'Batalkan Perubahan' })}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Event Categories Tab */}
          <TabsContent value="categories">
            <Card className="p-6">
              <div className="space-y-4">
                <Button onClick={() => handleOpenCatModal()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t({ en: 'Add Category', id: 'Tambah Kategori' })}
                </Button>

                {eventCategories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                    {t({ en: 'No categories yet. Add one to get started.', id: 'Belum ada kategori. Tambahkan untuk memulai.' })}
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
                        {eventCategories.map((cat) => (
                          <tr key={cat._id} className="hover:bg-muted/50">
                            <td className="py-3 px-4">{cat.nameEn}</td>
                            <td className="py-3 px-4">{cat.nameId}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <Switch
                                  checked={cat.active ?? true}
                                  onCheckedChange={() => handleToggleCategoryStatus(cat._id, cat.active ?? true)}
                                />
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${(cat.active ?? true)
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                  }`}>
                                  {(cat.active ?? true)
                                    ? t({ en: 'Active', id: 'Aktif' })
                                    : t({ en: 'Inactive', id: 'Nonaktif' })}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleOpenCatModal(cat)}
                                  className="p-1 hover:bg-muted rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="h-4 w-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat._id)}
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
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card className="p-6">
              <div className="space-y-4">
                <Button onClick={() => handleOpenModal()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t({ en: 'Add New Event', id: 'Tambah Kegiatan Baru' })}
                </Button>

                {/* Search and Filters */}
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={t({ en: 'Search events by title...', id: 'Cari event berdasarkan judul...' })}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">{t({ en: 'All Categories', id: 'Semua Kategori' })}</option>
                        {availableCategories.map((cat) => (
                          <option key={cat._id} value={cat.nameEn}>{cat.nameEn} / {cat.nameId}</option>
                        ))}
                      </select>
                      <select
                        value={publishedFilter}
                        onChange={(e) => setPublishedFilter(e.target.value)}
                        className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">{t({ en: 'All Status', id: 'Semua Status' })}</option>
                        <option value="true">{t({ en: 'Published', id: 'Dipublikasikan' })}</option>
                        <option value="false">{t({ en: 'Unpublished', id: 'Tidak Dipublikasikan' })}</option>
                      </select>
                      {(searchQuery || categoryFilter || publishedFilter) && (
                        <Button onClick={handleResetFilters} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-1" />
                          {t({ en: 'Reset', id: 'Reset' })}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Events Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">{t({ en: 'Title', id: 'Judul' })}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t({ en: 'Category', id: 'Kategori' })}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t({ en: 'Date / Time / Location', id: 'Tanggal / Waktu / Tempat' })}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t({ en: 'Published Date', id: 'Tanggal Publikasi' })}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t({ en: 'Status', id: 'Status' })}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t({ en: 'Actions', id: 'Aksi' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event._id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex gap-3 items-center">
                              {event.image && (
                                <div className="shrink-0">
                                  <img
                                    src={event.image}
                                    alt="Event thumbnail"
                                    onClick={() => setPreviewImage(event.image)}
                                    className="h-16 w-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                    title={t({ en: 'Click to preview', id: 'Klik untuk preview' })}
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="text-sm space-y-1">
                                  <div><span className="font-bold">EN:</span> {event.titleEn}</div>
                                  <div><span className="font-bold">ID:</span> {event.titleId}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm space-y-1">
                              <div><span className="font-bold">EN:</span> {event.categoryEn}</div>
                              <div><span className="font-bold">ID:</span> {event.categoryId}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm space-y-1 text-muted-foreground">
                              {event.date && <div className="flex items-center gap-1"><span className="font-semibold text-foreground">📅</span> {event.date}</div>}
                              {event.time && <div className="flex items-center gap-1"><span className="font-semibold text-foreground">🕐</span> {event.time}</div>}
                              {event.location && <div className="flex items-center gap-1"><span className="font-semibold text-foreground">📍</span> {event.location}</div>}
                              {!event.date && !event.time && !event.location && <span className="text-xs italic">{t({ en: 'Not set', id: 'Belum diset' })}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-muted-foreground">
                              {event.publishedDate
                                ? new Date(event.publishedDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                                : <span className="text-xs italic">{t({ en: 'Not set', id: 'Belum diset' })}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <Switch
                                checked={event.published}
                                onCheckedChange={() => handleTogglePublish(event._id!, event.published)}
                              />
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${event.published
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}>
                                {event.published ? t({ en: 'Published', id: 'Dipublikasikan' }) : t({ en: 'Unpublished', id: 'Tidak Dipublikasikan' })}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenModal(event)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event._id!)}
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

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    {t({ en: `Page ${currentPage} of ${totalPages}`, id: `Halaman ${currentPage} dari ${totalPages}` })}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchEvents(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      {t({ en: 'Previous', id: 'Sebelumnya' })}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchEvents(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      {t({ en: 'Next', id: 'Selanjutnya' })}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{t({ en: 'Image Preview', id: 'Preview Gambar' })}</h3>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <img src={previewImage} alt="Preview" className="w-full h-auto rounded" />
            </div>
          </Card>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {editingCategory
                  ? t({ en: 'Edit Category', id: 'Edit Kategori' })
                  : t({ en: 'Add Category', id: 'Tambah Kategori' })}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cat-name-en">{t({ en: 'Name (English)', id: 'Nama (English)' })}</Label>
                  <Input
                    id="cat-name-en"
                    value={catFormData.nameEn}
                    onChange={(e) => setCatFormData({ ...catFormData, nameEn: e.target.value })}
                    placeholder={t({ en: 'e.g. Conference', id: 'mis. Conference' })}
                  />
                </div>
                <div>
                  <Label htmlFor="cat-name-id">{t({ en: 'Name (Bahasa Indonesia)', id: 'Nama (Bahasa Indonesia)' })}</Label>
                  <Input
                    id="cat-name-id"
                    value={catFormData.nameId}
                    onChange={(e) => setCatFormData({ ...catFormData, nameId: e.target.value })}
                    placeholder={t({ en: 'e.g. Konferensi', id: 'mis. Konferensi' })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleSaveCategory} disabled={isSavingCat} className="flex-1">
                  {isSavingCat ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save', id: 'Simpan' })}
                </Button>
                <Button variant="outline" onClick={handleCloseCatModal} disabled={isSavingCat} className="flex-1">
                  {t({ en: 'Cancel', id: 'Batalkan' })}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Event Modal */}
      {isEditingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {editingEvent
                  ? t({ en: 'Edit Event', id: 'Edit Kegiatan' })
                  : t({ en: 'Add New Event', id: 'Tambah Kegiatan Baru' })
                }
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title-en">{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
                  <Input
                    id="event-title-en"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder={t({ en: 'Event title in English', id: 'Judul event dalam English' })}
                  />
                </div>

                <div>
                  <Label htmlFor="event-title-id">{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })}</Label>
                  <Input
                    id="event-title-id"
                    value={formData.titleId}
                    onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                    placeholder={t({ en: 'Event title in Indonesian', id: 'Judul event dalam Indonesia' })}
                  />
                </div>

                <div>
                  <Label htmlFor="event-category">{t({ en: 'Category', id: 'Kategori' })}</Label>
                  {eventCategories.filter((c) => c.active !== false).length > 0 ? (
                    <select
                      id="event-category"
                      value={formData.categoryEn}
                      onChange={(e) => {
                        const selected = eventCategories.find((c) => c.nameEn === e.target.value)
                        if (selected) {
                          setFormData({ ...formData, categoryEn: selected.nameEn, categoryId: selected.nameId })
                        } else {
                          setFormData({ ...formData, categoryEn: '', categoryId: '' })
                        }
                      }}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">{t({ en: '-- Select Category --', id: '-- Pilih Kategori --' })}</option>
                      {eventCategories.filter((c) => c.active !== false).map((cat) => (
                        <option key={cat._id} value={cat.nameEn}>{cat.nameEn} / {cat.nameId}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t({ en: 'No categories available. Add categories in the Event Categories section first.', id: 'Belum ada kategori. Tambahkan kategori di section Kategori Event terlebih dahulu.' })}
                    </p>
                  )}
                  {formData.categoryEn && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      EN: {formData.categoryEn} · ID: {formData.categoryId}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="event-register-link">{t({ en: 'Register Link', id: 'Link Pendaftaran' })}</Label>
                  <Input
                    id="event-register-link"
                    value={formData.registerLink}
                    onChange={(e) => setFormData({ ...formData, registerLink: e.target.value })}
                    placeholder={t({ en: 'https://example.com', id: 'https://contoh.com' })}
                  />
                </div>

                <div>
                  <Label htmlFor="event-image">{t({ en: 'Image', id: 'Gambar' })}</Label>
                  <EventsImageUpload 
                    currentImage={formData.image}
                    onImageUpload={(url) => setFormData({ ...formData, image: url })}
                  />
                </div>

                <div>
                  <Label htmlFor="event-date">{t({ en: 'Date', id: 'Tanggal' })}</Label>
                  <Input
                    id="event-date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder={t({ en: 'e.g. 15 Mar 2026', id: 'mis. 15 Mar 2026' })}
                  />
                </div>

                <div>
                  <Label htmlFor="event-time">{t({ en: 'Time', id: 'Waktu' })}</Label>
                  <Input
                    id="event-time"
                    value={formData.time || ''}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder={t({ en: 'e.g. 08:00 – 17:00 WIB', id: 'mis. 08:00 – 17:00 WIB' })}
                  />
                </div>

                <div>
                  <Label htmlFor="event-location">{t({ en: 'Location', id: 'Tempat' })}</Label>
                  <Input
                    id="event-location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={t({ en: 'e.g. Jakarta Convention Center', id: 'mis. Jakarta Convention Center' })}
                  />
                </div>

                <div>
                  <Label htmlFor="event-published-date">{t({ en: 'Published Date', id: 'Tanggal Publikasi' })}</Label>
                  <Input
                    id="event-published-date"
                    type="date"
                    value={formData.publishedDate || ''}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="event-published"
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="event-published" className="mb-0 cursor-pointer">
                    {t({ en: 'Published', id: 'Dipublikasikan' })}
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleSaveEvent}
                  disabled={isSaving === 'event'}
                  className="flex-1"
                >
                  {isSaving === 'event' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save', id: 'Simpan' })}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSaving === 'event'}
                  className="flex-1"
                >
                  {t({ en: 'Cancel', id: 'Batalkan' })}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

interface EventsImageUploadProps {
  currentImage: string
  onImageUpload: (url: string) => void
}

function EventsImageUpload({ currentImage, onImageUpload }: EventsImageUploadProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { upload, status } = useFileUpload()
  const isUploading = status === 'uploading' || status === 'compressing'

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await upload(file)
      if (result?.url) {
        onImageUpload(result.url)
        toast({
          title: t({ en: 'Success', id: 'Berhasil' }),
          description: t({ en: 'Image uploaded successfully', id: 'Gambar berhasil diupload' }),
        })
      }
    } catch (error) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to upload image', id: 'Gagal mengupload gambar' }),
        variant: 'destructive',
      })
    }
  }, [upload, onImageUpload, t, toast])

  return (
    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
      {currentImage && (
        <div className="mb-2">
          <img src={currentImage} alt="Event preview" className="h-24 w-auto mx-auto rounded object-cover" />
        </div>
      )}
      <input
        id="event-image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={isUploading}
        className="hidden"
      />
      <label htmlFor="event-image" className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="text-xs text-muted-foreground">
          {isUploading 
            ? t({ en: 'Uploading...', id: 'Mengupload...' })
            : t({ en: 'Click to upload', id: 'Klik untuk upload' })
          }
        </div>
      </label>
    </div>
  )
}
