'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

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

const DEFAULT: FooterData = {
  aboutTitleEn: '', aboutTitleId: '', aboutDescriptionEn: '', aboutDescriptionId: '',
  instagramUrl: '', whatsappUrl: '', linkedinUrl: '',
  email: '', phone: '', addressEn: '', addressId: '',
  copyrightYear: new Date().getFullYear().toString(),
}

export function FooterTab() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<FooterData>(DEFAULT)

  useEffect(() => {
    fetch('/api/cms/home/footer')
      .then((res) => res.ok ? res.json() : null)
      .then((json) => { if (json) setData(json) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/cms/home/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Footer saved successfully', id: 'Footer berhasil disimpan' }) })
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
              <Input id="about-title-en" value={data.aboutTitleEn} onChange={(e) => setData({ ...data, aboutTitleEn: e.target.value })} placeholder="e.g., About ADIGSI" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="about-title-id">{t({ en: 'Title (ID)', id: 'Judul (ID)' })}</Label>
              <Input id="about-title-id" value={data.aboutTitleId} onChange={(e) => setData({ ...data, aboutTitleId: e.target.value })} placeholder="cth., Tentang ADIGSI" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="about-desc-en">{t({ en: 'Description (EN)', id: 'Deskripsi (EN)' })}</Label>
              <textarea id="about-desc-en" value={data.aboutDescriptionEn} onChange={(e) => setData({ ...data, aboutDescriptionEn: e.target.value })} placeholder={t({ en: 'Enter about description in English', id: 'Masukkan deskripsi tentang dalam English' })} className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={4} />
            </div>
            <div>
              <Label htmlFor="about-desc-id">{t({ en: 'Description (ID)', id: 'Deskripsi (ID)' })}</Label>
              <textarea id="about-desc-id" value={data.aboutDescriptionId} onChange={(e) => setData({ ...data, aboutDescriptionId: e.target.value })} placeholder={t({ en: 'Enter about description in Indonesian', id: 'Masukkan deskripsi tentang dalam Indonesia' })} className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={4} />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-b pb-4">
          <h3 className="font-semibold mb-4">{t({ en: 'Social Media Links', id: 'Link Media Sosial' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="instagram-url">{t({ en: 'Instagram URL', id: 'URL Instagram' })}</Label>
              <Input id="instagram-url" value={data.instagramUrl} onChange={(e) => setData({ ...data, instagramUrl: e.target.value })} placeholder="https://instagram.com/..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="whatsapp-url">{t({ en: 'WhatsApp URL', id: 'URL WhatsApp' })}</Label>
              <Input id="whatsapp-url" value={data.whatsappUrl} onChange={(e) => setData({ ...data, whatsappUrl: e.target.value })} placeholder="https://wa.me/..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="linkedin-url">{t({ en: 'LinkedIn URL', id: 'URL LinkedIn' })}</Label>
              <Input id="linkedin-url" value={data.linkedinUrl} onChange={(e) => setData({ ...data, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/company/..." className="mt-1" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-b pb-4">
          <h3 className="font-semibold mb-4">{t({ en: 'Contact Information', id: 'Informasi Kontak' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">{t({ en: 'Email', id: 'Email' })}</Label>
              <Input id="email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="info@adigsi.id" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">{t({ en: 'Phone', id: 'Telepon' })}</Label>
              <Input id="phone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+62 851-2111-7245" className="mt-1" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="border-b pb-4">
          <h3 className="font-semibold mb-4">{t({ en: 'Address', id: 'Alamat' })}</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address-en">{t({ en: 'Address (EN)', id: 'Alamat (EN)' })}</Label>
              <textarea id="address-en" value={data.addressEn} onChange={(e) => setData({ ...data, addressEn: e.target.value })} placeholder="Enter address in English" className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={3} />
            </div>
            <div>
              <Label htmlFor="address-id">{t({ en: 'Address (ID)', id: 'Alamat (ID)' })}</Label>
              <textarea id="address-id" value={data.addressId} onChange={(e) => setData({ ...data, addressId: e.target.value })} placeholder="Masukkan alamat dalam Indonesia" className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={3} />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div>
          <h3 className="font-semibold mb-4">{t({ en: 'Copyright', id: 'Hak Cipta' })}</h3>
          <div>
            <Label htmlFor="copyright-year">{t({ en: 'Copyright Year', id: 'Tahun Hak Cipta' })}</Label>
            <Input id="copyright-year" value={data.copyrightYear} onChange={(e) => setData({ ...data, copyrightYear: e.target.value })} placeholder={new Date().getFullYear().toString()} className="mt-1" />
          </div>
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
