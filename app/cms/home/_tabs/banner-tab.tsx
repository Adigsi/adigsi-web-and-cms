'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

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

const DEFAULT: BannerData = {
  titleSmallEn: '', titleSmallId: '', titleLargeEn: '', titleLargeId: '',
  descriptionEn: '', descriptionId: '',
  primaryButton: { enabled: true, textEn: '', textId: '', link: '' },
  secondaryButton: { enabled: false, textEn: '', textId: '', link: '' },
}

export function BannerTab() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<BannerData>(DEFAULT)

  useEffect(() => {
    fetch('/api/cms/home/banner')
      .then((res) => res.ok ? res.json() : null)
      .then((json) => { if (json) setData(json) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/cms/home/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Banner saved successfully', id: 'Banner berhasil disimpan' }) })
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
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Hero Banner', id: 'Banner Hero' })}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage the hero banner with titles, description and optional buttons', id: 'Kelola banner hero dengan judul, deskripsi dan tombol opsional' })}
        </p>
      </div>

      <div className="space-y-6">
        {/* Titles */}
        <div>
          <h3 className="font-semibold mb-4">{t({ en: 'Titles', id: 'Judul' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title-small-en">{t({ en: 'Small Title (EN)', id: 'Judul Kecil (EN)' })}</Label>
              <Input id="title-small-en" value={data.titleSmallEn} onChange={(e) => setData({ ...data, titleSmallEn: e.target.value })} placeholder="e.g., WELCOME TO ADIGSI" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="title-small-id">{t({ en: 'Small Title (ID)', id: 'Judul Kecil (ID)' })}</Label>
              <Input id="title-small-id" value={data.titleSmallId} onChange={(e) => setData({ ...data, titleSmallId: e.target.value })} placeholder="cth., SELAMAT DATANG DI ADIGSI" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="title-large-en">{t({ en: 'Large Title (EN)', id: 'Judul Besar (EN)' })}</Label>
              <Input id="title-large-en" value={data.titleLargeEn} onChange={(e) => setData({ ...data, titleLargeEn: e.target.value })} placeholder="e.g., Safeguarding Indonesia's Digital Future" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="title-large-id">{t({ en: 'Large Title (ID)', id: 'Judul Besar (ID)' })}</Label>
              <Input id="title-large-id" value={data.titleLargeId} onChange={(e) => setData({ ...data, titleLargeId: e.target.value })} placeholder="cth., Mengamankan Masa Depan Digital Indonesia" className="mt-1" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4">{t({ en: 'Description', id: 'Deskripsi' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="desc-en">{t({ en: 'Description (EN)', id: 'Deskripsi (EN)' })}</Label>
              <textarea id="desc-en" value={data.descriptionEn} onChange={(e) => setData({ ...data, descriptionEn: e.target.value })} placeholder={t({ en: 'Enter description in English', id: 'Masukkan deskripsi dalam English' })} className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={3} />
            </div>
            <div>
              <Label htmlFor="desc-id">{t({ en: 'Description (ID)', id: 'Deskripsi (ID)' })}</Label>
              <textarea id="desc-id" value={data.descriptionId} onChange={(e) => setData({ ...data, descriptionId: e.target.value })} placeholder={t({ en: 'Enter description in Indonesian', id: 'Masukkan deskripsi dalam Indonesia' })} className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={3} />
            </div>
          </div>
        </div>

        {/* Primary Button */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t({ en: 'Primary Button', id: 'Tombol Primer' })}</h3>
            <div className="flex items-center gap-2">
              <Checkbox id="primary-btn-enabled" checked={data.primaryButton.enabled} onCheckedChange={(c) => setData({ ...data, primaryButton: { ...data.primaryButton, enabled: !!c } })} />
              <Label htmlFor="primary-btn-enabled">{t({ en: 'Enabled', id: 'Aktif' })}</Label>
            </div>
          </div>
          {data.primaryButton.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primary-btn-text-en">{t({ en: 'Button Text (EN)', id: 'Teks Tombol (EN)' })}</Label>
                <Input id="primary-btn-text-en" value={data.primaryButton.textEn} onChange={(e) => setData({ ...data, primaryButton: { ...data.primaryButton, textEn: e.target.value } })} placeholder="e.g., About Us" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="primary-btn-text-id">{t({ en: 'Button Text (ID)', id: 'Teks Tombol (ID)' })}</Label>
                <Input id="primary-btn-text-id" value={data.primaryButton.textId} onChange={(e) => setData({ ...data, primaryButton: { ...data.primaryButton, textId: e.target.value } })} placeholder="cth., Tentang Kami" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="primary-btn-link">{t({ en: 'Button Link', id: 'Link Tombol' })}</Label>
                <Input id="primary-btn-link" value={data.primaryButton.link} onChange={(e) => setData({ ...data, primaryButton: { ...data.primaryButton, link: e.target.value } })} placeholder="e.g., /about" className="mt-1" />
              </div>
            </div>
          )}
        </div>

        {/* Secondary Button */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t({ en: 'Secondary Button', id: 'Tombol Sekunder' })}</h3>
            <div className="flex items-center gap-2">
              <Checkbox id="secondary-btn-enabled" checked={data.secondaryButton.enabled} onCheckedChange={(c) => setData({ ...data, secondaryButton: { ...data.secondaryButton, enabled: !!c } })} />
              <Label htmlFor="secondary-btn-enabled">{t({ en: 'Enabled', id: 'Aktif' })}</Label>
            </div>
          </div>
          {data.secondaryButton.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="secondary-btn-text-en">{t({ en: 'Button Text (EN)', id: 'Teks Tombol (EN)' })}</Label>
                <Input id="secondary-btn-text-en" value={data.secondaryButton.textEn} onChange={(e) => setData({ ...data, secondaryButton: { ...data.secondaryButton, textEn: e.target.value } })} placeholder="e.g., Join Now" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="secondary-btn-text-id">{t({ en: 'Button Text (ID)', id: 'Teks Tombol (ID)' })}</Label>
                <Input id="secondary-btn-text-id" value={data.secondaryButton.textId} onChange={(e) => setData({ ...data, secondaryButton: { ...data.secondaryButton, textId: e.target.value } })} placeholder="cth., Bergabung Sekarang" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="secondary-btn-link">{t({ en: 'Button Link', id: 'Link Tombol' })}</Label>
                <Input id="secondary-btn-link" value={data.secondaryButton.link} onChange={(e) => setData({ ...data, secondaryButton: { ...data.secondaryButton, link: e.target.value } })} placeholder="e.g., https://forms.example.com" className="mt-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 z-10 mt-6 -mx-6 px-6 py-3 bg-card border-t border-border">
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
        </Button>
      </div>
    </Card>
  )
}
