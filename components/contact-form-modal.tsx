'use client'

import { useState } from 'react'
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ContactFormData {
  fullname: string
  email: string
  company: string
  position: string
  message: string
}

const inputClass =
  'w-full text-sm bg-background border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200'

const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<ContactFormData>({
    fullname: '',
    email: '',
    company: '',
    position: '',
    message: '',
  })
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setError(null)

    try {
      const res = await fetch('/api/cms/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setFormData({ fullname: '', email: '', company: '', position: '', message: '' })
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    if (isSending) return
    onClose()
    setIsSuccess(false)
    setError(null)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
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
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
              <Send className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  {t({ en: 'Contact Us', id: 'Hubungi Kami' })}
                </span>
              </div>
              <h2 className="text-base font-bold text-foreground leading-tight">
                {t({ en: 'Send a Message', id: 'Kirim Pesan' })}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            type="button"
            disabled={isSending}
            className="shrink-0 ml-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success state */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {t({ en: 'Message Sent!', id: 'Pesan Terkirim!' })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t({ en: "We'll get back to you as soon as possible.", id: 'Kami akan segera menghubungi Anda.' })}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Two-column: fullname + email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cf-fullname" className={labelClass}>
                  {t({ en: 'Full Name', id: 'Nama Lengkap' })} <span className="text-destructive">*</span>
                </label>
                <input
                  id="cf-fullname"
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
                <label htmlFor="cf-email" className={labelClass}>
                  {t({ en: 'Email', id: 'Email' })} <span className="text-destructive">*</span>
                </label>
                <input
                  id="cf-email"
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
                <label htmlFor="cf-company" className={labelClass}>
                  {t({ en: 'Company / Institution', id: 'Perusahaan / Institusi' })} <span className="text-destructive">*</span>
                </label>
                <input
                  id="cf-company"
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
                <label htmlFor="cf-position" className={labelClass}>
                  {t({ en: 'Position', id: 'Posisi' })} <span className="text-destructive">*</span>
                </label>
                <input
                  id="cf-position"
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

            {/* Message */}
            <div>
              <label htmlFor="cf-message" className={labelClass}>
                {t({ en: 'Message', id: 'Pesan' })} <span className="text-destructive">*</span>
              </label>
              <textarea
                id="cf-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t({ en: 'Write your message here...', id: 'Tulis pesan Anda di sini...' })}
                required
                rows={4}
                className={inputClass + ' resize-none'}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSending}
              className="group relative w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                bg-primary text-primary-foreground border border-primary overflow-hidden
                hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(58,111,247,0.3)]
                disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t({ en: 'Sending...', id: 'Mengirim...' })}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="relative">{t({ en: 'Send Message', id: 'Kirim Pesan' })}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
