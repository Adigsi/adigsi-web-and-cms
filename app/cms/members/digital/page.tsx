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

interface DigitalCategory {
  nameEn: string
  nameId: string
  count: number
  icon: string
}

interface HeadingData {
  subtitleEn: string
  subtitleId: string
  titleEn: string
  titleId: string
}

interface DigitalCategoriesData {
  heading: HeadingData
  categories: DigitalCategory[]
}

// Custom Icon Picker Component for Digital Categories
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
      <PopoverContent className="w-56 p-3">
        <div className="grid grid-cols-5 gap-2">
          {DIGITAL_ICON_OPTIONS.map((iconType) => (
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

const DIGITAL_ICON_OPTIONS = [
  'ecommerce', 'logistic', 'financial', 'edutech', 'telecom',
  'media', 'healthcare', 'venture', 'consultant', 'university', 'bumn'
]

export default function CMSDigitalMembersPage() {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    categories: false,
  })
  const [saveStatus, setSaveStatus] = useState<{
    section: string | null
    type: 'success' | 'error' | null
    message: string
  }>({ section: null, type: null, message: '' })

  // Heading section state
  const [headingData, setHeadingData] = useState<HeadingData>({
    subtitleEn: 'DIGITAL ECOSYSTEM',
    subtitleId: 'EKOSISTEM DIGITAL',
    titleEn: 'ADIGSI Digital Members',
    titleId: 'Anggota Digital ADIGSI',
  })

  // Categories section state
  const [categoriesData, setCategoriesData] = useState<DigitalCategoriesData>({
    heading: {
      subtitleEn: '',
      subtitleId: '',
      titleEn: '',
      titleId: '',
    },
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
        const categoriesRes = await fetch('/api/cms/members/digital-categories')

        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          // Update both heading and categories from combined endpoint
          setHeadingData({
            subtitleEn: data.heading?.subtitleEn || 'DIGITAL ECOSYSTEM',
            subtitleId: data.heading?.subtitleId || 'EKOSISTEM DIGITAL',
            titleEn: data.heading?.titleEn || 'ADIGSI Digital Members',
            titleId: data.heading?.titleId || 'Anggota Digital ADIGSI',
          })
          
          setCategoriesData({
            heading: data.heading,
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
      if (section === 'categories') {
        // Save heading and categories together
        const response = await fetch('/api/cms/members/digital-categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            heading: headingData,
            categories: categoriesData.categories,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save section')
        }

        setSaveStatus({
          section: 'categories',
          type: 'success',
          message: t({ en: 'Digital categories and heading saved successfully', id: 'Kategori digital dan judul berhasil disimpan' }),
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
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'Digital Members Page Management', id: 'Manajemen Halaman Digital Members' })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage content sections for the Digital Members page', id: 'Kelola konten section untuk halaman Digital Members' })}
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
          {/* Digital Categories Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, categories: !expandedSections.categories })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Digital Member Categories', id: 'Kategori Member Digital' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage digital business categories and member count', id: 'Kelola kategori bisnis digital dan jumlah anggota' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.categories ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.categories && (
              <>
                {saveStatus.section === 'categories' && saveStatus.type && (
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
                        value={headingData.subtitleEn}
                        onChange={(e) => setHeadingData({ ...headingData, subtitleEn: e.target.value })}
                        placeholder={t({ en: 'Enter subtitle in English', id: 'Masukkan subtitle dalam Inggris' })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle-id">{t({ en: 'Subtitle (ID)', id: 'Subtitle (ID)' })}</Label>
                      <Input
                        id="subtitle-id"
                        value={headingData.subtitleId}
                        onChange={(e) => setHeadingData({ ...headingData, subtitleId: e.target.value })}
                        placeholder={t({ en: 'Enter subtitle in Indonesian', id: 'Masukkan subtitle dalam Indonesia' })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="title-en">{t({ en: 'Title (EN)', id: 'Judul (EN)' })}</Label>
                      <Input
                        id="title-en"
                        value={headingData.titleEn}
                        onChange={(e) => setHeadingData({ ...headingData, titleEn: e.target.value })}
                        placeholder={t({ en: 'Enter title in English', id: 'Masukkan judul dalam Inggris' })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="title-id">{t({ en: 'Title (ID)', id: 'Judul (ID)' })}</Label>
                      <Input
                        id="title-id"
                        value={headingData.titleId}
                        onChange={(e) => setHeadingData({ ...headingData, titleId: e.target.value })}
                        placeholder={t({ en: 'Enter title in Indonesian', id: 'Masukkan judul dalam Indonesia' })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {categoriesData.categories.map((category, index) => (
                    <Card key={index} className="p-3 border-muted bg-muted/30 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-sm text-foreground">{t({ en: 'Category', id: 'Kategori' })} {index + 1}</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newCategories = categoriesData.categories.filter((_, i) => i !== index)
                            setCategoriesData({ ...categoriesData, categories: newCategories })
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
                              const newCategories = [...categoriesData.categories]
                              newCategories[index] = { ...category, nameEn: e.target.value }
                              setCategoriesData({ ...categoriesData, categories: newCategories })
                            }}
                            placeholder="e.g., Ecommerce"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">{t({ en: 'Name (ID)', id: 'Nama (ID)' })}</Label>
                          <Input
                            value={category.nameId}
                            onChange={(e) => {
                              const newCategories = [...categoriesData.categories]
                              newCategories[index] = { ...category, nameId: e.target.value }
                              setCategoriesData({ ...categoriesData, categories: newCategories })
                            }}
                            placeholder="e.g., E-commerce"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">{t({ en: 'Count', id: 'Jumlah' })}</Label>
                          <Input
                            type="number"
                            value={category.count}
                            onChange={(e) => {
                              const newCategories = [...categoriesData.categories]
                              newCategories[index] = { ...category, count: parseInt(e.target.value) || 0 }
                              setCategoriesData({ ...categoriesData, categories: newCategories })
                            }}
                            placeholder="32"
                            min="0"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-xs mb-1 block">{t({ en: 'Icon', id: 'Icon' })}</Label>
                          <IconPicker
                            value={category.icon}
                            onChange={(icon) => {
                              const newCategories = [...categoriesData.categories]
                              newCategories[index] = { ...category, icon }
                              setCategoriesData({ ...categoriesData, categories: newCategories })
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button
                    onClick={() => {
                      setCategoriesData({
                        ...categoriesData,
                        categories: [
                          ...categoriesData.categories,
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
                    {t({ en: '+ Add Category', id: '+ Tambah Kategori' })}
                  </Button>

                  <Button onClick={() => handleSave('categories')} disabled={isSaving === 'categories'}>
                    {isSaving === 'categories' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Categories', id: 'Simpan Kategori' })}
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
