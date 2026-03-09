'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronDown, Upload, X, Check, Pin, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { CyberIcon } from '@/components/ui/cyber-icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface BannerButton {
  enabled: boolean
  textEn: string
  textId: string
  link: string
}

interface BannerData {
  titleSmallEn: string
  titleSmallId: string
  titleLargeEn: string
  titleLargeId: string
  descriptionEn: string
  descriptionId: string
  primaryButton: BannerButton
  secondaryButton: BannerButton
}

interface CarousellSlide {
  image: string
  link?: string
  published?: boolean
}

interface CarousellData {
  slides: CarousellSlide[]
}

interface Testimonial {
  quoteEn: string
  quoteId: string
  name: string
  positionEn: string
  positionId: string
  image: string
}

interface WelcomeData {
  titleSmallEn: string
  titleSmallId: string
  titleLargeEn: string
  titleLargeId: string
  testimonials: Testimonial[]
}

interface ReportData {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  buttonTextEn: string
  buttonTextId: string
  pdfFile: string
  image: string
}

const ICON_OPTIONS = [
  'join',
  'network','web','endpoint','app','mssp','data','mobile','risk','secops','threat',
  'identity','digitalrisk','blockchain','iot','messaging','consulting','fraud','cloud',
  'server','database','firewall','vpn','encryption','malware','virus','monitoring','audit',
  'compliance','ecommerce','logistic','financial','edutech','telecom','media','healthcare',
  'venture','consultant','university','bumn','retail','shopping','cart','manufacturing',
  'agriculture','energy','construction',
] as const

function JoinSVGIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  )
}

function renderPickerIcon(type: string) {
  if (type === 'join') return <JoinSVGIcon />
  return <CyberIcon type={type} />
}

function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button ref={triggerRef} className="w-full h-8 px-2 border border-input rounded-md bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring flex items-center gap-2 justify-between hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="text-muted-foreground shrink-0">{renderPickerIcon(value)}</div>
            <span className="text-foreground capitalize truncate text-xs">{value}</span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-3">
        <div className="grid grid-cols-10 gap-2">
          {ICON_OPTIONS.map((iconType) => (
            <button key={iconType} onClick={() => { onChange(iconType); setOpen(false) }}
              className={`p-2 rounded border transition-all flex flex-col items-center justify-center gap-1 text-xs capitalize hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 ${
                value === iconType ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-muted hover:border-gray-400'
              }`} title={iconType}>
              <div className="text-muted-foreground">{value === iconType && <Check className="h-3 w-3 text-blue-500" />}</div>
              <div className="shrink-0">{renderPickerIcon(iconType)}</div>
              <span className="text-[10px] text-center">{iconType.substring(0, 5)}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface FloatingButtonsData {
  joinButton: { textEn: string; textId: string; link: string; icon: string }
  contactButton: { email: string; whatsapp: string }
}

interface FooterData {
  aboutTitleEn: string
  aboutTitleId: string
  aboutDescriptionEn: string
  aboutDescriptionId: string
  instagramUrl: string
  whatsappUrl: string
  linkedinUrl: string
  email: string
  phone: string
  addressEn: string
  addressId: string
  copyrightYear: string
}

export default function CMSHomePage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [draggedTestimonial, setDraggedTestimonial] = useState<number | null>(null)
  const [draggedCarousellSlide, setDraggedCarousellSlide] = useState<number | null>(null)

  const [carousellData, setCarousellData] = useState<CarousellData>({
    slides: [],
  })

  const [bannerData, setBannerData] = useState<BannerData>({
    titleSmallEn: '',
    titleSmallId: '',
    titleLargeEn: '',
    titleLargeId: '',
    descriptionEn: '',
    descriptionId: '',
    primaryButton: { enabled: true, textEn: '', textId: '', link: '' },
    secondaryButton: { enabled: false, textEn: '', textId: '', link: '' },
  })

  const [welcomeData, setWelcomeData] = useState<WelcomeData>({
    titleSmallEn: '',
    titleSmallId: '',
    titleLargeEn: '',
    titleLargeId: '',
    testimonials: []
  })

  const [reportData, setReportData] = useState<ReportData>({
    titleEn: '',
    titleId: '',
    descriptionEn: '',
    descriptionId: '',
    buttonTextEn: '',
    buttonTextId: '',
    pdfFile: '',
    image: '',
  })

  const [pinnedReport, setPinnedReport] = useState<{
    pinned: boolean
    _id?: string
    titleEn?: string
    titleId?: string
    cover?: string
    tags?: string[]
    hasPdf?: boolean
  } | null>(null)

  const [footerData, setFooterData] = useState<FooterData>({
    aboutTitleEn: '',
    aboutTitleId: '',
    aboutDescriptionEn: '',
    aboutDescriptionId: '',
    instagramUrl: '',
    whatsappUrl: '',
    linkedinUrl: '',
    email: '',
    phone: '',
    addressEn: '',
    addressId: '',
    copyrightYear: new Date().getFullYear().toString(),
  })

  const [floatingData, setFloatingData] = useState<FloatingButtonsData>({
    joinButton: { textEn: 'Join Now', textId: 'Daftar', link: '/register', icon: 'network' },
    contactButton: { email: 'info@adigsi.id', whatsapp: 'https://wa.me/62' },
  })

  // Fetch banner, welcome, report, and footer data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carousellRes, bannerRes, welcomeRes, footerRes, floatingRes, pinnedRes] = await Promise.all([
          fetch('/api/cms/home/carousell'),
          fetch('/api/cms/home/banner'),
          fetch('/api/cms/home/welcome'),
          fetch('/api/cms/home/footer'),
          fetch('/api/cms/home/floating-buttons'),
          fetch('/api/cms/reports/pinned'),
        ])

        if (carousellRes.ok) {
          const data = await carousellRes.json()
          setCarousellData({
            slides: Array.isArray(data.slides) ? data.slides : [],
          })
        }

        if (bannerRes.ok) {
          const data = await bannerRes.json()
          setBannerData(data)
        }

        if (welcomeRes.ok) {
          const data = await welcomeRes.json()
          setWelcomeData(data)
        }

        if (footerRes.ok) {
          const data = await footerRes.json()
          setFooterData(data)
        }

        if (floatingRes.ok) {
          const data = await floatingRes.json()
          setFloatingData(data)
        }

        if (pinnedRes.ok) {
          const data = await pinnedRes.json()
          setPinnedReport(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCarousellImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'File size must be less than 5MB', id: 'Ukuran file harus kurang dari 5MB' }),
        variant: 'destructive'
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      const newSlides = [...carousellData.slides]
      newSlides[slideIndex].image = base64
      setCarousellData({ ...carousellData, slides: newSlides })
    }
    reader.readAsDataURL(file)
  }

  const handleTestimonialImageUpload = (e: React.ChangeEvent<HTMLInputElement>, testimonialIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'File size must be less than 5MB', id: 'Ukuran file harus kurang dari 5MB' }),
        variant: 'destructive'
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      const newTestimonials = [...welcomeData.testimonials]
      newTestimonials[testimonialIndex].image = base64
      setWelcomeData({ ...welcomeData, testimonials: newTestimonials })
    }
    reader.readAsDataURL(file)
  }

  const handleReportImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'File size must be less than 5MB', id: 'Ukuran file harus kurang dari 5MB' }),
        variant: 'destructive'
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setReportData({ ...reportData, image: base64 })
    }
    reader.readAsDataURL(file)
  }

  const handleReportPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'Only PDF files are allowed', id: 'Hanya file PDF yang diizinkan' }),
        variant: 'destructive'
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: t({ en: 'PDF file size must be less than 10MB', id: 'Ukuran file PDF harus kurang dari 10MB' }),
        variant: 'destructive'
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setReportData({ ...reportData, pdfFile: base64 })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (section: string) => {
    setIsSaving(section)

    try {
      if (section === 'carousell') {
        const response = await fetch('/api/cms/home/carousell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(carousellData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save carousell')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Carousell saved successfully', id: 'Carousell berhasil disimpan' })
        })
      } else if (section === 'banner') {
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

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Banner saved successfully', id: 'Banner berhasil disimpan' })
        })
      } else if (section === 'welcome') {
        const response = await fetch('/api/cms/home/welcome', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(welcomeData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save welcome')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Welcome section saved successfully', id: 'Section welcome berhasil disimpan' })
        })
      } else if (section === 'report') {
        const response = await fetch('/api/cms/home/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save report')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Report section saved successfully', id: 'Section report berhasil disimpan' })
        })
      } else if (section === 'footer') {
        const response = await fetch('/api/cms/home/footer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(footerData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save footer')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Footer saved successfully', id: 'Footer berhasil disimpan' })
        })
      } else if (section === 'floating') {
        const response = await fetch('/api/cms/home/floating-buttons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(floatingData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save floating buttons')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Floating buttons saved successfully', id: 'Floating button berhasil disimpan' })
        })
      }
    } catch (error) {
      console.error(`Error saving ${section}:`, error)
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to save changes', id: 'Gagal menyimpan perubahan' }),
        variant: 'destructive'
      })
    } finally {
      setIsSaving(null)
    }
  }

  // Drag and drop handlers for testimonials
  const handleTestimonialDragStart = (index: number) => {
    setDraggedTestimonial(index)
  }

  const handleTestimonialDragEnd = () => {
    setDraggedTestimonial(null)
  }

  const handleTestimonialDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleTestimonialDrop = (targetIndex: number) => {
    if (draggedTestimonial === null) return
    
    const newTestimonials = [...welcomeData.testimonials]
    const draggedItem = newTestimonials[draggedTestimonial]
    newTestimonials.splice(draggedTestimonial, 1)
    newTestimonials.splice(targetIndex, 0, draggedItem)
    
    setWelcomeData({ ...welcomeData, testimonials: newTestimonials })
    setDraggedTestimonial(null)
  }

  const handleCarousellDragStart = (index: number) => {
    setDraggedCarousellSlide(index)
  }

  const handleCarousellDragEnd = () => {
    setDraggedCarousellSlide(null)
  }

  const handleCarousellDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleCarousellDrop = (targetIndex: number) => {
    if (draggedCarousellSlide === null) return

    const newSlides = [...carousellData.slides]
    const draggedItem = newSlides[draggedCarousellSlide]
    newSlides.splice(draggedCarousellSlide, 1)
    newSlides.splice(targetIndex, 0, draggedItem)

    setCarousellData({ ...carousellData, slides: newSlides })
    setDraggedCarousellSlide(null)
  }

  return (
    <div className="space-y-4">
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
        <Tabs defaultValue="carousell">
          <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60">
            <TabsTrigger value="carousell">{t({ en: 'Carousell', id: 'Carousell' })}</TabsTrigger>
            <TabsTrigger value="banner">{t({ en: 'Hero Banner', id: 'Banner Hero' })}</TabsTrigger>
            <TabsTrigger value="welcome">{t({ en: 'Welcome', id: 'Welcome' })}</TabsTrigger>
            <TabsTrigger value="report">{t({ en: 'Report', id: 'Laporan' })}</TabsTrigger>
            <TabsTrigger value="footer">{t({ en: 'Footer', id: 'Footer' })}</TabsTrigger>
            <TabsTrigger value="floating">{t({ en: 'Floating Buttons', id: 'Tombol Melayang' })}</TabsTrigger>
          </TabsList>

          {/* ─── Carousell ─────────────────────────────────────────── */}
          <TabsContent value="carousell">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Carousell Section', id: 'Section Carousell' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage carousell banners with images and optional links', id: 'Kelola banner carousell dengan gambar dan link opsional' })}
                </p>
              </div>

              <div className="space-y-4">
                {/* Ratio notice */}
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  <p className="text-xs font-medium leading-snug">
                    {t({
                      en: 'All slide images must use a 1:1 (square) ratio. Images with different ratios will be cropped automatically.',
                      id: 'Semua gambar slide harus menggunakan rasio 1:1 (persegi). Gambar dengan rasio berbeda akan dipotong secara otomatis.'
                    })}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {carousellData.slides.length > 0 ? (
                    carousellData.slides.map((slide, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={() => handleCarousellDragStart(index)}
                        onDragEnd={handleCarousellDragEnd}
                        onDragOver={handleCarousellDragOver}
                        onDrop={() => handleCarousellDrop(index)}
                        className={`border border-border rounded-lg p-3 space-y-3 cursor-move transition-all ${
                          draggedCarousellSlide === index ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'
                        } hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-xs shrink-0">
                            {t({ en: 'Slide', id: 'Slide' })} {index + 1}
                          </h4>
                          <label className="inline-flex items-center gap-1.5 text-xs min-w-0">
                            <input
                              type="checkbox"
                              checked={slide.published ?? false}
                              onChange={(e) => {
                                const newSlides = [...carousellData.slides]
                                newSlides[index].published = e.target.checked
                                setCarousellData({ ...carousellData, slides: newSlides })
                              }}
                              className="h-3 w-3 shrink-0"
                            />
                            <span className="truncate">
                              {slide.published ? t({ en: 'Published', id: 'Publish' }) : t({ en: 'Draft', id: 'Draft' })}
                            </span>
                          </label>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={carousellData.slides.length === 1}
                            className="h-6 px-2 text-xs shrink-0"
                            onClick={() => {
                              const newSlides = carousellData.slides.filter((_, i) => i !== index)
                              setCarousellData({ ...carousellData, slides: newSlides })
                            }}
                          >
                            {t({ en: 'Delete', id: 'Hapus' })}
                          </Button>
                        </div>

                        <div>
                          <div className="mt-1 space-y-2">
                            {slide.image && (
                              <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted">
                                <img
                                  src={slide.image}
                                  alt="Carousell preview"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => {
                                    const newSlides = [...carousellData.slides]
                                    newSlides[index].image = ''
                                    setCarousellData({ ...carousellData, slides: newSlides })
                                  }}
                                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                            <label className="flex items-center justify-center px-3 py-1.5 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary/50 transition-colors">
                              <div className="flex items-center gap-1.5">
                                <Upload className="h-3.5 w-3.5" />
                                <span className="text-xs text-muted-foreground">
                                  {t({ en: 'Upload (1:1)', id: 'Unggah (1:1)' })}
                                </span>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleCarousellImageUpload(e, index)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <Input
                            id={`carousell-link-${index}`}
                            value={slide.link || ''}
                            onChange={(e) => {
                              const newSlides = [...carousellData.slides]
                              newSlides[index].link = e.target.value
                              setCarousellData({ ...carousellData, slides: newSlides })
                            }}
                            placeholder="https://... (optional)"
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center text-muted-foreground py-6">
                      {t({ en: 'No slides added yet', id: 'Belum ada slide' })}
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky save bar */}
              <div className="sticky bottom-0 z-10 mt-6 -mx-6 px-6 py-3 bg-card border-t border-border flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCarousellData({
                      ...carousellData,
                      slides: [...carousellData.slides, { image: '', link: '', published: true }]
                    })
                  }}
                >
                  + {t({ en: 'Add Slide', id: 'Tambah Slide' })}
                </Button>
                <Button onClick={() => handleSave('carousell')} disabled={isSaving === 'carousell'}>
                  {isSaving === 'carousell' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ─── Banner ─────────────────────────────────────────────── */}
          <TabsContent value="banner">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Hero Banner', id: 'Banner Hero' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage the hero banner with titles, description and optional buttons', id: 'Kelola banner hero dengan judul, deskripsi dan tombol opsional' })}
                </p>
              </div>

              <div className="space-y-6">
                {/* Titles Section */}
                <div>
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

                {/* Primary Button Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{t({ en: 'Primary Button', id: 'Tombol Primer' })}</h3>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="primary-btn-enabled"
                        checked={bannerData.primaryButton.enabled}
                        onCheckedChange={(checked) =>
                          setBannerData({ ...bannerData, primaryButton: { ...bannerData.primaryButton, enabled: !!checked } })
                        }
                      />
                      <Label htmlFor="primary-btn-enabled">{t({ en: 'Enabled', id: 'Aktif' })}</Label>
                    </div>
                  </div>
                  {bannerData.primaryButton.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="primary-btn-text-en">{t({ en: 'Button Text (EN)', id: 'Teks Tombol (EN)' })}</Label>
                        <Input
                          id="primary-btn-text-en"
                          value={bannerData.primaryButton.textEn}
                          onChange={(e) => setBannerData({ ...bannerData, primaryButton: { ...bannerData.primaryButton, textEn: e.target.value } })}
                          placeholder="e.g., About Us"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="primary-btn-text-id">{t({ en: 'Button Text (ID)', id: 'Teks Tombol (ID)' })}</Label>
                        <Input
                          id="primary-btn-text-id"
                          value={bannerData.primaryButton.textId}
                          onChange={(e) => setBannerData({ ...bannerData, primaryButton: { ...bannerData.primaryButton, textId: e.target.value } })}
                          placeholder="cth., Tentang Kami"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="primary-btn-link">{t({ en: 'Button Link', id: 'Link Tombol' })}</Label>
                        <Input
                          id="primary-btn-link"
                          value={bannerData.primaryButton.link}
                          onChange={(e) => setBannerData({ ...bannerData, primaryButton: { ...bannerData.primaryButton, link: e.target.value } })}
                          placeholder="e.g., /about"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Secondary Button Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{t({ en: 'Secondary Button', id: 'Tombol Sekunder' })}</h3>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="secondary-btn-enabled"
                        checked={bannerData.secondaryButton.enabled}
                        onCheckedChange={(checked) =>
                          setBannerData({ ...bannerData, secondaryButton: { ...bannerData.secondaryButton, enabled: !!checked } })
                        }
                      />
                      <Label htmlFor="secondary-btn-enabled">{t({ en: 'Enabled', id: 'Aktif' })}</Label>
                    </div>
                  </div>
                  {bannerData.secondaryButton.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="secondary-btn-text-en">{t({ en: 'Button Text (EN)', id: 'Teks Tombol (EN)' })}</Label>
                        <Input
                          id="secondary-btn-text-en"
                          value={bannerData.secondaryButton.textEn}
                          onChange={(e) => setBannerData({ ...bannerData, secondaryButton: { ...bannerData.secondaryButton, textEn: e.target.value } })}
                          placeholder="e.g., Join Now"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="secondary-btn-text-id">{t({ en: 'Button Text (ID)', id: 'Teks Tombol (ID)' })}</Label>
                        <Input
                          id="secondary-btn-text-id"
                          value={bannerData.secondaryButton.textId}
                          onChange={(e) => setBannerData({ ...bannerData, secondaryButton: { ...bannerData.secondaryButton, textId: e.target.value } })}
                          placeholder="cth., Bergabung Sekarang"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="secondary-btn-link">{t({ en: 'Button Link', id: 'Link Tombol' })}</Label>
                        <Input
                          id="secondary-btn-link"
                          value={bannerData.secondaryButton.link}
                          onChange={(e) => setBannerData({ ...bannerData, secondaryButton: { ...bannerData.secondaryButton, link: e.target.value } })}
                          placeholder="e.g., https://forms.example.com"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky save bar */}
              <div className="sticky bottom-0 z-10 mt-6 -mx-6 px-6 py-3 bg-card border-t border-border">
                <Button onClick={() => handleSave('banner')} disabled={isSaving === 'banner'} className="w-full">
                  {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ─── Welcome ─────────────────────────────────────────────── */}
          <TabsContent value="welcome">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Welcome Section', id: 'Section Welcome' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage the welcome section with titles and testimonials', id: 'Kelola section welcome dengan judul dan testimoni' })}
                </p>
              </div>

              <div className="space-y-6">
                {/* Titles Section */}
                <div>
                  <h3 className="font-semibold mb-4">{t({ en: 'Titles', id: 'Judul' })}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="welcome-title-small-en">{t({ en: 'Small Title (EN)', id: 'Judul Kecil (EN)' })}</Label>
                      <Input
                        id="welcome-title-small-en"
                        value={welcomeData.titleSmallEn}
                        onChange={(e) => setWelcomeData({ ...welcomeData, titleSmallEn: e.target.value })}
                        placeholder="e.g., Welcome to Adigsi"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="welcome-title-small-id">{t({ en: 'Small Title (ID)', id: 'Judul Kecil (ID)' })}</Label>
                      <Input
                        id="welcome-title-small-id"
                        value={welcomeData.titleSmallId}
                        onChange={(e) => setWelcomeData({ ...welcomeData, titleSmallId: e.target.value })}
                        placeholder="cth., Selamat Datang di Adigsi"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="welcome-title-large-en">{t({ en: 'Large Title (EN)', id: 'Judul Besar (EN)' })}</Label>
                      <Input
                        id="welcome-title-large-en"
                        value={welcomeData.titleLargeEn}
                        onChange={(e) => setWelcomeData({ ...welcomeData, titleLargeEn: e.target.value })}
                        placeholder="e.g., Indonesian Digitalization..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="welcome-title-large-id">{t({ en: 'Large Title (ID)', id: 'Judul Besar (ID)' })}</Label>
                      <Input
                        id="welcome-title-large-id"
                        value={welcomeData.titleLargeId}
                        onChange={(e) => setWelcomeData({ ...welcomeData, titleLargeId: e.target.value })}
                        placeholder="cth., Asosiasi Digital..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Testimonials Section */}
                <div className="border-t pt-4">
                  <div className="mb-4">
                    <h3 className="font-semibold">{t({ en: 'Testimonials', id: 'Testimoni' })}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {welcomeData.testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={() => handleTestimonialDragStart(index)}
                        onDragEnd={handleTestimonialDragEnd}
                        onDragOver={handleTestimonialDragOver}
                        onDrop={() => handleTestimonialDrop(index)}
                        className={`border border-border rounded-lg p-4 space-y-4 cursor-move transition-all ${
                          draggedTestimonial === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                        } hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{t({ en: 'Testimonial', id: 'Testimoni' })} {index + 1}</h4>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newTestimonials = welcomeData.testimonials.filter((_, i) => i !== index)
                              setWelcomeData({ ...welcomeData, testimonials: newTestimonials })
                            }}
                          >
                            {t({ en: 'Delete', id: 'Hapus' })}
                          </Button>
                        </div>

                        {/* Testimonial Image */}
                        <div>
                          <Label>{t({ en: 'Person Image', id: 'Gambar Orang' })}</Label>
                          <div className="mt-2 space-y-3">
                            {testimonial.image && (
                              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={testimonial.image}
                                  alt="Testimonial"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => {
                                    const newTestimonials = [...welcomeData.testimonials]
                                    newTestimonials[index].image = ''
                                    setWelcomeData({ ...welcomeData, testimonials: newTestimonials })
                                  }}
                                  className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                            <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                              <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                <span className="text-sm text-muted-foreground">
                                  {t({ en: 'Upload Image', id: 'Unggah Gambar' })}
                                </span>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleTestimonialImageUpload(e, index)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Testimonial Quote - English */}
                        <div>
                          <Label htmlFor={`quote-en-${index}`}>{t({ en: 'Quote (EN)', id: 'Kutipan (EN)' })}</Label>
                          <textarea
                            id={`quote-en-${index}`}
                            value={testimonial.quoteEn}
                            onChange={(e) => {
                              const newTestimonials = [...welcomeData.testimonials]
                              newTestimonials[index].quoteEn = e.target.value
                              setWelcomeData({ ...welcomeData, testimonials: newTestimonials })
                            }}
                            placeholder={t({ en: 'Enter quote in English', id: 'Masukkan kutipan dalam bahasa Inggris' })}
                            className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                            rows={3}
                          />
                        </div>

                        {/* Testimonial Quote - Indonesian */}
                        <div>
                          <Label htmlFor={`quote-id-${index}`}>{t({ en: 'Quote (ID)', id: 'Kutipan (ID)' })}</Label>
                          <textarea
                            id={`quote-id-${index}`}
                            value={testimonial.quoteId}
                            onChange={(e) => {
                              const newTestimonials = [...welcomeData.testimonials]
                              newTestimonials[index].quoteId = e.target.value
                              setWelcomeData({ ...welcomeData, testimonials: newTestimonials })
                            }}
                            placeholder={t({ en: 'Enter quote in Indonesian', id: 'Masukkan kutipan dalam bahasa Indonesia' })}
                            className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                            rows={3}
                          />
                        </div>

                        {/* Testimonial Name */}
                        <div>
                          <Label htmlFor={`name-${index}`}>{t({ en: 'Person Name', id: 'Nama Orang' })}</Label>
                          <Input
                            id={`name-${index}`}
                            value={testimonial.name}
                            onChange={(e) => {
                              const newTestimonials = [...welcomeData.testimonials]
                              newTestimonials[index].name = e.target.value
                              setWelcomeData({ ...welcomeData, testimonials: newTestimonials })
                            }}
                            placeholder={t({ en: 'Enter person name', id: 'Masukkan nama orang' })}
                            className="mt-1"
                          />
                        </div>

                        {/* Testimonial Position - English */}
                        <div>
                          <Label htmlFor={`position-en-${index}`}>{t({ en: 'Position (EN)', id: 'Posisi (EN)' })}</Label>
                          <Input
                            id={`position-en-${index}`}
                            value={testimonial.positionEn}
                            onChange={(e) => {
                              const newTestimonials = [...welcomeData.testimonials]
                              newTestimonials[index].positionEn = e.target.value
                              setWelcomeData({ ...welcomeData, testimonials: newTestimonials })
                            }}
                            placeholder={t({ en: 'Enter position in English', id: 'Masukkan posisi dalam bahasa Inggris' })}
                            className="mt-1"
                          />
                        </div>

                        {/* Testimonial Position - Indonesian */}
                        <div>
                          <Label htmlFor={`position-id-${index}`}>{t({ en: 'Position (ID)', id: 'Posisi (ID)' })}</Label>
                          <Input
                            id={`position-id-${index}`}
                            value={testimonial.positionId}
                            onChange={(e) => {
                              const newTestimonials = [...welcomeData.testimonials]
                              newTestimonials[index].positionId = e.target.value
                              setWelcomeData({ ...welcomeData, testimonials: newTestimonials })
                            }}
                            placeholder={t({ en: 'Enter position in Indonesian', id: 'Masukkan posisi dalam bahasa Indonesia' })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky save bar */}
              <div className="sticky bottom-0 z-10 mt-6 -mx-6 px-6 py-3 bg-card border-t border-border flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setWelcomeData({
                      ...welcomeData,
                      testimonials: [
                        ...welcomeData.testimonials,
                        { quoteEn: '', quoteId: '', name: '', positionEn: '', positionId: '', image: '' }
                      ]
                    })
                  }}
                >
                  + {t({ en: 'Add Testimonial', id: 'Tambah Testimoni' })}
                </Button>
                <Button onClick={() => handleSave('welcome')} disabled={isSaving === 'welcome'}>
                  {isSaving === 'welcome' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ─── Report (read-only) ──────────────────────────────────── */}
          <TabsContent value="report">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Report Section (Our Latest Publication)', id: 'Section Laporan (Publikasi Terbaru Kami)' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Shows the pinned report from Knowledge Hub. Manage reports in the Knowledge Hub menu.', id: 'Menampilkan laporan yang di-pin dari Knowledge Hub. Kelola laporan di menu Knowledge Hub.' })}
                </p>
              </div>

              {pinnedReport && pinnedReport.pinned ? (
                <div className="flex items-start gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
                  {pinnedReport.cover && (
                    <div className="relative w-20 h-28 rounded-lg overflow-hidden border border-border shrink-0">
                      <Image src={pinnedReport.cover} alt={pinnedReport.titleEn || ''} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Pin className="h-3.5 w-3.5 text-primary fill-current" />
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {t({ en: 'Pinned to Homepage', id: 'Di-pin ke Beranda' })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground line-clamp-2">{pinnedReport.titleEn}</h3>
                    {pinnedReport.titleId && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{pinnedReport.titleId}</p>
                    )}
                    {pinnedReport.tags && pinnedReport.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {pinnedReport.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs border border-border">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pinnedReport.hasPdf ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                        {pinnedReport.hasPdf ? t({ en: '✓ PDF Available', id: '✓ PDF Tersedia' }) : t({ en: 'No PDF', id: 'Tidak Ada PDF' })}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t({ en: 'No report is pinned. The homepage section will be hidden.', id: 'Belum ada laporan yang di-pin. Section beranda akan disembunyikan.' })}
                  </p>
                </div>
              )}
              <div className="mt-4">
                <Link href="/cms/knowledge-hub" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                  <ExternalLink className="h-4 w-4" />
                  {t({ en: 'Manage Reports in Knowledge Hub →', id: 'Kelola Laporan di Knowledge Hub →' })}
                </Link>
              </div>
            </Card>
          </TabsContent>

          {/* ─── Footer ─────────────────────────────────────────────── */}
          <TabsContent value="footer">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Footer', id: 'Footer' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage footer content including about, contact, and social links', id: 'Kelola konten footer termasuk tentang, kontak, dan link sosial' })}
                </p>
              </div>

              <div className="space-y-6">
                {/* About Section */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-4">{t({ en: 'About Section', id: 'Section Tentang' })}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="about-title-en">{t({ en: 'Title (EN)', id: 'Judul (EN)' })}</Label>
                      <Input
                        id="about-title-en"
                        value={footerData.aboutTitleEn}
                        onChange={(e) => setFooterData({ ...footerData, aboutTitleEn: e.target.value })}
                        placeholder="e.g., About ADIGSI"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-title-id">{t({ en: 'Title (ID)', id: 'Judul (ID)' })}</Label>
                      <Input
                        id="about-title-id"
                        value={footerData.aboutTitleId}
                        onChange={(e) => setFooterData({ ...footerData, aboutTitleId: e.target.value })}
                        placeholder="cth., Tentang ADIGSI"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-desc-en">{t({ en: 'Description (EN)', id: 'Deskripsi (EN)' })}</Label>
                      <textarea
                        id="about-desc-en"
                        value={footerData.aboutDescriptionEn}
                        onChange={(e) => setFooterData({ ...footerData, aboutDescriptionEn: e.target.value })}
                        placeholder={t({ en: 'Enter about description in English', id: 'Masukkan deskripsi tentang dalam English' })}
                        className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-desc-id">{t({ en: 'Description (ID)', id: 'Deskripsi (ID)' })}</Label>
                      <textarea
                        id="about-desc-id"
                        value={footerData.aboutDescriptionId}
                        onChange={(e) => setFooterData({ ...footerData, aboutDescriptionId: e.target.value })}
                        placeholder={t({ en: 'Enter about description in Indonesian', id: 'Masukkan deskripsi tentang dalam Indonesia' })}
                        className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-4">{t({ en: 'Social Media Links', id: 'Link Media Sosial' })}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="instagram-url">{t({ en: 'Instagram URL', id: 'URL Instagram' })}</Label>
                      <Input
                        id="instagram-url"
                        value={footerData.instagramUrl}
                        onChange={(e) => setFooterData({ ...footerData, instagramUrl: e.target.value })}
                        placeholder="https://instagram.com/..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp-url">{t({ en: 'WhatsApp URL', id: 'URL WhatsApp' })}</Label>
                      <Input
                        id="whatsapp-url"
                        value={footerData.whatsappUrl}
                        onChange={(e) => setFooterData({ ...footerData, whatsappUrl: e.target.value })}
                        placeholder="https://wa.me/..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin-url">{t({ en: 'LinkedIn URL', id: 'URL LinkedIn' })}</Label>
                      <Input
                        id="linkedin-url"
                        value={footerData.linkedinUrl}
                        onChange={(e) => setFooterData({ ...footerData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/company/..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-4">{t({ en: 'Contact Information', id: 'Informasi Kontak' })}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">{t({ en: 'Email', id: 'Email' })}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={footerData.email}
                        onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                        placeholder="info@adigsi.id"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t({ en: 'Phone', id: 'Telepon' })}</Label>
                      <Input
                        id="phone"
                        value={footerData.phone}
                        onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
                        placeholder="+62 851-2111-7245"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-4">{t({ en: 'Address', id: 'Alamat' })}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address-en">{t({ en: 'Address (EN)', id: 'Alamat (EN)' })}</Label>
                      <textarea
                        id="address-en"
                        value={footerData.addressEn}
                        onChange={(e) => setFooterData({ ...footerData, addressEn: e.target.value })}
                        placeholder="Enter address in English"
                        className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address-id">{t({ en: 'Address (ID)', id: 'Alamat (ID)' })}</Label>
                      <textarea
                        id="address-id"
                        value={footerData.addressId}
                        onChange={(e) => setFooterData({ ...footerData, addressId: e.target.value })}
                        placeholder="Masukkan alamat dalam Indonesia"
                        className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Copyright */}
                <div>
                  <h3 className="font-semibold mb-4">{t({ en: 'Copyright', id: 'Hak Cipta' })}</h3>
                  <div>
                    <Label htmlFor="copyright-year">{t({ en: 'Copyright Year', id: 'Tahun Hak Cipta' })}</Label>
                    <Input
                      id="copyright-year"
                      value={footerData.copyrightYear}
                      onChange={(e) => setFooterData({ ...footerData, copyrightYear: e.target.value })}
                      placeholder={new Date().getFullYear().toString()}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky save bar */}
              <div className="sticky bottom-0 z-10 mt-6 -mx-6 px-6 py-3 bg-card border-t border-border">
                <Button onClick={() => handleSave('footer')} disabled={isSaving === 'footer'} className="w-full">
                  {isSaving === 'footer' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ─── Floating Buttons ────────────────────────────────────── */}
          <TabsContent value="floating">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Floating Buttons', id: 'Tombol Melayang' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Configure the join and contact floating buttons', id: 'Konfigurasi tombol join dan kontak' })}
                </p>
              </div>

              <div className="space-y-6">
                {/* Join Button */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">{t({ en: 'Join Button (side tab)', id: 'Tombol Join (tab samping)' })}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t({ en: 'Text (EN)', id: 'Teks (EN)' })}</Label>
                      <Input
                        value={floatingData.joinButton.textEn}
                        onChange={(e) => setFloatingData(prev => ({ ...prev, joinButton: { ...prev.joinButton, textEn: e.target.value } }))}
                        placeholder="Join Now"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>{t({ en: 'Text (ID)', id: 'Teks (ID)' })}</Label>
                      <Input
                        value={floatingData.joinButton.textId}
                        onChange={(e) => setFloatingData(prev => ({ ...prev, joinButton: { ...prev.joinButton, textId: e.target.value } }))}
                        placeholder="Daftar"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{t({ en: 'Link / URL', id: 'Tautan / URL' })}</Label>
                    <Input
                      value={floatingData.joinButton.link}
                      onChange={(e) => setFloatingData(prev => ({ ...prev, joinButton: { ...prev.joinButton, link: e.target.value } }))}
                      placeholder="https://... or /register"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">{t({ en: 'Icon', id: 'Ikon' })}</Label>
                    <IconPicker
                      value={floatingData.joinButton.icon}
                      onChange={(icon) => setFloatingData(prev => ({ ...prev, joinButton: { ...prev.joinButton, icon } }))}
                    />
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Contact Button */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">{t({ en: 'Contact Button (bottom right)', id: 'Tombol Kontak (kanan bawah)' })}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t({ en: 'Email Address', id: 'Alamat Email' })}</Label>
                      <Input
                        type="email"
                        value={floatingData.contactButton.email}
                        onChange={(e) => setFloatingData(prev => ({ ...prev, contactButton: { ...prev.contactButton, email: e.target.value } }))}
                        placeholder="info@adigsi.id"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>{t({ en: 'WhatsApp URL', id: 'URL WhatsApp' })}</Label>
                      <Input
                        value={floatingData.contactButton.whatsapp}
                        onChange={(e) => setFloatingData(prev => ({ ...prev, contactButton: { ...prev.contactButton, whatsapp: e.target.value } }))}
                        placeholder="https://wa.me/628..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky save bar */}
              <div className="sticky bottom-0 z-10 mt-6 -mx-6 px-6 py-3 bg-card border-t border-border">
                <Button onClick={() => handleSave('floating')} disabled={isSaving === 'floating'} className="w-full">
                  {isSaving === 'floating' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
