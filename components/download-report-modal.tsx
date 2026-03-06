'use client'

import { useState } from 'react'
import { X, Download, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface DownloadReportModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: (userData: DownloadFormData) => void
  reportTitle: string
  isDownloading?: boolean
}

export interface DownloadFormData {
  fullname: string
  company: string
  position: string
  email: string
  member: string
}

const inputClass =
  'w-full text-sm bg-background border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200'

const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'

export function DownloadReportModal({
  isOpen,
  onClose,
  onDownload,
  reportTitle,
  isDownloading = false,
}: DownloadReportModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<DownloadFormData>({
    fullname: '',
    company: '',
    position: '',
    email: '',
    member: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onDownload(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />

        {/* Corner accents */}
        <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-accent/60 rounded-tl-2xl" />
        <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-accent/60 rounded-tr-2xl" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Icon badge */}
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
              <Download className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  {t({ en: 'Industry Report', id: 'Laporan Industri' })}
                </span>
              </div>
              <h2 className="text-base font-bold text-foreground leading-tight line-clamp-1">
                {t({ en: `Download ${reportTitle}`, id: `Unduh ${reportTitle}` })}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="shrink-0 ml-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report thumbnail + info strip */}
        <div className="flex items-center gap-4 px-6 py-4 bg-muted/30 border-b border-border">
          <img
            src="/images/design-mode/report.png"
            alt="Report"
            className="w-12 h-16 object-cover rounded-md border border-border shadow-sm"
          />
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t({ en: 'Fill in the form below to access the full report.', id: 'Isi formulir berikut untuk mengakses laporan lengkap.' })}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                t({ en: 'Industry Analysis', id: 'Analisis Industri' }),
                t({ en: 'Cybersecurity Trends', id: 'Tren Keamanan Siber' }),
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full border border-border text-[10px] font-medium text-muted-foreground bg-background"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Two-column: fullname + email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullname" className={labelClass}>
                {t({ en: 'Full Name', id: 'Nama Lengkap' })} <span className="text-destructive">*</span>
              </label>
              <input
                id="fullname"
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder={t({ en: 'Your full name', id: 'Nama lengkap Anda' })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                {t({ en: 'Email', id: 'Email' })} <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t({ en: 'your@email.com', id: 'email@anda.com' })}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Two-column: company + position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className={labelClass}>
                {t({ en: 'Company / Institution', id: 'Perusahaan / Institusi' })} <span className="text-destructive">*</span>
              </label>
              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder={t({ en: 'Company name', id: 'Nama perusahaan' })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="position" className={labelClass}>
                {t({ en: 'Position', id: 'Posisi' })} <span className="text-destructive">*</span>
              </label>
              <input
                id="position"
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder={t({ en: 'Your position', id: 'Posisi Anda' })}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* ADIGSI membership */}
          <div>
            <label htmlFor="member" className={labelClass}>
              {t({ en: 'ADIGSI Membership', id: 'Keanggotaan ADIGSI' })} <span className="text-destructive">*</span>
            </label>
            <select
              id="member"
              name="member"
              value={formData.member}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">
                {t({ en: 'Are you an ADIGSI member?', id: 'Apakah Anda anggota ADIGSI?' })}
              </option>
              <option value="Yes">{t({ en: 'Yes, I am a member', id: 'Ya, saya adalah anggota' })}</option>
              <option value="No">{t({ en: 'No, I am not a member', id: 'Tidak, saya bukan anggota' })}</option>
            </select>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Submit */}
          <button
            type="submit"
            disabled={isDownloading}
            className="group relative w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
              bg-primary text-primary-foreground border border-primary overflow-hidden
              hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(58,111,247,0.3)]
              disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
          >
            {/* Shimmer */}
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t({ en: 'Downloading...', id: 'Mengunduh...' })}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                <span className="relative">{t({ en: 'Download Report', id: 'Unduh Laporan' })}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
