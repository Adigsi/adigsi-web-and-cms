'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { Card } from '@/components/ui/card'
import { Pin, ExternalLink } from 'lucide-react'

interface PinnedReport {
  pinned: boolean
  _id?: string
  titleEn?: string
  titleId?: string
  cover?: string
  tags?: string[]
  hasPdf?: boolean
}

export function ReportTab() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [pinnedReport, setPinnedReport] = useState<PinnedReport | null>(null)

  useEffect(() => {
    fetch('/api/cms/reports/pinned')
      .then((res) => res.ok ? res.json() : null)
      .then((json) => { if (json) setPinnedReport(json) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

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
  )
}
