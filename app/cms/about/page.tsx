'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/language-context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function CMSAboutPage() {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<{
    section: string | null
    type: 'success' | 'error' | null
    message: string
  }>({ section: null, type: null, message: '' })

  // Banner section state
  const [bannerData, setBannerData] = useState({
    titleEn: 'About ADIGSI',
    titleId: 'Tentang ADIGSI',
    imageUrl: '/images/about-banner.jpg',
  })

  // Organization Structure section state
  const [orgData, setOrgData] = useState({
    title: 'Organization Structure',
    description: 'Our organizational structure...',
  })

  // About ADIGSI section state
  const [aboutData, setAboutData] = useState({
    title: 'About ADIGSI',
    description: 'ADIGSI is an organization dedicated to...',
    highlights: 'Key highlights of our organization',
  })

  // Partners section state
  const [partnersData, setPartnersData] = useState({
    title: 'Our Partners',
    description: 'We collaborate with leading organizations',
  })

  // Fetch banner data on mount
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch('/api/cms/about/banner')
        if (response.ok) {
          const data = await response.json()
          setBannerData({
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

    fetchBannerData()
  }, [])

  const handleSave = async (section: string) => {
    setIsSaving(section)
    setSaveStatus({ section: null, type: null, message: '' })

    try {
      if (section === 'banner') {
        const response = await fetch('/api/cms/about/banner', {
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
      } else {
        // Handle other sections (to be implemented)
        const sectionData: Record<string, unknown> = {
          organization: orgData,
          about: aboutData,
          partners: partnersData,
        }

        console.log(`Saving ${section}:`, sectionData[section])
      }
    } catch (error) {
      console.error(`Error saving ${section}:`, error)
      setSaveStatus({
        section,
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
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'About Page Management', id: 'Manajemen Halaman About' })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage content sections for the About page', id: 'Kelola konten section untuk halaman About' })}
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
            <div className="mb-6 border-b border-border pb-4">
              <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Banner', id: 'Banner' })}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t({ en: 'Manage the banner section with title and image', id: 'Kelola section banner dengan judul dan gambar' })}
              </p>
            </div>

            {saveStatus.section === 'banner' && saveStatus.type && (
              <Alert className={`mb-4 ${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
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

        <div className="space-y-4">
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

          <Button onClick={() => handleSave('banner')} disabled={isSaving === 'banner'}>
            {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </Card>

      {/* Organization Section */}
      <Card className="p-6">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Organization Structure', id: 'Struktur Organisasi' })}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({ en: 'Manage the organization structure section', id: 'Kelola section struktur organisasi' })}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="org-title">{t({ en: 'Title', id: 'Judul' })}</Label>
            <Input
              id="org-title"
              value={orgData.title}
              onChange={(e) => setOrgData({ ...orgData, title: e.target.value })}
              placeholder={t({ en: 'Enter section title', id: 'Masukkan judul section' })}
            />
          </div>

          <div>
            <Label htmlFor="org-description">{t({ en: 'Description', id: 'Deskripsi' })}</Label>
            <Textarea
              id="org-description"
              value={orgData.description}
              onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
              placeholder={t({ en: 'Enter organization structure description', id: 'Masukkan deskripsi struktur organisasi' })}
              rows={5}
            />
          </div>

          <Button onClick={() => handleSave('organization')} disabled={isSaving === 'organization'}>
            {isSaving === 'organization' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </Card>

      {/* About ADIGSI Section */}
      <Card className="p-6">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-foreground">{t({ en: 'About ADIGSI', id: 'Tentang ADIGSI' })}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({ en: 'Manage the ADIGSI information section', id: 'Kelola section informasi ADIGSI' })}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="about-title">{t({ en: 'Title', id: 'Judul' })}</Label>
            <Input
              id="about-title"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              placeholder={t({ en: 'Enter section title', id: 'Masukkan judul section' })}
            />
          </div>

          <div>
            <Label htmlFor="about-description">{t({ en: 'Description', id: 'Deskripsi' })}</Label>
            <Textarea
              id="about-description"
              value={aboutData.description}
              onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
              placeholder={t({ en: 'Enter about ADIGSI description', id: 'Masukkan deskripsi tentang ADIGSI' })}
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="about-highlights">{t({ en: 'Highlights', id: 'Highlight' })}</Label>
            <Textarea
              id="about-highlights"
              value={aboutData.highlights}
              onChange={(e) => setAboutData({ ...aboutData, highlights: e.target.value })}
              placeholder={t({ en: 'Enter key highlights (one per line)', id: 'Masukkan highlight utama (satu per baris)' })}
              rows={4}
            />
          </div>

          <Button onClick={() => handleSave('about')} disabled={isSaving === 'about'}>
            {isSaving === 'about' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </Card>

      {/* Partners Section */}
      <Card className="p-6">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Partners', id: 'Mitra' })}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({ en: 'Manage the partners section', id: 'Kelola section mitra' })}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="partners-title">{t({ en: 'Title', id: 'Judul' })}</Label>
            <Input
              id="partners-title"
              value={partnersData.title}
              onChange={(e) => setPartnersData({ ...partnersData, title: e.target.value })}
              placeholder={t({ en: 'Enter section title', id: 'Masukkan judul section' })}
            />
          </div>

          <div>
            <Label htmlFor="partners-description">{t({ en: 'Description', id: 'Deskripsi' })}</Label>
            <Textarea
              id="partners-description"
              value={partnersData.description}
              onChange={(e) => setPartnersData({ ...partnersData, description: e.target.value })}
              placeholder={t({ en: 'Enter partners description', id: 'Masukkan deskripsi mitra' })}
              rows={5}
            />
          </div>

          <Button onClick={() => handleSave('partners')} disabled={isSaving === 'partners'}>
            {isSaving === 'partners' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </Card>
        </>
      )}
    </div>
  )
}
