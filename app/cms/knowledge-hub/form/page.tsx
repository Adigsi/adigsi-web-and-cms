'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface ReportFormData {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  cover: string
  tags: string[]
  pdfFile: string
  published: boolean
}

export default function CMSKnowledgeHubFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(!!editId)
  const [apiTags, setApiTags] = useState<{ _id: string; nameEn: string; nameId: string }[]>([])
  const coverInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [hasPdf, setHasPdf] = useState(false)

  const [formData, setFormData] = useState<ReportFormData>({
    titleEn: '',
    titleId: '',
    descriptionEn: '',
    descriptionId: '',
    cover: '',
    tags: [],
    pdfFile: '',
    published: true,
  })

  // Fetch API tags
  useEffect(() => {
    const fetchApiTags = async () => {
      try {
        const res = await fetch('/api/cms/reports/tags?active=true')
        if (res.ok) {
          const data = await res.json()
          setApiTags(data.tags || [])
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchApiTags()
  }, [])

  // Fetch existing data if editing
  useEffect(() => {
    if (!editId) return
    const fetchReport = async () => {
      try {
        // Fetch list and find the one with matching _id
        const res = await fetch(`/api/cms/reports?limit=1&page=1`)
        // We can't easily get single by ID from GET list route; use a targeted search
        // Actually fetch all and find — but better: we fetch with a special approach
        // Since our GET route doesn't support single fetch by ID, we'll search by title
        // Instead, let's add a simple workaround: fetch from the list endpoint
        // A better approach: since we need to GET edit data including pdfFile (but pdfFile is projected out),
        // we fetch the metadata from list (no pdfFile), which is fine for form display
        // User can re-upload PDF if needed, or leave blank to keep existing
        const searchRes = await fetch(`/api/cms/reports?limit=100&page=1`)
        if (searchRes.ok) {
          const data = await searchRes.json()
          const report = data.data.find((r: { _id: string }) => r._id === editId)
          if (report) {
            setFormData({
              titleEn: report.titleEn || '',
              titleId: report.titleId || '',
              descriptionEn: report.descriptionEn || '',
              descriptionId: report.descriptionId || '',
              cover: report.cover || '',
              tags: report.tags || [],
              pdfFile: '', // Can't retrieve base64 PDF; user re-uploads to change
              published: report.published ?? false,
            })
            setHasPdf(report.hasPdf || false)
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReport()
  }, [editId])

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Image must be less than 5MB', id: 'Gambar harus kurang dari 5MB' }), variant: 'destructive' })
      return
    }
    if (!file.type.startsWith('image/')) {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Only image files allowed', id: 'Hanya file gambar yang diizinkan' }), variant: 'destructive' })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setFormData((f) => ({ ...f, cover: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Only PDF files allowed', id: 'Hanya file PDF yang diizinkan' }), variant: 'destructive' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'PDF must be less than 10MB', id: 'PDF harus kurang dari 10MB' }), variant: 'destructive' })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setFormData((f) => ({ ...f, pdfFile: ev.target?.result as string }))
      setHasPdf(true)
    }
    reader.readAsDataURL(file)
  }

  const toggleTag = (nameEn: string) => {
    setFormData((f) =>
      f.tags.includes(nameEn)
        ? { ...f, tags: f.tags.filter((t) => t !== nameEn) }
        : { ...f, tags: [...f.tags, nameEn] }
    )
  }

  const removeTag = (tag: string) => {
    setFormData((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
  }

  const handleSave = async () => {
    if (!formData.titleEn.trim() || !formData.titleId.trim()) {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Title (EN and ID) is required', id: 'Judul EN dan ID wajib diisi' }), variant: 'destructive' })
      return
    }

    setIsSaving(true)
    try {
      const payload: Record<string, unknown> = {
        titleEn: formData.titleEn,
        titleId: formData.titleId,
        descriptionEn: formData.descriptionEn,
        descriptionId: formData.descriptionId,
        cover: formData.cover,
        tags: formData.tags,
        published: formData.published,
      }
      // Only include pdfFile if user uploaded a new one
      if (formData.pdfFile) {
        payload.pdfFile = formData.pdfFile
      }

      let res: Response
      if (editId) {
        res = await fetch(`/api/cms/reports?id=${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/cms/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }

      toast({
        title: t({ en: 'Success', id: 'Sukses' }),
        description: editId
          ? t({ en: 'Report updated successfully', id: 'Laporan berhasil diperbarui' })
          : t({ en: 'Report created successfully', id: 'Laporan berhasil dibuat' }),
      })
      router.push('/cms/knowledge-hub')
    } catch (error) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to save', id: 'Gagal menyimpan' }),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">{t({ en: 'Loading...', id: 'Memuat...' })}</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/cms/knowledge-hub')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t({ en: 'Back', id: 'Kembali' })}
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {editId ? t({ en: 'Edit Report', id: 'Edit Laporan' }) : t({ en: 'Add Report', id: 'Tambah Laporan' })}
          </h1>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        {/* Title EN */}
        <div>
          <Label htmlFor="titleEn">{t({ en: 'Title (English)', id: 'Judul (English)' })} *</Label>
          <Input
            id="titleEn"
            value={formData.titleEn}
            onChange={(e) => setFormData((f) => ({ ...f, titleEn: e.target.value }))}
            placeholder={t({ en: 'Report title in English', id: 'Judul laporan dalam Bahasa Inggris' })}
          />
        </div>

        {/* Title ID */}
        <div>
          <Label htmlFor="titleId">{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })} *</Label>
          <Input
            id="titleId"
            value={formData.titleId}
            onChange={(e) => setFormData((f) => ({ ...f, titleId: e.target.value }))}
            placeholder={t({ en: 'Report title in Indonesian', id: 'Judul laporan dalam Bahasa Indonesia' })}
          />
        </div>

        {/* Description EN */}
        <div>
          <Label htmlFor="descEn">{t({ en: 'Description (English)', id: 'Deskripsi (English)' })}</Label>
          <textarea
            id="descEn"
            rows={4}
            value={formData.descriptionEn}
            onChange={(e) => setFormData((f) => ({ ...f, descriptionEn: e.target.value }))}
            placeholder={t({ en: 'Report description in English', id: 'Deskripsi laporan dalam Bahasa Inggris' })}
            className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
          />
        </div>

        {/* Description ID */}
        <div>
          <Label htmlFor="descId">{t({ en: 'Description (Bahasa Indonesia)', id: 'Deskripsi (Bahasa Indonesia)' })}</Label>
          <textarea
            id="descId"
            rows={4}
            value={formData.descriptionId}
            onChange={(e) => setFormData((f) => ({ ...f, descriptionId: e.target.value }))}
            placeholder={t({ en: 'Report description in Indonesian', id: 'Deskripsi laporan dalam Bahasa Indonesia' })}
            className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
          />
        </div>

        {/* Tags */}
        <div>
          <Label>{t({ en: 'Tags', id: 'Tag' })}</Label>
          <p className="text-xs text-muted-foreground mb-2">
            {t({ en: 'Select tags from the list below', id: 'Pilih tag dari daftar di bawah' })}
          </p>

          {apiTags.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              {t({ en: 'No tags available. Add tags in Knowledge Hub → Report Tags.', id: 'Belum ada tag. Tambahkan di Knowledge Hub → Tag Laporan.' })}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {apiTags.map((tag) => {
                const selected = formData.tags.includes(tag.nameEn)
                return (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => toggleTag(tag.nameEn)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
                      ${
                        selected
                          ? 'bg-primary/10 border-primary/40 text-primary'
                          : 'bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                      }`}
                  >
                    {selected && <span>✓</span>}
                    {tag.nameEn} / {tag.nameId}
                    {selected && (
                      <span
                        role="button"
                        onClick={(e) => { e.stopPropagation(); removeTag(tag.nameEn) }}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <Label>{t({ en: 'Cover Image', id: 'Gambar Cover' })}</Label>
          <p className="text-xs text-muted-foreground mb-2">{t({ en: 'Max 5MB (JPG, PNG, WebP)', id: 'Maks 5MB (JPG, PNG, WebP)' })}</p>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          {formData.cover ? (
            <div className="flex items-start gap-4">
              <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-border shadow">
                <Image src={formData.cover} alt="Cover" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => coverInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />{t({ en: 'Change', id: 'Ganti' })}
                </Button>
                <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setFormData((f) => ({ ...f, cover: '' }))}>
                  <X className="h-4 w-4 mr-2" />{t({ en: 'Remove', id: 'Hapus' })}
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t({ en: 'Click to upload cover image', id: 'Klik untuk upload gambar cover' })}</p>
            </button>
          )}
        </div>

        {/* PDF Upload */}
        <div>
          <Label>{t({ en: 'PDF File', id: 'File PDF' })}</Label>
          <p className="text-xs text-muted-foreground mb-2">{t({ en: 'Max 10MB. Only PDF files.', id: 'Maks 10MB. Hanya file PDF.' })}</p>
          <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => pdfInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              {formData.pdfFile
                ? t({ en: 'Change PDF', id: 'Ganti PDF' })
                : hasPdf
                ? t({ en: 'Replace Existing PDF', id: 'Ganti PDF yang Ada' })
                : t({ en: 'Upload PDF', id: 'Upload PDF' })}
            </Button>
            {(formData.pdfFile || hasPdf) && (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {formData.pdfFile
                  ? t({ en: 'New PDF ready', id: 'PDF baru siap' })
                  : t({ en: 'Existing PDF', id: 'PDF sudah ada' })}
              </span>
            )}
          </div>
          {editId && !formData.pdfFile && hasPdf && (
            <p className="text-xs text-muted-foreground mt-1.5">
              {t({ en: 'Leave blank to keep existing PDF', id: 'Biarkan kosong untuk menyimpan PDF yang ada' })}
            </p>
          )}
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData((f) => ({ ...f, published: checked }))}
          />
          <Label htmlFor="published" className="cursor-pointer">
            {t({ en: 'Published', id: 'Dipublikasikan' })}
          </Label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving
              ? t({ en: 'Saving...', id: 'Menyimpan...' })
              : editId
              ? t({ en: 'Save Changes', id: 'Simpan Perubahan' })
              : t({ en: 'Create Report', id: 'Buat Laporan' })}
          </Button>
          <Button variant="outline" onClick={() => router.push('/cms/knowledge-hub')} disabled={isSaving}>
            {t({ en: 'Cancel', id: 'Batalkan' })}
          </Button>
        </div>
      </Card>
    </div>
  )
}
