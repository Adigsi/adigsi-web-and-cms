'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, CheckCircle2, AlertCircle, Edit2, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/language-context'

interface BannerData {
  titleEn: string
  titleId: string
  imageUrl: string
}

interface NewsData {
  _id?: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  contentEn: string
  contentId: string
  image: string
  readTimeEn: string
  readTimeId: string
  sourceUrl?: string
  published: boolean
}

interface NewsResponse {
  success: boolean
  data: NewsData[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function CMSNewsPage() {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    banner: false,
    news: false,
  })
  const [saveStatus, setSaveStatus] = useState<{
    section: string | null
    type: 'success' | 'error' | null
    message: string
  }>({ section: null, type: null, message: '' })

  // Banner section state
  const [bannerData, setBannerData] = useState<BannerData>({
    titleEn: 'Latest News',
    titleId: 'Berita Terbaru',
    imageUrl: '/images/about-banner.jpg',
  })

  const [originalBannerData, setOriginalBannerData] = useState<BannerData>(bannerData)

  // News section state
  const [news, setNews] = useState<NewsData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isEditingModal, setIsEditingModal] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsData | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formData, setFormData] = useState<NewsData>({
    titleEn: '',
    titleId: '',
    categoryEn: '',
    categoryId: '',
    contentEn: '',
    contentId: '',
    image: '',
    readTimeEn: '',
    readTimeId: '',
    sourceUrl: '',
    published: true,
  })

  // Fetch banner data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannerRes = await fetch('/api/cms/news/banner')

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
      const response = await fetch('/api/cms/news/banner', {
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

  // Fetch news
  const fetchNews = async (page: number) => {
    try {
      const response = await fetch(`/api/cms/news/news?page=${page}`)
      if (response.ok) {
        const data: NewsResponse = await response.json()
        setNews(data.data)
        setCurrentPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }

  useEffect(() => {
    if (expandedSections.news) {
      fetchNews(1)
    }
  }, [expandedSections.news])

  const handleOpenModal = (newsItem?: NewsData) => {
    if (newsItem) {
      setEditingNews(newsItem)
      setFormData(newsItem)
    } else {
      setEditingNews(null)
      setFormData({
        titleEn: '',
        titleId: '',
        categoryEn: '',
        categoryId: '',
        contentEn: '',
        contentId: '',
        image: '',
        readTimeEn: '',
        readTimeId: '',
        sourceUrl: '',
        published: true,
      })
    }
    setIsEditingModal(true)
  }

  const handleCloseModal = () => {
    setIsEditingModal(false)
    setEditingNews(null)
    setFormData({
      titleEn: '',
      titleId: '',
      categoryEn: '',
      categoryId: '',
      contentEn: '',
      contentId: '',
      image: '',
      readTimeEn: '',
      readTimeId: '',
      sourceUrl: '',
      published: true,
    })
  }

  const handleSaveNews = async () => {
    if (!formData.titleEn || !formData.titleId || !formData.categoryEn || !formData.categoryId || 
        !formData.contentEn || !formData.contentId || !formData.image || !formData.readTimeEn || !formData.readTimeId) {
      setSaveStatus({
        section: 'news-form',
        type: 'error',
        message: t({ en: 'All fields are required', id: 'Semua field harus diisi' }),
      })
      return
    }

    setIsSaving('news')

    try {
      const response = await fetch('/api/cms/news/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save news')
      }

      setSaveStatus({
        section: 'news',
        type: 'success',
        message: editingNews
          ? t({ en: 'News updated successfully', id: 'Berita berhasil diperbarui' })
          : t({ en: 'News created successfully', id: 'Berita berhasil dibuat' }),
      })

      handleCloseModal()
      fetchNews(1)

      setTimeout(() => {
        setSaveStatus({ section: null, type: null, message: '' })
      }, 3000)
    } catch (error) {
      console.error('Error saving news:', error)
      setSaveStatus({
        section: 'news-form',
        type: 'error',
        message: error instanceof Error ? error.message : t({ en: 'Failed to save news', id: 'Gagal menyimpan berita' }),
      })
    } finally {
      setIsSaving(null)
    }
  }

  const handleDeleteNews = async (id: string) => {
    if (!confirm(t({ en: 'Are you sure you want to delete this news?', id: 'Apakah Anda yakin ingin menghapus berita ini?' }))) {
      return
    }

    try {
      const response = await fetch(`/api/cms/news/news?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete news')
      }

      setSaveStatus({
        section: 'news',
        type: 'success',
        message: t({ en: 'News deleted successfully', id: 'Berita berhasil dihapus' }),
      })

      fetchNews(currentPage)

      setTimeout(() => {
        setSaveStatus({ section: null, type: null, message: '' })
      }, 3000)
    } catch (error) {
      console.error('Error deleting news:', error)
      setSaveStatus({
        section: 'news',
        type: 'error',
        message: t({ en: 'Failed to delete news', id: 'Gagal menghapus berita' }),
      })
    }
  }

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/cms/news/news?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      })

      if (!response.ok) {
        throw new Error('Failed to update news status')
      }

      setSaveStatus({
        section: 'news',
        type: 'success',
        message: t({ en: 'News status updated', id: 'Status berita berhasil diperbarui' }),
      })

      fetchNews(currentPage)

      setTimeout(() => {
        setSaveStatus({ section: null, type: null, message: '' })
      }, 3000)
    } catch (error) {
      console.error('Error updating news status:', error)
      setSaveStatus({
        section: 'news',
        type: 'error',
        message: t({ en: 'Failed to update news status', id: 'Gagal memperbarui status berita' }),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'News Page Management', id: 'Manajemen Halaman News' })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage content sections for the News page', id: 'Kelola konten section untuk halaman News' })}
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

          {/* News Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, news: !expandedSections.news })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'News', id: 'Berita' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage news articles with bilingual support', id: 'Kelola artikel berita dengan dukungan bilingual' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.news ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.news && (
              <>
                {saveStatus.section === 'news' && saveStatus.type && (
                  <Alert className={`mt-4 ${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
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

                <div className="mt-4">
                  <Button onClick={() => handleOpenModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t({ en: 'Add News', id: 'Tambah Berita' })}
                  </Button>
                </div>

                {news.length > 0 ? (
                  <>
                    <div className="mt-4 border border-border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                              {t({ en: 'Title', id: 'Judul' })}
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                              {t({ en: 'Category', id: 'Kategori' })}
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                              {t({ en: 'Read Time', id: 'Waktu Baca' })}
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                              {t({ en: 'Status', id: 'Status' })}
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                              {t({ en: 'Actions', id: 'Aksi' })}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {news.map((newsItem) => (
                            <tr key={newsItem._id} className="hover:bg-muted/50">
                              <td className="px-4 py-3">
                                <div className="flex items-start gap-3">
                                  {newsItem.image && (
                                    <img
                                      src={newsItem.image}
                                      alt={newsItem.titleEn}
                                      className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                                      onClick={() => setPreviewImage(newsItem.image)}
                                    />
                                  )}
                                  <div>
                                    <div className="text-sm font-medium text-foreground">
                                      <span className="font-bold">EN:</span> {newsItem.titleEn}
                                    </div>
                                    <div className="text-sm font-medium text-foreground mt-1">
                                      <span className="font-bold">ID:</span> {newsItem.titleId}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm text-foreground">
                                  <span className="font-bold">EN:</span> {newsItem.categoryEn}
                                </div>
                                <div className="text-sm text-foreground mt-1">
                                  <span className="font-bold">ID:</span> {newsItem.categoryId}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm text-foreground">
                                  <span className="font-bold">EN:</span> {newsItem.readTimeEn}
                                </div>
                                <div className="text-sm text-foreground mt-1">
                                  <span className="font-bold">ID:</span> {newsItem.readTimeId}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={newsItem.published}
                                    onCheckedChange={() => handleTogglePublish(newsItem._id!, newsItem.published)}
                                  />
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${newsItem.published
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {newsItem.published
                                      ? t({ en: 'Published', id: 'Diterbitkan' })
                                      : t({ en: 'Draft', id: 'Draft' })}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenModal(newsItem)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteNews(newsItem._id!)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {t({ en: `Page ${currentPage} of ${totalPages}`, id: `Halaman ${currentPage} dari ${totalPages}` })}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchNews(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          {t({ en: 'Previous', id: 'Sebelumnya' })}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchNews(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          {t({ en: 'Next', id: 'Selanjutnya' })}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-center py-8 text-muted-foreground">
                    {t({ en: 'No news found', id: 'Tidak ada berita' })}
                  </div>
                )}
              </>
            )}
          </Card>
        </>
      )}

      {/* News Modal */}
      {isEditingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingNews
                ? t({ en: 'Edit News', id: 'Edit Berita' })
                : t({ en: 'Add News', id: 'Tambah Berita' })}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="news-title-en">{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
                <Input
                  id="news-title-en"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder={t({ en: 'Enter title in English', id: 'Masukkan judul dalam English' })}
                />
              </div>

              <div>
                <Label htmlFor="news-title-id">{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })}</Label>
                <Input
                  id="news-title-id"
                  value={formData.titleId}
                  onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                  placeholder={t({ en: 'Enter title in Indonesian', id: 'Masukkan judul dalam Indonesia' })}
                />
              </div>

              <div>
                <Label htmlFor="news-category-en">{t({ en: 'Category (English)', id: 'Kategori (English)' })}</Label>
                <Input
                  id="news-category-en"
                  value={formData.categoryEn}
                  onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                  placeholder={t({ en: 'Enter category in English', id: 'Masukkan kategori dalam English' })}
                />
              </div>

              <div>
                <Label htmlFor="news-category-id">{t({ en: 'Category (Bahasa Indonesia)', id: 'Kategori (Bahasa Indonesia)' })}</Label>
                <Input
                  id="news-category-id"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  placeholder={t({ en: 'Enter category in Indonesian', id: 'Masukkan kategori dalam Indonesia' })}
                />
              </div>

              <div>
                <Label htmlFor="news-content-en">{t({ en: 'Content (English)', id: 'Konten (English)' })}</Label>
                <Textarea
                  id="news-content-en"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder={t({ en: 'Enter content in English', id: 'Masukkan konten dalam English' })}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="news-content-id">{t({ en: 'Content (Bahasa Indonesia)', id: 'Konten (Bahasa Indonesia)' })}</Label>
                <Textarea
                  id="news-content-id"
                  value={formData.contentId}
                  onChange={(e) => setFormData({ ...formData, contentId: e.target.value })}
                  placeholder={t({ en: 'Enter content in Indonesian', id: 'Masukkan konten dalam Indonesia' })}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="news-image">{t({ en: 'Image', id: 'Gambar' })}</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    {formData.image && (
                      <div className="mb-4">
                        <img src={formData.image} alt="Preview" className="h-32 w-auto mx-auto rounded object-cover" />
                      </div>
                    )}
                    <input
                      id="news-image"
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
                    <label htmlFor="news-image" className="cursor-pointer">
                      <div className="text-sm text-muted-foreground">
                        {t({ en: 'Click to upload image', id: 'Klik untuk upload gambar' })}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="news-readtime-en">{t({ en: 'Read Time (English)', id: 'Waktu Baca (English)' })}</Label>
                <Input
                  id="news-readtime-en"
                  value={formData.readTimeEn}
                  onChange={(e) => setFormData({ ...formData, readTimeEn: e.target.value })}
                  placeholder={t({ en: 'e.g., 5 min read', id: 'e.g., 5 min read' })}
                />
              </div>

              <div>
                <Label htmlFor="news-readtime-id">{t({ en: 'Read Time (Bahasa Indonesia)', id: 'Waktu Baca (Bahasa Indonesia)' })}</Label>
                <Input
                  id="news-readtime-id"
                  value={formData.readTimeId}
                  onChange={(e) => setFormData({ ...formData, readTimeId: e.target.value })}
                  placeholder={t({ en: 'e.g., 5 menit baca', id: 'e.g., 5 menit baca' })}
                />
              </div>

              <div>
                <Label htmlFor="news-source-url">{t({ en: 'Source URL (Optional)', id: 'URL Sumber (Opsional)' })}</Label>
                <Input
                  id="news-source-url"
                  value={formData.sourceUrl || ''}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  placeholder={t({ en: 'Enter source URL', id: 'Masukkan URL sumber' })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="news-published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="news-published">{t({ en: 'Published', id: 'Diterbitkan' })}</Label>
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCloseModal}>
                {t({ en: 'Cancel', id: 'Batal' })}
              </Button>
              <Button onClick={handleSaveNews}>
                {t({ en: 'Save', id: 'Simpan' })}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[calc(100vh-120px)] top-20">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20"
              onClick={() => setPreviewImage(null)}
            >
              <span className="text-white text-xl">×</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
