'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2, Plus, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'

interface BannerData {
  titleEn: string
  titleId: string
}

interface NewsData {
  _id?: string
  slug?: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  contentEn: string
  contentId: string
  image: string
  published: boolean
  publishedDate?: string
  createdAt?: string
}

interface NewsCategory {
  _id: string
  nameEn: string
  nameId: string
  active: boolean
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
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('banner')

  // Banner section state
  const [bannerData, setBannerData] = useState<BannerData>({
    titleEn: 'Latest News',
    titleId: 'Berita Terbaru',
  })

  const [originalBannerData, setOriginalBannerData] = useState<BannerData>(bannerData)

  // News section state
  const [news, setNews] = useState<NewsData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [publishedFilter, setPublishedFilter] = useState('')
  const [availableCategories, setAvailableCategories] = useState<NewsCategory[]>([])
  const [newsCategories, setNewsCategories] = useState<NewsCategory[]>([])
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<NewsCategory | null>(null)
  const [catFormData, setCatFormData] = useState({ nameEn: '', nameId: '' })
  const [isSavingCat, setIsSavingCat] = useState(false)

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

  const hasChanges = (current: any, original: any): boolean => {
    return JSON.stringify(current) !== JSON.stringify(original)
  }

  const handleCancelBanner = () => {
    setBannerData(originalBannerData)
  }

  const handleSaveBanner = async () => {
    setIsSaving('banner')

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

  // Fetch news
  const fetchNews = async (page: number) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(publishedFilter && { published: publishedFilter }),
      })

      const response = await fetch(`/api/cms/news/news?${params}`)
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
    if (activeTab === 'news') {
      fetchNews(1)
      fetchCategories()
    }
  }, [activeTab])

  // Auto-fetch when filters change
  useEffect(() => {
    if (activeTab === 'news' && (categoryFilter || publishedFilter)) {
      setCurrentPage(1)
      fetchNews(1)
    }
  }, [categoryFilter, publishedFilter])

  // Debounced search
  useEffect(() => {
    if (activeTab !== 'news') return

    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        setCurrentPage(1)
        fetchNews(1)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/cms/news/categories')
      if (response.ok) {
        const data = await response.json()
        setAvailableCategories(data.categories || [])
        setNewsCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories()
    }
  }, [activeTab])

  const handleOpenCatModal = (category?: NewsCategory) => {
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
        response = await fetch(`/api/cms/news/categories?id=${editingCategory._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catFormData),
        })
      } else {
        response = await fetch('/api/cms/news/categories', {
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
      const response = await fetch(`/api/cms/news/categories?id=${id}`, { method: 'DELETE' })
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
      const response = await fetch(`/api/cms/news/categories?id=${id}`, {
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
      const response = await fetch(`/api/cms/news/news?page=1`)
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

      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: t({ en: 'News deleted successfully', id: 'Berita berhasil dihapus' }),
      })

      fetchNews(currentPage)
      fetchCategories() // Refresh categories
    } catch (error) {
      console.error('Error deleting news:', error)
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Failed to delete news', id: 'Gagal menghapus berita' }),
        variant: 'destructive',
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

      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: t({ en: 'News status updated', id: 'Status berita berhasil diperbarui' }),
      })

      fetchNews(currentPage)
    } catch (error) {
      console.error('Error updating news status:', error)
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Failed to update news status', id: 'Gagal memperbarui status berita' }),
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t({ en: 'News Page Management', id: 'Manajemen Halaman News' })}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t({ en: 'Manage content sections for the News page', id: 'Kelola konten section untuk halaman News' })}
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
            <h1 className="text-2xl font-bold text-foreground">{t({ en: 'News Page Management', id: 'Manajemen Halaman News' })}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t({ en: 'Manage content sections for the News page', id: 'Kelola konten section untuk halaman News' })}
            </p>
            <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-primary/10 p-1 rounded-md mt-3">
              <TabsTrigger value="banner">{t({ en: 'Page Title', id: 'Judul Halaman' })}</TabsTrigger>
              <TabsTrigger value="categories">{t({ en: 'Categories', id: 'Kategori' })}</TabsTrigger>
              <TabsTrigger value="news">{t({ en: 'News', id: 'Berita' })}</TabsTrigger>
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

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="p-6">
              <div className="space-y-4">
                <Button onClick={() => handleOpenCatModal()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t({ en: 'Add Category', id: 'Tambah Kategori' })}
                </Button>

                {newsCategories.length === 0 ? (
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
                        {newsCategories.map((cat) => (
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

          {/* News Tab */}
          <TabsContent value="news">
            <Card className="p-6">
              <div className="mb-4">
                <Button onClick={() => router.push('/cms/news/form')}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t({ en: 'Add News', id: 'Tambah Berita' })}
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="mt-4 space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t({ en: 'Search news by title...', id: 'Cari berita berdasarkan judul...' })}
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
                      <option value="true">{t({ en: 'Published', id: 'Diterbitkan' })}</option>
                      <option value="false">{t({ en: 'Draft', id: 'Draft' })}</option>
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

              {news.length > 0 ? (
                <>
                  <div className="mt-4 border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            {t({ en: 'Title', id: 'Judul' })}
                          </th>
                          {/* <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                              {t({ en: 'Slug', id: 'Slug' })}
                            </th> */}
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            {t({ en: 'Category', id: 'Kategori' })}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            {t({ en: 'Published Date', id: 'Tanggal Publikasi' })}
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
                            {/* <td className="px-4 py-3">
                                <div className="text-sm text-muted-foreground font-mono">
                                  {newsItem.slug}
                                </div>
                              </td> */}
                            <td className="px-4 py-3">
                              <div className="text-sm text-foreground">
                                <span className="font-bold">EN:</span> {newsItem.categoryEn}
                              </div>
                              <div className="text-sm text-foreground mt-1">
                                <span className="font-bold">ID:</span> {newsItem.categoryId}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-muted-foreground">
                                {newsItem.publishedDate
                                  ? new Date(newsItem.publishedDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                                  : <span className="text-xs italic text-muted-foreground">{t({ en: 'Not set', id: 'Belum diset' })}</span>}
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
                                  onClick={() => router.push(`/cms/news/form?id=${newsItem._id}`)}
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
            </Card>
          </TabsContent>
        </Tabs>
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
                    placeholder={t({ en: 'e.g. Technology', id: 'mis. Teknologi' })}
                  />
                </div>
                <div>
                  <Label htmlFor="cat-name-id">{t({ en: 'Name (Bahasa Indonesia)', id: 'Nama (Bahasa Indonesia)' })}</Label>
                  <Input
                    id="cat-name-id"
                    value={catFormData.nameId}
                    onChange={(e) => setCatFormData({ ...catFormData, nameId: e.target.value })}
                    placeholder={t({ en: 'e.g. Teknologi', id: 'mis. Teknologi' })}
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
    </>
  )
}
