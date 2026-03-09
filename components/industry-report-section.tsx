'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { DownloadReportModal, DownloadFormData } from './download-report-modal'

interface ReportData {
  _id: string
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  hasPdf: boolean
  cover: string
  tags: string[]
  pinned: boolean
}

export function IndustryReportSection() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/cms/reports/pinned')
        if (response.ok) {
          const data = await response.json()
          if (data.pinned) {
            setReportData(data)
          } else {
            setReportData(null)
          }
        }
      } catch (error) {
        console.error('Error fetching report data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReportData()
  }, [])

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      scrollDirectionRef.current = window.scrollY > lastScrollYRef.current ? 'down' : 'up'
      lastScrollYRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Observer — re-attach after data loads (avoids null ref during loading state)
  useEffect(() => {
    if (isLoading || !reportData || !sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && scrollDirectionRef.current === 'down') {
          if (fadeOutTimeoutRef.current) {
            clearTimeout(fadeOutTimeoutRef.current)
            fadeOutTimeoutRef.current = null
          }
          setIsVisible(true)
          setIsFadingOut(false)
        } else if (!entry.isIntersecting && scrollDirectionRef.current === 'up') {
          setIsFadingOut(true)
          if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current)
          fadeOutTimeoutRef.current = setTimeout(() => {
            setIsVisible(false)
            setIsFadingOut(false)
            fadeOutTimeoutRef.current = null
          }, 1200)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current)
    }
  }, [isLoading, reportData])

  const handleDownloadPdf = async (userData: DownloadFormData) => {
    setIsDownloading(true)
    try {
      const response = await fetch('/api/cms/report-downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          reportId: reportData?._id,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.pdfFile) {
          const link = document.createElement('a')
          link.href = data.pdfFile
          link.download = 'report.pdf'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setIsModalOpen(false)
        }
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const animClass = (delay: string) => {
    const base = isFadingOut
      ? 'animate-fade-out-down'
      : isVisible && !isLoading
      ? 'animate-fade-in-up'
      : 'opacity-0 translate-y-[120px]'
    return base
  }

  const animStyle = (delay: string) => ({
    animationDelay: isFadingOut ? '0ms' : isVisible && !isLoading ? delay : '0ms',
    animationDuration: isFadingOut || (isVisible && !isLoading) ? '1.2s' : '0s',
  })

  if (isLoading) {
    return (
      <section className="w-full py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center py-8 text-muted-foreground">
            {t({ en: 'Loading...', id: 'Memuat...' })}
          </div>
        </div>
      </section>
    )
  }

  if (!reportData) return null

  const title = language === 'en' ? reportData.titleEn : reportData.titleId
  const description = language === 'en' ? reportData.descriptionEn : reportData.descriptionId

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden bg-secondary/40 dark:bg-secondary/20 border-y border-border"
    >
      {/* Subtle cybersecurity grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Section header */}
        <div
          className={`flex flex-col items-center text-center mb-12 ${animClass('0ms')}`}
          style={animStyle('0ms')}
        >
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-accent/30 bg-accent/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
              {t({ en: 'Industry Report', id: 'Laporan Industri' })}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t({ en: 'Our Latest', id: 'Publikasi' })}{' '}
            <span className="text-primary">{t({ en: 'Publication', id: 'Terbaru Kami' })}</span>
          </h2>
          <div className="mt-3 h-px w-16 bg-linear-to-r from-primary to-accent" />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Image column */}
          <div
            className={`relative flex justify-center ${animClass('250ms')}`}
            style={animStyle('250ms')}
          >
            {/* Decorative glow behind image */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/20 to-accent/10 blur-3xl scale-90 -z-10" />

            {/* Image frame */}
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl group">
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/70 rounded-tl-lg z-10" />
              <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/70 rounded-tr-lg z-10" />
              <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/70 rounded-bl-lg z-10" />
              <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/70 rounded-br-lg z-10" />

              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              <Image
                src={reportData.cover}
                alt={title}
                width={522}
                height={600}
                className="max-w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Floating year badge */}
            {/* <div className="absolute -bottom-4 -right-4 lg:bottom-4 lg:right-4 bg-card border border-border rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t({ en: 'Published', id: 'Diterbitkan' })}
                </div>
                <div className="text-sm font-bold text-foreground">{new Date().getFullYear()}</div>
              </div>
            </div> */}
          </div>

          {/* Content column */}
          <div
            className={`flex flex-col ${animClass('450ms')}`}
            style={animStyle('450ms')}
          >
            {/* Left accent bar */}
            <div className="flex items-start gap-4 mb-6">
              <div className="mt-1 shrink-0 w-1 h-10 rounded-full bg-linear-to-b from-primary to-accent" />
              <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
                {title}
              </h3>
            </div>

            {/* Divider */}
            <div className="h-px bg-border mb-6" />

            {/* Description */}
            <div className="space-y-4 mb-8">
              {description
                .split('\n')
                .filter((p) => p.trim())
                .map((para, i) => (
                  <p key={i} className="text-muted-foreground text-base leading-relaxed">
                    {para}
                  </p>
                ))}
            </div>

            {/* Feature pills — from report tags */}
            {reportData.tags && reportData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {reportData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full border border-border text-xs font-medium text-muted-foreground bg-muted/50 hover:border-accent/50 hover:text-accent transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              {reportData.hasPdf && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative inline-flex items-center gap-3 w-fit px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden
                    bg-primary text-primary-foreground border border-primary
                    hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(58,111,247,0.35)]"
                >
                  {/* Button shimmer */}
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  {/* Download icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="relative">{t({ en: 'Download Report', id: 'Unduh Laporan' })}</span>
                </button>
              )}
              <Link
                href="/knowledge-hub"
                className="group relative inline-flex items-center gap-3 w-fit px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden
                  bg-transparent text-foreground border border-border
                  hover:border-primary/60 hover:text-primary hover:bg-primary/5"
              >
                <span className="relative">{t({ en: 'Other Reports', id: 'Laporan Lainnya' })}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DownloadReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownloadPdf}
        reportTitle={title}
        isDownloading={isDownloading}
      />
    </section>
  )
}
