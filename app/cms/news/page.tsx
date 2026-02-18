'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLanguage } from '@/contexts/language-context'

interface BannerData {
  titleEn: string
  titleId: string
  imageUrl: string
}

export default function CMSNewsPage() {
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

  // Banner section state
  const [bannerData, setBannerData] = useState<BannerData>({
    titleEn: 'Latest News',
    titleId: 'Berita Terbaru',
    imageUrl: '/images/about-banner.jpg',
  })

  const [originalBannerData, setOriginalBannerData] = useState<BannerData>(bannerData)

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
        </>
      )}
    </div>
  )
}
