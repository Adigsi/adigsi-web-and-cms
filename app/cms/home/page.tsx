'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, ChevronDown, Upload, X } from 'lucide-react'

interface BannerData {
  titleSmallEn: string
  titleSmallId: string
  titleLargeEn: string
  titleLargeId: string
  descriptionEn: string
  descriptionId: string
  backgroundImage: string
  aboutButtonTextEn: string
  aboutButtonTextId: string
  aboutButtonLink: string
  joinButtonTextEn: string
  joinButtonTextId: string
  joinButtonLink: string
}

export default function CMSHomePage() {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    banner: false,
  })
  const [saveStatus, setSaveStatus] = useState<{
    section: string | null
    type: 'success' | 'error' | null
    message: string
  }>({ section: null, type: null, message: '' })

  const [bannerData, setBannerData] = useState<BannerData>({
    titleSmallEn: '',
    titleSmallId: '',
    titleLargeEn: '',
    titleLargeId: '',
    descriptionEn: '',
    descriptionId: '',
    backgroundImage: '',
    aboutButtonTextEn: '',
    aboutButtonTextId: '',
    aboutButtonLink: '',
    joinButtonTextEn: '',
    joinButtonTextId: '',
    joinButtonLink: '',
  })

  // Fetch banner data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cms/home/banner')
        if (response.ok) {
          const data = await response.json()
          setBannerData(data)
          console.log('Fetched banner data:', data)
        }
      } catch (error) {
        console.error('Error fetching banner data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveStatus({
        section: 'banner',
        type: 'error',
        message: t({ en: 'File size must be less than 5MB', id: 'Ukuran file harus kurang dari 5MB' }),
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setBannerData({ ...bannerData, backgroundImage: base64 })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setIsSaving('banner')
    setSaveStatus({ section: null, type: null, message: '' })

    try {
      const response = await fetch('/api/cms/home/banner', {
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

      setSaveStatus({
        section: 'banner',
        type: 'success',
        message: t({ en: 'Banner saved successfully', id: 'Banner berhasil disimpan' }),
      })

      // Clear success message after 3 seconds
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'Home Page Management', id: 'Manajemen Halaman Home' })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage content sections for the Home page', id: 'Kelola konten section untuk halaman Home' })}
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
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Hero Banner', id: 'Banner Hero' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage the hero banner with titles, description, image and buttons', id: 'Kelola banner hero dengan judul, deskripsi, gambar dan tombol' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.banner ? 'rotate-0' : '-rotate-90'}`}
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

                <div className="space-y-6 mt-4">
                  {/* Background Image Section */}
                  <div>
                    <Label>{t({ en: 'Background Image', id: 'Gambar Latar Belakang' })}</Label>
                    <div className="mt-2 space-y-3">
                      {bannerData.backgroundImage && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={bannerData.backgroundImage}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setBannerData({ ...bannerData, backgroundImage: '' })}
                            className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm text-muted-foreground">
                              {t({ en: 'Upload Image', id: 'Unggah Gambar' })}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Titles Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">{t({ en: 'Titles', id: 'Judul' })}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title-small-en">{t({ en: 'Small Title (EN)', id: 'Judul Kecil (EN)' })}</Label>
                        <Input
                          id="title-small-en"
                          value={bannerData.titleSmallEn}
                          onChange={(e) => setBannerData({ ...bannerData, titleSmallEn: e.target.value })}
                          placeholder={t({ en: 'e.g., WELCOME TO ADIGSI', id: 'cth., SELAMAT DATANG DI ADIGSI' })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="title-small-id">{t({ en: 'Small Title (ID)', id: 'Judul Kecil (ID)' })}</Label>
                        <Input
                          id="title-small-id"
                          value={bannerData.titleSmallId}
                          onChange={(e) => setBannerData({ ...bannerData, titleSmallId: e.target.value })}
                          placeholder={t({ en: 'e.g., SELAMAT DATANG DI ADIGSI', id: 'cth., SELAMAT DATANG DI ADIGSI' })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="title-large-en">{t({ en: 'Large Title (EN)', id: 'Judul Besar (EN)' })}</Label>
                        <Input
                          id="title-large-en"
                          value={bannerData.titleLargeEn}
                          onChange={(e) => setBannerData({ ...bannerData, titleLargeEn: e.target.value })}
                          placeholder={t({ en: "e.g., Safeguarding Indonesia's Digital Future", id: "cth., Mengamankan Masa Depan Digital Indonesia" })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="title-large-id">{t({ en: 'Large Title (ID)', id: 'Judul Besar (ID)' })}</Label>
                        <Input
                          id="title-large-id"
                          value={bannerData.titleLargeId}
                          onChange={(e) => setBannerData({ ...bannerData, titleLargeId: e.target.value })}
                          placeholder={t({ en: 'e.g., Mengamankan Masa Depan Digital Indonesia', id: 'cth., Mengamankan Masa Depan Digital Indonesia' })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">{t({ en: 'Description', id: 'Deskripsi' })}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="desc-en">{t({ en: 'Description (EN)', id: 'Deskripsi (EN)' })}</Label>
                        <textarea
                          id="desc-en"
                          value={bannerData.descriptionEn}
                          onChange={(e) => setBannerData({ ...bannerData, descriptionEn: e.target.value })}
                          placeholder={t({ en: 'Enter description in English', id: 'Masukkan deskripsi dalam English' })}
                          className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="desc-id">{t({ en: 'Description (ID)', id: 'Deskripsi (ID)' })}</Label>
                        <textarea
                          id="desc-id"
                          value={bannerData.descriptionId}
                          onChange={(e) => setBannerData({ ...bannerData, descriptionId: e.target.value })}
                          placeholder={t({ en: 'Enter description in Indonesian', id: 'Masukkan deskripsi dalam Indonesia' })}
                          className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Button Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">{t({ en: 'About Button', id: 'Tombol About' })}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="about-btn-text-en">{t({ en: 'Button Text (EN)', id: 'Teks Tombol (EN)' })}</Label>
                        <Input
                          id="about-btn-text-en"
                          value={bannerData.aboutButtonTextEn}
                          onChange={(e) => setBannerData({ ...bannerData, aboutButtonTextEn: e.target.value })}
                          placeholder="e.g., About Us"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="about-btn-text-id">{t({ en: 'Button Text (ID)', id: 'Teks Tombol (ID)' })}</Label>
                        <Input
                          id="about-btn-text-id"
                          value={bannerData.aboutButtonTextId}
                          onChange={(e) => setBannerData({ ...bannerData, aboutButtonTextId: e.target.value })}
                          placeholder="cth., Tentang Kami"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="about-btn-link">{t({ en: 'Button Link', id: 'Link Tombol' })}</Label>
                        <Input
                          id="about-btn-link"
                          value={bannerData.aboutButtonLink}
                          onChange={(e) => setBannerData({ ...bannerData, aboutButtonLink: e.target.value })}
                          placeholder="e.g., /about"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Join Button Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">{t({ en: 'Join Button', id: 'Tombol Bergabung' })}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="join-btn-text-en">{t({ en: 'Button Text (EN)', id: 'Teks Tombol (EN)' })}</Label>
                        <Input
                          id="join-btn-text-en"
                          value={bannerData.joinButtonTextEn}
                          onChange={(e) => setBannerData({ ...bannerData, joinButtonTextEn: e.target.value })}
                          placeholder="e.g., Join Now"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="join-btn-text-id">{t({ en: 'Button Text (ID)', id: 'Teks Tombol (ID)' })}</Label>
                        <Input
                          id="join-btn-text-id"
                          value={bannerData.joinButtonTextId}
                          onChange={(e) => setBannerData({ ...bannerData, joinButtonTextId: e.target.value })}
                          placeholder="cth., Bergabung Sekarang"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="join-btn-link">{t({ en: 'Button Link', id: 'Link Tombol' })}</Label>
                        <Input
                          id="join-btn-link"
                          value={bannerData.joinButtonLink}
                          onChange={(e) => setBannerData({ ...bannerData, joinButtonLink: e.target.value })}
                          placeholder="e.g., https://forms.example.com"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSave} disabled={isSaving === 'banner'} className="w-full">
                    {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
