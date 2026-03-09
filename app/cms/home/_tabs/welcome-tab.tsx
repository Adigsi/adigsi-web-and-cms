'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

const DEFAULT: WelcomeData = {
  titleSmallEn: '', titleSmallId: '', titleLargeEn: '', titleLargeId: '',
  testimonials: [],
}

export function WelcomeTab() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [data, setData] = useState<WelcomeData>(DEFAULT)

  useEffect(() => {
    fetch('/api/cms/home/welcome')
      .then((res) => res.ok ? res.json() : null)
      .then((json) => { if (json) setData(json) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'File size must be less than 5MB', id: 'Ukuran file harus kurang dari 5MB' }), variant: 'destructive' })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      setData((prev) => {
        const testimonials = [...prev.testimonials]
        testimonials[index] = { ...testimonials[index], image: base64 }
        return { ...prev, testimonials }
      })
    }
    reader.readAsDataURL(file)
  }

  const updateTestimonial = (index: number, patch: Partial<Testimonial>) => {
    setData((prev) => {
      const testimonials = [...prev.testimonials]
      testimonials[index] = { ...testimonials[index], ...patch }
      return { ...prev, testimonials }
    })
  }

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null) return
    setData((prev) => {
      const testimonials = [...prev.testimonials]
      const [moved] = testimonials.splice(draggedIndex, 1)
      testimonials.splice(targetIndex, 0, moved)
      return { ...prev, testimonials }
    })
    setDraggedIndex(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/cms/home/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Welcome section saved successfully', id: 'Section welcome berhasil disimpan' }) })
    } catch (err) {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: err instanceof Error ? err.message : t({ en: 'Failed to save changes', id: 'Gagal menyimpan perubahan' }), variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="py-12 text-center text-muted-foreground">{t({ en: 'Loading...', id: 'Memuat...' })}</div>
      </Card>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Welcome Section', id: 'Section Welcome' })}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t({ en: 'Manage the welcome section with titles and testimonials', id: 'Kelola section welcome dengan judul dan testimoni' })}
              </p>
            </div>

            <div className="space-y-6">
              {/* Titles */}
              <div>
                <h3 className="font-semibold mb-4">{t({ en: 'Titles', id: 'Judul' })}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="welcome-title-small-en">{t({ en: 'Small Title (EN)', id: 'Judul Kecil (EN)' })}</Label>
                    <Input id="welcome-title-small-en" value={data.titleSmallEn} onChange={(e) => setData({ ...data, titleSmallEn: e.target.value })} placeholder="e.g., Welcome to Adigsi" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="welcome-title-small-id">{t({ en: 'Small Title (ID)', id: 'Judul Kecil (ID)' })}</Label>
                    <Input id="welcome-title-small-id" value={data.titleSmallId} onChange={(e) => setData({ ...data, titleSmallId: e.target.value })} placeholder="cth., Selamat Datang di Adigsi" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="welcome-title-large-en">{t({ en: 'Large Title (EN)', id: 'Judul Besar (EN)' })}</Label>
                    <Input id="welcome-title-large-en" value={data.titleLargeEn} onChange={(e) => setData({ ...data, titleLargeEn: e.target.value })} placeholder="e.g., Indonesian Digitalization..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="welcome-title-large-id">{t({ en: 'Large Title (ID)', id: 'Judul Besar (ID)' })}</Label>
                    <Input id="welcome-title-large-id" value={data.titleLargeId} onChange={(e) => setData({ ...data, titleLargeId: e.target.value })} placeholder="cth., Asosiasi Digital..." className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">{t({ en: 'Testimonials', id: 'Testimoni' })}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => setDraggedIndex(index)}
                      onDragEnd={() => setDraggedIndex(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(index)}
                      className={`border border-border rounded-lg p-4 space-y-4 cursor-move transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                        } hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{t({ en: 'Testimonial', id: 'Testimoni' })} {index + 1}</h4>
                        <Button variant="destructive" size="sm" onClick={() => setData({ ...data, testimonials: data.testimonials.filter((_, i) => i !== index) })}>
                          {t({ en: 'Delete', id: 'Hapus' })}
                        </Button>
                      </div>

                      <div>
                        <Label>{t({ en: 'Person Image', id: 'Gambar Orang' })}</Label>
                        <div className="mt-2 space-y-3">
                          {testimonial.image && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                              <img src={testimonial.image} alt="Testimonial" className="w-full h-full object-cover" />
                              <button
                                onClick={() => updateTestimonial(index, { image: '' })}
                                className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              <span className="text-sm text-muted-foreground">{t({ en: 'Upload Image', id: 'Unggah Gambar' })}</span>
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} className="hidden" />
                          </label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`quote-en-${index}`}>{t({ en: 'Quote (EN)', id: 'Kutipan (EN)' })}</Label>
                        <textarea id={`quote-en-${index}`} value={testimonial.quoteEn} onChange={(e) => updateTestimonial(index, { quoteEn: e.target.value })} placeholder={t({ en: 'Enter quote in English', id: 'Masukkan kutipan dalam bahasa Inggris' })} className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={3} />
                      </div>

                      <div>
                        <Label htmlFor={`quote-id-${index}`}>{t({ en: 'Quote (ID)', id: 'Kutipan (ID)' })}</Label>
                        <textarea id={`quote-id-${index}`} value={testimonial.quoteId} onChange={(e) => updateTestimonial(index, { quoteId: e.target.value })} placeholder={t({ en: 'Enter quote in Indonesian', id: 'Masukkan kutipan dalam bahasa Indonesia' })} className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={3} />
                      </div>

                      <div>
                        <Label htmlFor={`name-${index}`}>{t({ en: 'Person Name', id: 'Nama Orang' })}</Label>
                        <Input id={`name-${index}`} value={testimonial.name} onChange={(e) => updateTestimonial(index, { name: e.target.value })} placeholder={t({ en: 'Enter person name', id: 'Masukkan nama orang' })} className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor={`position-en-${index}`}>{t({ en: 'Position (EN)', id: 'Posisi (EN)' })}</Label>
                        <Input id={`position-en-${index}`} value={testimonial.positionEn} onChange={(e) => updateTestimonial(index, { positionEn: e.target.value })} placeholder={t({ en: 'Enter position in English', id: 'Masukkan posisi dalam bahasa Inggris' })} className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor={`position-id-${index}`}>{t({ en: 'Position (ID)', id: 'Posisi (ID)' })}</Label>
                        <Input id={`position-id-${index}`} value={testimonial.positionId} onChange={(e) => updateTestimonial(index, { positionId: e.target.value })} placeholder={t({ en: 'Enter position in Indonesian', id: 'Masukkan posisi dalam bahasa Indonesia' })} className="mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </Card>
        </div>
        <div className="sticky bottom-0 z-10 mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.06)] flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setData({ ...data, testimonials: [...data.testimonials, { quoteEn: '', quoteId: '', name: '', positionEn: '', positionId: '', image: '' }] })}
          >
            + {t({ en: 'Add Testimonial', id: 'Tambah Testimoni' })}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </div>
    </>
  )
}
