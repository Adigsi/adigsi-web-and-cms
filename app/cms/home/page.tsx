'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ChevronDown, Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
  // const [draggedCarousellSlide, setDraggedCarousellSlide] = useState<number | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    carousell: false,
    banner: false,
    welcome: false,
    report: false,
    footer: false,
  })

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
    backgroundImage: '',
    aboutButtonTextEn: '',
    aboutButtonTextId: '',
    aboutButtonLink: '',
    joinButtonTextEn: '',
    joinButtonTextId: '',
    joinButtonLink: '',
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

  // Fetch banner, welcome, report, and footer data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carousellRes, bannerRes, welcomeRes, reportRes, footerRes] = await Promise.all([
          fetch('/api/cms/home/carousell'),
          fetch('/api/cms/home/banner'),
          fetch('/api/cms/home/welcome'),
          fetch('/api/cms/home/report'),
          fetch('/api/cms/home/footer')
        ])

        if (carousellRes.ok) {
          const data = await carousellRes.json()
          setCarousellData({
            slides: Array.isArray(data.slides) ? data.slides : [],
          })
          console.log('Fetched carousell data:', data)
        }

        if (bannerRes.ok) {
          const data = await bannerRes.json()
          setBannerData(data)
          console.log('Fetched banner data:', data)
        }

        if (welcomeRes.ok) {
          const data = await welcomeRes.json()
          setWelcomeData(data)
          console.log('Fetched welcome data:', data)
        }

        if (reportRes.ok) {
          const data = await reportRes.json()
          setReportData(data)
          console.log('Fetched report data:', data)
        }

        if (footerRes.ok) {
          const data = await footerRes.json()
          setFooterData(data)
          console.log('Fetched footer data:', data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setBannerData({ ...bannerData, backgroundImage: base64 })
    }
    reader.readAsDataURL(file)
  }

  // const handleCarousellImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return

  //   if (file.size > 5 * 1024 * 1024) {
  //     toast({
  //       title: t({ en: 'Error', id: 'Kesalahan' }),
  //       description: t({ en: 'File size must be less than 5MB', id: 'Ukuran file harus kurang dari 5MB' }),
  //       variant: 'destructive'
  //     })
  //     return
  //   }

  //   const reader = new FileReader()
  //   reader.onload = (event) => {
  //     const base64 = event.target?.result as string
  //     const newSlides = [...carousellData.slides]
  //     newSlides[slideIndex].image = base64
  //     setCarousellData({ ...carousellData, slides: newSlides })
  //   }
  //   reader.readAsDataURL(file)
  // }

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

  // const handleCarousellDragStart = (index: number) => {
  //   setDraggedCarousellSlide(index)
  // }

  // const handleCarousellDragEnd = () => {
  //   setDraggedCarousellSlide(null)
  // }

  // const handleCarousellDragOver = (e: React.DragEvent) => {
  //   e.preventDefault()
  // }

  // const handleCarousellDrop = (targetIndex: number) => {
  //   if (draggedCarousellSlide === null) return

  //   const newSlides = [...carousellData.slides]
  //   const draggedItem = newSlides[draggedCarousellSlide]
  //   newSlides.splice(draggedCarousellSlide, 1)
  //   newSlides.splice(targetIndex, 0, draggedItem)

  //   setCarousellData({ ...carousellData, slides: newSlides })
  //   setDraggedCarousellSlide(null)
  // }

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
          {/* Carousell Section */}
          {/* <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, carousell: !expandedSections.carousell })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {t({ en: 'Carousell Section', id: 'Section Carousell' })}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage carousell banners with images and optional links', id: 'Kelola banner carousell dengan gambar dan link opsional' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.carousell ? 'rotate-0' : '-rotate-90'}`}
              />
            </div>

            {expandedSections.carousell && (
              <>
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {carousellData.slides.length > 0 ? (
                      carousellData.slides.map((slide, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={() => handleCarousellDragStart(index)}
                          onDragEnd={handleCarousellDragEnd}
                          onDragOver={handleCarousellDragOver}
                          onDrop={() => handleCarousellDrop(index)}
                          className={`border border-border rounded-lg p-4 space-y-4 cursor-move transition-all ${
                            draggedCarousellSlide === index ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'
                          } hover:shadow-md`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">
                              {t({ en: 'Slide', id: 'Slide' })} {index + 1}
                            </h4>
                            <label className="inline-flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={slide.published ?? false}
                                onChange={(e) => {
                                  const newSlides = [...carousellData.slides]
                                  newSlides[index].published = e.target.checked
                                  setCarousellData({ ...carousellData, slides: newSlides })
                                }}
                                className="h-3.5 w-3.5"
                              />
                              <span>
                                {slide.published ? t({ en: 'Published', id: 'Terpublish' }) : t({ en: 'Unpublished', id: 'Tidak Terpublish' })}
                              </span>
                            </label>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={carousellData.slides.length === 1}
                              onClick={() => {
                                const newSlides = carousellData.slides.filter((_, i) => i !== index)
                                setCarousellData({ ...carousellData, slides: newSlides })
                              }}
                            >
                              {t({ en: 'Delete', id: 'Hapus' })}
                            </Button>
                          </div>

                          <div>
                            <Label>{t({ en: 'Image', id: 'Gambar' })}</Label>
                            <div className="mt-2 space-y-3">
                              {slide.image && (
                                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
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
                                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                  >
                                    <X className="h-4 w-4" />
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
                                  onChange={(e) => handleCarousellImageUpload(e, index)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`carousell-link-${index}`}>
                              {t({ en: 'Optional Link', id: 'Link Opsional' })}
                            </Label>
                            <Input
                              id={`carousell-link-${index}`}
                              value={slide.link || ''}
                              onChange={(e) => {
                                const newSlides = [...carousellData.slides]
                                newSlides[index].link = e.target.value
                                setCarousellData({ ...carousellData, slides: newSlides })
                              }}
                              placeholder="https://..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-muted-foreground py-6">
                        {t({ en: 'No slides added yet', id: 'Belum ada slide' })}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
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
                </div>
              </>
            )}
          </Card> */}

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

                  <Button onClick={() => handleSave('banner')} disabled={isSaving === 'banner'} className="w-full">
                    {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Welcome Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, welcome: !expandedSections.welcome })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Welcome Section', id: 'Section Welcome' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage the welcome section with titles and testimonials', id: 'Kelola section welcome dengan judul dan testimoni' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.welcome ? 'rotate-0' : '-rotate-90'}`}
              />
            </div>

            {expandedSections.welcome && (
              <>
                <div className="space-y-6 mt-4">
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

                  <div className="flex gap-3">
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
                </div>
              </>
            )}
          </Card>

          {/* Report Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, report: !expandedSections.report })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Report Section', id: 'Section Report' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage the industry report section with title, description, image and download button', id: 'Kelola section laporan industri dengan judul, deskripsi, gambar dan tombol unduh' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.report ? 'rotate-0' : '-rotate-90'}`}
              />
            </div>

            {expandedSections.report && (
              <>
                <div className="space-y-6 mt-4">
                  {/* Report Image Section */}
                  <div>
                    <Label>{t({ en: 'Report Image', id: 'Gambar Laporan' })}</Label>
                    <div className="mt-2 space-y-3">
                      {reportData.image && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={reportData.image}
                            alt="Report preview"
                            className="w-full h-full object-contain"
                          />
                          <button
                            onClick={() => setReportData({ ...reportData, image: '' })}
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
                              {t({ en: 'Upload Image (max 5MB)', id: 'Unggah Gambar (maks 5MB)' })}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleReportImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Title Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">{t({ en: 'Title', id: 'Judul' })}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="report-title-en">{t({ en: 'Title (EN)', id: 'Judul (EN)' })}</Label>
                        <Input
                          id="report-title-en"
                          value={reportData.titleEn}
                          onChange={(e) => setReportData({ ...reportData, titleEn: e.target.value })}
                          placeholder="e.g., Indonesia Cybersecurity Industry Report"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="report-title-id">{t({ en: 'Title (ID)', id: 'Judul (ID)' })}</Label>
                        <Input
                          id="report-title-id"
                          value={reportData.titleId}
                          onChange={(e) => setReportData({ ...reportData, titleId: e.target.value })}
                          placeholder="cth., Laporan Industri Keamanan Siber Indonesia"
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
                          value={reportData.descriptionEn}
                          onChange={(e) => setReportData({ ...reportData, descriptionEn: e.target.value })}
                          placeholder={t({ en: 'Enter description in English. Use line breaks to separate paragraphs.', id: 'Masukkan deskripsi dalam bahasa Inggris. Gunakan enter untuk memisahkan paragraf.' })}
                          className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                          rows={8}
                        />
                      </div>

                      <div>
                        <Label htmlFor="desc-id">{t({ en: 'Description (ID)', id: 'Deskripsi (ID)' })}</Label>
                        <textarea
                          id="desc-id"
                          value={reportData.descriptionId}
                          onChange={(e) => setReportData({ ...reportData, descriptionId: e.target.value })}
                          placeholder={t({ en: 'Enter description in Indonesian. Use line breaks to separate paragraphs.', id: 'Masukkan deskripsi dalam bahasa Indonesia. Gunakan enter untuk memisahkan paragraf.' })}
                          className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
                          rows={8}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Download Button Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">{t({ en: 'Download Button', id: 'Tombol Unduh' })}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="btn-text-en">{t({ en: 'Button Text (EN)', id: 'Teks Tombol (EN)' })}</Label>
                        <Input
                          id="btn-text-en"
                          value={reportData.buttonTextEn}
                          onChange={(e) => setReportData({ ...reportData, buttonTextEn: e.target.value })}
                          placeholder="e.g., Download Here"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="btn-text-id">{t({ en: 'Button Text (ID)', id: 'Teks Tombol (ID)' })}</Label>
                        <Input
                          id="btn-text-id"
                          value={reportData.buttonTextId}
                          onChange={(e) => setReportData({ ...reportData, buttonTextId: e.target.value })}
                          placeholder="cth., Unduh Di Sini"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>{t({ en: 'PDF File (max 10MB)', id: 'File PDF (maks 10MB)' })}</Label>
                      <div className="mt-2 space-y-3">
                        {reportData.pdfFile && (
                          <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/50">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {t({ en: 'PDF file uploaded', id: 'File PDF terupload' })}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t({ en: 'Click upload to replace', id: 'Klik upload untuk mengganti' })}
                              </p>
                            </div>
                            <button
                              onClick={() => setReportData({ ...reportData, pdfFile: '' })}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm text-muted-foreground">
                              {t({ en: 'Upload PDF File', id: 'Unggah File PDF' })}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleReportPdfUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave('report')} disabled={isSaving === 'report'} className="w-full">
                    {isSaving === 'report' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Footer Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, footer: !expandedSections.footer })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Footer', id: 'Footer' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage footer content including about, contact, and social links', id: 'Kelola konten footer termasuk tentang, kontak, dan link sosial' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.footer ? 'rotate-0' : '-rotate-90'}`}
              />
            </div>

            {expandedSections.footer && (
              <>
                <div className="space-y-6 mt-4">
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

                  <Button onClick={() => handleSave('footer')} disabled={isSaving === 'footer'} className="w-full">
                    {isSaving === 'footer' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
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
