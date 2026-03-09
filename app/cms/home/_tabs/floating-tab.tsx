'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ChevronDown, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CyberIcon } from '@/components/ui/cyber-icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const ICON_OPTIONS = [
  'join',
  'network', 'web', 'endpoint', 'app', 'mssp', 'data', 'mobile', 'risk', 'secops', 'threat',
  'identity', 'digitalrisk', 'blockchain', 'iot', 'messaging', 'consulting', 'fraud', 'cloud',
  'server', 'database', 'firewall', 'vpn', 'encryption', 'malware', 'virus', 'monitoring', 'audit',
  'compliance', 'ecommerce', 'logistic', 'financial', 'edutech', 'telecom', 'media', 'healthcare',
  'venture', 'consultant', 'university', 'bumn', 'retail', 'shopping', 'cart', 'manufacturing',
  'agriculture', 'energy', 'construction',
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
            <button
              key={iconType}
              onClick={() => { onChange(iconType); setOpen(false) }}
              className={`p-2 rounded border transition-all flex flex-col items-center justify-center gap-1 text-xs capitalize hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 ${
                value === iconType ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-muted hover:border-gray-400'
              }`}
              title={iconType}
            >
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

const DEFAULT: FloatingButtonsData = {
  joinButton: { textEn: 'Join Now', textId: 'Daftar', link: '/register', icon: 'network' },
  contactButton: { email: 'info@adigsi.id', whatsapp: 'https://wa.me/62' },
}

export function FloatingTab() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<FloatingButtonsData>(DEFAULT)

  useEffect(() => {
    fetch('/api/cms/home/floating-buttons')
      .then((res) => res.ok ? res.json() : null)
      .then((json) => { if (json) setData(json) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/cms/home/floating-buttons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      toast({ title: t({ en: 'Success', id: 'Sukses' }), description: t({ en: 'Floating buttons saved successfully', id: 'Floating button berhasil disimpan' }) })
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
              <Input value={data.joinButton.textEn} onChange={(e) => setData((prev) => ({ ...prev, joinButton: { ...prev.joinButton, textEn: e.target.value } }))} placeholder="Join Now" className="mt-1" />
            </div>
            <div>
              <Label>{t({ en: 'Text (ID)', id: 'Teks (ID)' })}</Label>
              <Input value={data.joinButton.textId} onChange={(e) => setData((prev) => ({ ...prev, joinButton: { ...prev.joinButton, textId: e.target.value } }))} placeholder="Daftar" className="mt-1" />
            </div>
          </div>
          <div>
            <Label>{t({ en: 'Link / URL', id: 'Tautan / URL' })}</Label>
            <Input value={data.joinButton.link} onChange={(e) => setData((prev) => ({ ...prev, joinButton: { ...prev.joinButton, link: e.target.value } }))} placeholder="https://... or /register" className="mt-1" />
          </div>
          <div>
            <Label className="mb-1 block">{t({ en: 'Icon', id: 'Ikon' })}</Label>
            <IconPicker value={data.joinButton.icon} onChange={(icon) => setData((prev) => ({ ...prev, joinButton: { ...prev.joinButton, icon } }))} />
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Contact Button */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">{t({ en: 'Contact Button (bottom right)', id: 'Tombol Kontak (kanan bawah)' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t({ en: 'Email Address', id: 'Alamat Email' })}</Label>
              <Input type="email" value={data.contactButton.email} onChange={(e) => setData((prev) => ({ ...prev, contactButton: { ...prev.contactButton, email: e.target.value } }))} placeholder="info@adigsi.id" className="mt-1" />
            </div>
            <div>
              <Label>{t({ en: 'WhatsApp URL', id: 'URL WhatsApp' })}</Label>
              <Input value={data.contactButton.whatsapp} onChange={(e) => setData((prev) => ({ ...prev, contactButton: { ...prev.contactButton, whatsapp: e.target.value } }))} placeholder="https://wa.me/628..." className="mt-1" />
            </div>
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
