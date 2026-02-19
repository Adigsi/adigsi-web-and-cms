'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { CyberIcon } from '@/components/ui/cyber-icon'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CheckCircle2, AlertCircle, ChevronDown, Trash2, Check } from 'lucide-react'

interface BannerData {
  titleEn: string
  titleId: string
  imageUrl: string
}

interface MemberCategory {
  titleEn: string
  titleId: string
  count: number
  icon: string
}

interface DigitalCategory {
  nameEn: string
  nameId: string
  count: number
  icon: string
}

interface MemberCategoriesData {
  categories: MemberCategory[]
}

interface DigitalCategoriesData {
  categories: DigitalCategory[]
}

interface HeadingData {
  subtitleEn: string
  subtitleId: string
  titleEn: string
  titleId: string
}

// Custom Icon Picker Component
function IconPicker({
  value,
  onChange
}: {
  value: string
  onChange: (icon: string) => void
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          className="w-full h-8 px-2 border border-input rounded-md bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring flex items-center gap-2 justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="text-muted-foreground shrink-0">
              <CyberIcon type={value} />
            </div>
            <span className="text-foreground capitalize truncate text-xs">{value}</span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-3">
        <div className="grid grid-cols-10 gap-2">
          {ICON_OPTIONS.map((iconType) => (
            <button
              key={iconType}
              onClick={() => {
                onChange(iconType)
                setOpen(false)
              }}
              className={`p-2 rounded border transition-all flex flex-col items-center justify-center gap-1 text-xs capitalize hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 ${value === iconType
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-muted hover:border-gray-400'
                }`}
              title={iconType}
            >
              <div className="text-muted-foreground">{value === iconType && <Check className="h-3 w-3 text-blue-500" />}</div>
              <div className="shrink-0">
                <CyberIcon type={iconType} />
              </div>
              <span className="text-[10px] text-center">{iconType.substring(0, 5)}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const ICON_OPTIONS = [
  // Cybersecurity Icons (28)
  'network', 'web', 'endpoint', 'app', 'mssp', 'data', 'mobile', 'risk',
  'secops', 'threat', 'identity', 'digitalrisk', 'blockchain', 'iot',
  'messaging', 'consulting', 'fraud', 'cloud', 'server', 'database',
  'firewall', 'vpn', 'encryption', 'malware', 'virus', 'monitoring',
  'audit', 'compliance',
  // Digital Business Icons (19)
  'ecommerce', 'logistic', 'financial', 'edutech', 'telecom', 'media',
  'healthcare', 'venture', 'consultant', 'university', 'bumn',
  'retail', 'shopping', 'cart', 'manufacturing', 'agriculture', 'energy', 'construction'
]

export default function CMSMembersPage() {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    banner: false,
    cybersecurity: false,
    digital: false,
  })
  const [saveStatus, setSaveStatus] = useState<{
    section: string | null
    type: 'success' | 'error' | null
    message: string
  }>({ section: null, type: null, message: '' })

  // Banner section state
  const [bannerData, setBannerData] = useState<BannerData>({
    titleEn: 'ADIGSI MEMBERS',
    titleId: 'ANGGOTA ADIGSI',
    imageUrl: '',
  })

  // Cybersecurity Member Heading section state
  const [cybersecHeadingData, setCybersecHeadingData] = useState<HeadingData>({
    subtitleEn: 'OUR COMMUNITY',
    subtitleId: 'KOMUNITAS KAMI',
    titleEn: 'ADIGSI Cyber Security Members',
    titleId: 'Anggota Cyber Security ADIGSI',
  })

  // Cybersecurity Member Categories section state
  const [cybersecCategoriesData, setCybersecCategoriesData] = useState<MemberCategoriesData>({
    categories: [
      {
        titleEn: '',
        titleId: '',
        count: 0,
        icon: 'network',
      }
    ]
  })

  // Digital Categories section state
  const [digitalHeadingData, setDigitalHeadingData] = useState<HeadingData>({
    subtitleEn: 'OUR DIGITAL COMMUNITY',
    subtitleId: 'KOMUNITAS DIGITAL KAMI',
    titleEn: 'Digital Member Categories',
    titleId: 'Kategori Member Digital',
  })

  const [digitalCategoriesData, setDigitalCategoriesData] = useState<DigitalCategoriesData>({
    categories: [
      {
        nameEn: '',
        nameId: '',
        count: 0,
        icon: 'ecommerce',
      }
    ]
  })

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, categoriesRes, digitalCategoriesRes] = await Promise.all([
          fetch('/api/cms/members/banner'),
          fetch('/api/cms/members/categories'),
          fetch('/api/cms/members/digital-categories')
        ])

        if (bannerRes.ok) {
          const data = await bannerRes.json()
          setBannerData({
            titleEn: data.titleEn || '',
            titleId: data.titleId || '',
            imageUrl: data.imageUrl || '',
          })
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          // Update both heading and categories from combined endpoint
          setCybersecHeadingData({
            subtitleEn: data.heading?.subtitleEn || 'OUR COMMUNITY',
            subtitleId: data.heading?.subtitleId || 'KOMUNITAS KAMI',
            titleEn: data.heading?.titleEn || 'ADIGSI Cyber Security Members',
            titleId: data.heading?.titleId || 'Anggota Cyber Security ADIGSI',
          })
          
          setCybersecCategoriesData({
            categories: data.categories || [
              {
                titleEn: '',
                titleId: '',
                count: 0,
                icon: 'network',
              }
            ]
          })
        }

        if (digitalCategoriesRes.ok) {
          const data = await digitalCategoriesRes.json()
          setDigitalHeadingData({
            subtitleEn: data.heading?.subtitleEn || 'OUR DIGITAL COMMUNITY',
            subtitleId: data.heading?.subtitleId || 'KOMUNITAS DIGITAL KAMI',
            titleEn: data.heading?.titleEn || 'Digital Member Categories',
            titleId: data.heading?.titleId || 'Kategori Member Digital',
          })
          
          setDigitalCategoriesData({
            categories: data.categories || [
              {
                nameEn: '',
                nameId: '',
                count: 0,
                icon: 'ecommerce',
              }
            ]
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = async (section: string) => {
    setIsSaving(section)
    setSaveStatus({ section: null, type: null, message: '' })

    try {
      if (section === 'banner') {
        const response = await fetch('/api/cms/members/banner', {
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
      } else if (section === 'cybersecurity') {
        // Save cybersecurity heading and categories together
        const response = await fetch('/api/cms/members/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            heading: cybersecHeadingData,
            categories: cybersecCategoriesData.categories,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save section')
        }

        setSaveStatus({
          section: 'cybersecurity',
          type: 'success',
          message: t({ en: 'Cybersecurity member section saved successfully', id: 'Kategori member cybersecurity berhasil disimpan' }),
        })
      } else if (section === 'digital') {
        // Save digital heading and categories together
        const response = await fetch('/api/cms/members/digital-categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            heading: digitalHeadingData,
            categories: digitalCategoriesData.categories,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save digital categories')
        }

        setSaveStatus({
          section: 'digital-categories',
          type: 'success',
          message: t({ en: 'Digital member categories saved successfully', id: 'Kategori member digital berhasil disimpan' }),
        })
      }

      setTimeout(() => {
        setSaveStatus({ section: null, type: null, message: '' })
      }, 3000)
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
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'Members Page Management', id: 'Manajemen Halaman Members' })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage content sections for the Members page', id: 'Kelola konten section untuk halaman Members' })}
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
                  {t({ en: 'Manage the Members page banner', id: 'Kelola banner halaman Members' })}
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

                  <Button onClick={() => handleSave('banner')} disabled={isSaving === 'banner'}>
                    {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Banner', id: 'Simpan Banner' })}
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Cybersecurity Member Categories Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, cybersecurity: !expandedSections.cybersecurity })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Cybersecurity Member Categories', id: 'Kategori Member Cybersecurity' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage cybersecurity member categories and member count', id: 'Kelola kategori member cybersecurity dan jumlah anggota' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.cybersecurity ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.cybersecurity && (
              <>
                {saveStatus.section === 'cybersecurity' && saveStatus.type && (
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

                {/* Section Heading Fields */}
                <div className="bg-muted/30 border border-muted rounded-lg p-4 mt-4 mb-6">
                  <h3 className="text-sm font-semibold mb-4 text-foreground">{t({ en: 'Section Heading', id: 'Judul Seksi' })}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subtitle-en">{t({ en: 'Subtitle (EN)', id: 'Subtitle (EN)' })}</Label>
                      <Input
                        id="subtitle-en"
                        value={cybersecHeadingData.subtitleEn}
                        onChange={(e) => setCybersecHeadingData({ ...cybersecHeadingData, subtitleEn: e.target.value })}
                        placeholder={t({ en: 'Enter subtitle in English', id: 'Masukkan subtitle dalam Inggris' })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle-id">{t({ en: 'Subtitle (ID)', id: 'Subtitle (ID)' })}</Label>
                      <Input
                        id="subtitle-id"
                        value={cybersecHeadingData.subtitleId}
                        onChange={(e) => setCybersecHeadingData({ ...cybersecHeadingData, subtitleId: e.target.value })}
                        placeholder={t({ en: 'Enter subtitle in Indonesian', id: 'Masukkan subtitle dalam Indonesia' })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="title-en">{t({ en: 'Title (EN)', id: 'Judul (EN)' })}</Label>
                      <Input
                        id="title-en"
                        value={cybersecHeadingData.titleEn}
                        onChange={(e) => setCybersecHeadingData({ ...cybersecHeadingData, titleEn: e.target.value })}
                        placeholder={t({ en: 'Enter title in English', id: 'Masukkan judul dalam Inggris' })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="title-id">{t({ en: 'Title (ID)', id: 'Judul (ID)' })}</Label>
                      <Input
                        id="title-id"
                        value={cybersecHeadingData.titleId}
                        onChange={(e) => setCybersecHeadingData({ ...cybersecHeadingData, titleId: e.target.value })}
                        placeholder={t({ en: 'Enter title in Indonesian', id: 'Masukkan judul dalam Indonesia' })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {cybersecCategoriesData.categories.map((category, index) => (
                    <Card key={index} className="p-3 border-muted bg-muted/30 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-sm text-foreground">{t({ en: 'Category', id: 'Kategori' })} {index + 1}</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newCategories = cybersecCategoriesData.categories.filter((_, i) => i !== index)
                            setCybersecCategoriesData({ ...cybersecCategoriesData, categories: newCategories })
                          }}
                          className="h-8 w-8 p-0 shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="space-y-2 flex-1">
                        <div>
                          <Label className="text-xs">{t({ en: 'Title (EN)', id: 'Judul (EN)' })}</Label>
                          <Input
                            value={category.titleEn}
                            onChange={(e) => {
                              const newCategories = [...cybersecCategoriesData.categories]
                              newCategories[index] = { ...category, titleEn: e.target.value }
                              setCybersecCategoriesData({ ...cybersecCategoriesData, categories: newCategories })
                            }}
                            placeholder="e.g., Network Security"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">{t({ en: 'Title (ID)', id: 'Judul (ID)' })}</Label>
                          <Input
                            value={category.titleId}
                            onChange={(e) => {
                              const newCategories = [...cybersecCategoriesData.categories]
                              newCategories[index] = { ...category, titleId: e.target.value }
                              setCybersecCategoriesData({ ...cybersecCategoriesData, categories: newCategories })
                            }}
                            placeholder="e.g., Keamanan Jaringan"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">{t({ en: 'Count', id: 'Jumlah' })}</Label>
                          <Input
                            type="number"
                            value={category.count}
                            onChange={(e) => {
                              const newCategories = [...cybersecCategoriesData.categories]
                              newCategories[index] = { ...category, count: parseInt(e.target.value) || 0 }
                              setCybersecCategoriesData({ ...cybersecCategoriesData, categories: newCategories })
                            }}
                            placeholder="25"
                            min="0"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs mb-1 block">{t({ en: 'Icon', id: 'Icon' })}</Label>
                          <IconPicker
                            value={category.icon}
                            onChange={(icon) => {
                              const newCategories = [...cybersecCategoriesData.categories]
                              newCategories[index] = { ...category, icon }
                              setCybersecCategoriesData({ ...cybersecCategoriesData, categories: newCategories })
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setCybersecCategoriesData({
                        ...cybersecCategoriesData,
                        categories: [
                          ...cybersecCategoriesData.categories,
                          {
                            titleEn: '',
                            titleId: '',
                            count: 0,
                            icon: 'network',
                          }
                        ]
                      })
                    }}
                    variant="outline"
                  >
                    {t({ en: '+ Add Category', id: '+ Tambah Kategori' })}
                  </Button>

                  <Button onClick={() => handleSave('cybersecurity')} disabled={isSaving === 'cybersecurity'}>
                    {isSaving === 'cybersecurity' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Cybersecurity Categories', id: 'Simpan Kategori Cybersecurity' })}
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Digital Member Categories Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, digital: !expandedSections.digital })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Digital Member Categories', id: 'Kategori Member Digital' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage digital member business sector categories', id: 'Kelola kategori sektor bisnis member digital' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.digital ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.digital && (
              <>
                {saveStatus.section === 'digital' && saveStatus.type && (
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

                {/* Section Heading Fields */}
                <div className="bg-muted/30 border border-muted rounded-lg p-4 mt-4 mb-6">
                  <h3 className="text-sm font-semibold mb-4 text-foreground">{t({ en: 'Section Heading', id: 'Judul Seksi' })}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="digital-subtitle-en">{t({ en: 'Subtitle (EN)', id: 'Subtitle (EN)' })}</Label>
                      <Input
                        id="digital-subtitle-en"
                        value={digitalHeadingData.subtitleEn}
                        onChange={(e) => setDigitalHeadingData({ ...digitalHeadingData, subtitleEn: e.target.value })}
                        placeholder={t({ en: 'Enter subtitle in English', id: 'Masukkan subtitle dalam Inggris' })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="digital-subtitle-id">{t({ en: 'Subtitle (ID)', id: 'Subtitle (ID)' })}</Label>
                      <Input
                        id="digital-subtitle-id"
                        value={digitalHeadingData.subtitleId}
                        onChange={(e) => setDigitalHeadingData({ ...digitalHeadingData, subtitleId: e.target.value })}
                        placeholder={t({ en: 'Enter subtitle in Indonesian', id: 'Masukkan subtitle dalam Indonesia' })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="digital-title-en">{t({ en: 'Title (EN)', id: 'Judul (EN)' })}</Label>
                      <Input
                        id="digital-title-en"
                        value={digitalHeadingData.titleEn}
                        onChange={(e) => setDigitalHeadingData({ ...digitalHeadingData, titleEn: e.target.value })}
                        placeholder={t({ en: 'Enter title in English', id: 'Masukkan judul dalam Inggris' })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="digital-title-id">{t({ en: 'Title (ID)', id: 'Judul (ID)' })}</Label>
                      <Input
                        id="digital-title-id"
                        value={digitalHeadingData.titleId}
                        onChange={(e) => setDigitalHeadingData({ ...digitalHeadingData, titleId: e.target.value })}
                        placeholder={t({ en: 'Enter title in Indonesian', id: 'Masukkan judul dalam Indonesia' })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {digitalCategoriesData.categories.map((category, index) => (
                    <Card key={index} className="p-3 border-muted bg-muted/30 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-sm text-foreground">{t({ en: 'Category', id: 'Kategori' })} {index + 1}</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newCategories = digitalCategoriesData.categories.filter((_, i) => i !== index)
                            setDigitalCategoriesData({ ...digitalCategoriesData, categories: newCategories })
                          }}
                          className="h-8 w-8 p-0 shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="space-y-2 flex-1">
                        <div>
                          <Label className="text-xs">{t({ en: 'Name (EN)', id: 'Nama (EN)' })}</Label>
                          <Input
                            value={category.nameEn}
                            onChange={(e) => {
                              const newCategories = [...digitalCategoriesData.categories]
                              newCategories[index] = { ...category, nameEn: e.target.value }
                              setDigitalCategoriesData({ ...digitalCategoriesData, categories: newCategories })
                            }}
                            placeholder="e.g., E-Commerce"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">{t({ en: 'Name (ID)', id: 'Nama (ID)' })}</Label>
                          <Input
                            value={category.nameId}
                            onChange={(e) => {
                              const newCategories = [...digitalCategoriesData.categories]
                              newCategories[index] = { ...category, nameId: e.target.value }
                              setDigitalCategoriesData({ ...digitalCategoriesData, categories: newCategories })
                            }}
                            placeholder="e.g., E-Commerce"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">{t({ en: 'Count', id: 'Jumlah' })}</Label>
                          <Input
                            type="number"
                            value={category.count}
                            onChange={(e) => {
                              const newCategories = [...digitalCategoriesData.categories]
                              newCategories[index] = { ...category, count: parseInt(e.target.value) || 0 }
                              setDigitalCategoriesData({ ...digitalCategoriesData, categories: newCategories })
                            }}
                            placeholder="0"
                            min="0"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs mb-1 block">{t({ en: 'Icon', id: 'Icon' })}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="w-full h-8 px-2 border border-input rounded-md bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring flex items-center gap-2 justify-between hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="text-muted-foreground shrink-0">
                                    <CyberIcon type={category.icon} />
                                  </div>
                                  <span className="text-foreground capitalize truncate text-xs">{category.icon}</span>
                                </div>
                                <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 p-3">
                              <div className="grid grid-cols-10 gap-2">
                                {ICON_OPTIONS.map((iconType) => (
                                  <button
                                    key={iconType}
                                    onClick={() => {
                                      const newCategories = [...digitalCategoriesData.categories]
                                      newCategories[index] = { ...category, icon: iconType }
                                      setDigitalCategoriesData({ ...digitalCategoriesData, categories: newCategories })
                                    }}
                                    className={`p-2 rounded border transition-all flex flex-col items-center justify-center gap-1 text-xs capitalize hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 ${category.icon === iconType
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                        : 'border-muted hover:border-gray-400'
                                      }`}
                                    title={iconType}
                                  >
                                    <div className="text-muted-foreground">{category.icon === iconType && <Check className="h-3 w-3 text-blue-500" />}</div>
                                    <div className="shrink-0">
                                      <CyberIcon type={iconType} />
                                    </div>
                                    <span className="text-[10px] text-center">{iconType.substring(0, 5)}</span>
                                  </button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setDigitalCategoriesData({
                        ...digitalCategoriesData,
                        categories: [
                          ...digitalCategoriesData.categories,
                          {
                            nameEn: '',
                            nameId: '',
                            count: 0,
                            icon: 'ecommerce',
                          }
                        ]
                      })
                    }}
                    variant="outline"
                  >
                    {t({ en: '+ Add Digital Category', id: '+ Tambah Kategori Digital' })}
                  </Button>

                  <Button onClick={() => handleSave('digital')} disabled={isSaving === 'digital'}>
                    {isSaving === 'digital' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Digital Categories', id: 'Simpan Kategori Digital' })}
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
