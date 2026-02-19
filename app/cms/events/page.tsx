'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, CheckCircle2, AlertCircle, Edit2, Trash2, Plus, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/contexts/language-context'

interface BannerData {
  titleEn: string
  titleId: string
  imageUrl: string
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
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    banner: false,
    events: false,
  })
  const [saveStatus, setSaveStatus] = useState<{
    section: string | null
    type: 'success' | 'error' | null
    message: string
  }>({ section: null, type: null, message: '' })

  // Banner section state
  const [bannerData, setBannerData] = useState<BannerData>({
    titleEn: 'Adigsi Activity Agenda',
    titleId: 'Agenda Kegiatan Adigsi',
    imageUrl: '/images/about-banner.jpg',
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
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [formData, setFormData] = useState<EventData>({
    titleEn: '',
    titleId: '',
    categoryEn: '',
    categoryId: '',
    image: '',
    registerLink: '',
    published: true,
  })

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
            imageUrl: data.imageUrl || '',
          })
          setOriginalBannerData({
            titleEn: data.titleEn || '',
            titleId: data.titleId || '',
            imageUrl: data.imageUrl || '',
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
    if (expandedSections.events) {
      fetchEvents(1)
      fetchCategories()
    }
  }, [expandedSections.events])

  // Auto-fetch when filters change
  useEffect(() => {
    if (expandedSections.events && (categoryFilter || publishedFilter)) {
      setCurrentPage(1)
      fetchEvents(1)
    }
  }, [categoryFilter, publishedFilter])

  // Debounced search
  useEffect(() => {
    if (!expandedSections.events) return

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
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
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
    setSaveStatus({ section: null, type: null, message: '' })

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

      setSaveStatus({
        section: 'banner',
        type: 'success',
        message: t({ en: 'Banner saved successfully', id: 'Banner berhasil disimpan' }),
      })

      setTimeout(() => {
        setSaveStatus({ section: null, type: null, message: '' })
      }, 3000)
    } catch (error) {
      console.error('Error saving banner:', error)
      setSaveStatus({
        section: 'banner',
        type: 'error',
        message: error instanceof Error ? error.message : t({ en: 'Failed to save changes', id: 'Gagal menyimpan perubahan' }),
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
    })
  }

  const handleSaveEvent = async () => {
    if (!formData.titleEn || !formData.titleId || !formData.image || !formData.categoryEn || !formData.categoryId || !formData.registerLink) {
      setSaveStatus({
        section: 'event-form',
        type: 'error',
        message: t({ en: 'All fields are required', id: 'Semua field harus diisi' }),
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

      setSaveStatus({
        section: 'events',
        type: 'success',
        message: editingEvent
          ? t({ en: 'Event updated successfully', id: 'Event berhasil diperbarui' })
          : t({ en: 'Event created successfully', id: 'Event berhasil dibuat' }),
      })

      handleCloseModal()
      fetchEvents(1)
      fetchCategories() // Refresh categories

      setTimeout(() => {
        setSaveStatus({ section: null, type: null, message: '' })
      }, 3000)
    } catch (error) {
      console.error('Error saving event:', error)
      setSaveStatus({
        section: 'event-form',
        type: 'error',
        message: error instanceof Error ? error.message : t({ en: 'Failed to save event', id: 'Gagal menyimpan event' }),
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

      setSaveStatus({
        section: 'events',
        type: 'success',
        message: t({ en: 'Event deleted successfully', id: 'Event berhasil dihapus' }),
      })

      fetchEvents(currentPage)
      fetchCategories() // Refresh categories

      setTimeout(() => {
        setSaveStatus({ section: null, type: null, message: '' })
      }, 3000)
    } catch (error) {
      console.error('Error deleting event:', error)
      setSaveStatus({
        section: 'events',
        type: 'error',
        message: t({ en: 'Failed to delete event', id: 'Gagal menghapus event' }),
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

      setSaveStatus({
        section: 'events',
        type: 'success',
        message: t({ en: 'Event status updated', id: 'Status event berhasil diperbarui' }),
      })

      fetchEvents(currentPage)

      setTimeout(() => {
        setSaveStatus({ section: null, type: null, message: '' })
      }, 3000)
    } catch (error) {
      console.error('Error updating event status:', error)
      setSaveStatus({
        section: 'events',
        type: 'error',
        message: t({ en: 'Failed to update event status', id: 'Gagal memperbarui status event' }),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'Events Page Management', id: 'Manajemen Halaman Events' })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage content sections for the Events page', id: 'Kelola konten section untuk halaman Events' })}
        </p>
      </div>

      {isLoading ? (
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            {t({ en: 'Loading...', id: 'Memuat...' })}
          </div>
        </Card>
      ) : (
        <>
          {/* Banner Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, banner: !expandedSections.banner })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Banner', id: 'Banner' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage the banner section with title and image', id: 'Kelola section banner dengan judul dan gambar' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.banner ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.banner && (
              <>
                {saveStatus.section === 'banner' && saveStatus.type && (
                  <Alert className={`${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    {saveStatus.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                      {saveStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="banner-image">{t({ en: 'Banner Image', id: 'Gambar Banner' })}</Label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        {bannerData.imageUrl && (
                          <div className="mb-4">
                            <img src={bannerData.imageUrl} alt="Banner preview" className="h-32 w-auto mx-auto rounded object-cover" />
                          </div>
                        )}
                        <input
                          id="banner-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setBannerData({ ...bannerData, imageUrl: reader.result as string })
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                        />
                        <label htmlFor="banner-image" className="cursor-pointer">
                          <div className="text-sm text-muted-foreground">
                            {t({ en: 'Click to upload or drag and drop', id: 'Klik untuk upload atau drag and drop' })}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {t({ en: 'PNG, JPG, GIF up to 10MB', id: 'PNG, JPG, GIF hingga 10MB' })}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

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

                  <Button onClick={handleSaveBanner} disabled={isSaving === 'banner' || !hasChanges(bannerData, originalBannerData)}>
                    {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                  </Button>
                  {hasChanges(bannerData, originalBannerData) && (
                    <Button
                      variant="outline"
                      onClick={handleCancelBanner}
                      disabled={isSaving === 'banner'}
                      className='ml-4'
                    >
                      {t({ en: 'Cancel Changes', id: 'Batalkan Perubahan' })}
                    </Button>
                  )}
                </div>
              </>
            )}
          </Card>

          {/* Events Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, events: !expandedSections.events })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Events', id: 'Event' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage event listings with publish/unpublish controls', id: 'Kelola daftar event dengan kontrol publish/unpublish' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.events ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.events && (
              <>
                {saveStatus.section === 'events' && saveStatus.type && (
                  <Alert className={`${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    {saveStatus.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                      {saveStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                {saveStatus.section === 'event-form' && saveStatus.type && (
                  <Alert className={`${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    {saveStatus.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                      {saveStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 mt-4">
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
                            <option key={cat} value={cat}>{cat}</option>
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
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <Switch
                                  checked={event.published}
                                  onCheckedChange={() => handleTogglePublish(event._id!, event.published)}
                                />
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  event.published
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
              </>
            )}
          </Card>
        </>
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

      {/* Event Modal */}
      {isEditingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
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
                  <Label htmlFor="event-category-en">{t({ en: 'Category (English)', id: 'Kategori (English)' })}</Label>
                  <Input
                    id="event-category-en"
                    value={formData.categoryEn}
                    onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                    placeholder={t({ en: 'Event category in English', id: 'Kategori event dalam English' })}
                  />
                </div>

                <div>
                  <Label htmlFor="event-category-id">{t({ en: 'Category (Bahasa Indonesia)', id: 'Kategori (Bahasa Indonesia)' })}</Label>
                  <Input
                    id="event-category-id"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    placeholder={t({ en: 'Event category in Indonesian', id: 'Kategori event dalam Indonesia' })}
                  />
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
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    {formData.image && (
                      <div className="mb-2">
                        <img src={formData.image} alt="Event preview" className="h-24 w-auto mx-auto rounded object-cover" />
                      </div>
                    )}
                    <input
                      id="event-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setFormData({ ...formData, image: reader.result as string })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="event-image" className="cursor-pointer">
                      <div className="text-xs text-muted-foreground">
                        {t({ en: 'Click to upload', id: 'Klik untuk upload' })}
                      </div>
                    </label>
                  </div>
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
    </div>
  )
}
