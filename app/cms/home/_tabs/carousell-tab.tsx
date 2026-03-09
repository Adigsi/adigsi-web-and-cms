'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CarousellSlide {
  image: string
  link?: string
  published?: boolean
}

interface CarousellData {
  slides: CarousellSlide[]
}

export function CarousellTab() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [draggedSlide, setDraggedSlide] = useState<number | null>(null)
  const [data, setData] = useState<CarousellData>({ slides: [] })

  useEffect(() => {
    fetch('/api/cms/home/carousell')
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        if (json) setData({ slides: Array.isArray(json.slides) ? json.slides : [] })
      })
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
      const newSlides = [...data.slides]
      newSlides[index].image = ev.target?.result as string
      setData({ slides: newSlides })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/cms/home/carousell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Carousell saved successfully', id: 'Carousell berhasil disimpan' }) })
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
        <Card className="p-6 flex-1">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Carousell Section', id: 'Section Carousell' })}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t({ en: 'Manage carousell banners with images and optional links', id: 'Kelola banner carousell dengan gambar dan link opsional' })}
            </p>
          </div>

          <div className="space-y-4">
            {/* Ratio notice */}
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
              <p className="text-xs font-medium leading-snug">
                {t({ en: 'All slide images must use a 1:1 (square) ratio. Images with different ratios will be cropped automatically.', id: 'Semua gambar slide harus menggunakan rasio 1:1 (persegi). Gambar dengan rasio berbeda akan dipotong secara otomatis.' })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.slides.length > 0 ? (
                data.slides.map((slide, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => setDraggedSlide(index)}
                    onDragEnd={() => setDraggedSlide(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedSlide === null) return
                      const newSlides = [...data.slides]
                      const item = newSlides[draggedSlide]
                      newSlides.splice(draggedSlide, 1)
                      newSlides.splice(index, 0, item)
                      setData({ slides: newSlides })
                      setDraggedSlide(null)
                    }}
                    className={`border border-border rounded-lg p-3 space-y-3 cursor-move transition-all hover:shadow-md ${draggedSlide === index ? 'opacity-50 scale-[0.98]' : 'opacity-100'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-xs shrink-0">{t({ en: 'Slide', id: 'Slide' })} {index + 1}</h4>
                      <label className="inline-flex items-center gap-1.5 text-xs min-w-0">
                        <input
                          type="checkbox"
                          checked={slide.published ?? false}
                          onChange={(e) => {
                            const newSlides = [...data.slides]
                            newSlides[index].published = e.target.checked
                            setData({ slides: newSlides })
                          }}
                          className="h-3 w-3 shrink-0"
                        />
                        <span className="truncate">{slide.published ? t({ en: 'Published', id: 'Publish' }) : t({ en: 'Draft', id: 'Draft' })}</span>
                      </label>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={data.slides.length === 1}
                        className="h-6 px-2 text-xs shrink-0"
                        onClick={() => setData({ slides: data.slides.filter((_, i) => i !== index) })}
                      >
                        {t({ en: 'Delete', id: 'Hapus' })}
                      </Button>
                    </div>

                    <div className="mt-1 space-y-2">
                      {slide.image && (
                        <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted">
                          <img src={slide.image} alt="Carousell preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              const newSlides = [...data.slides]
                              newSlides[index].image = ''
                              setData({ slides: newSlides })
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
                          <span className="text-xs text-muted-foreground">{t({ en: 'Upload (1:1)', id: 'Unggah (1:1)' })}</span>
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} className="hidden" />
                      </label>
                    </div>

                    <Input
                      value={slide.link || ''}
                      onChange={(e) => {
                        const newSlides = [...data.slides]
                        newSlides[index].link = e.target.value
                        setData({ slides: newSlides })
                      }}
                      placeholder="https://... (optional)"
                      className="h-7 text-xs"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-muted-foreground py-6">
                  {t({ en: 'No slides added yet', id: 'Belum ada slide' })}
                </div>
              )}
            </div>
          </div>

        </Card>
        <div className="sticky bottom-0 z-10 mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.06)] flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setData({ slides: [...data.slides, { image: '', link: '', published: true }] })}
          >
            + {t({ en: 'Add Slide', id: 'Tambah Slide' })}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </div>
    </>
  )
}
