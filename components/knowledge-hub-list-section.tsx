'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { ReportCard, type ReportData } from '@/components/report-card'
import { DownloadReportModal, type DownloadFormData } from '@/components/download-report-modal'

export function KnowledgeHubListSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [reports, setReports] = useState<ReportData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [activeReport, setActiveReport] = useState<ReportData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [apiTags, setApiTags] = useState<{ nameEn: string; nameId: string }[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { language } = useLanguage()

  const fetchReports = async (page: number, tag = '') => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ published: 'true', page: page.toString(), limit: '9' })
      if (tag) params.set('tag', tag)
      const response = await fetch(`/api/cms/reports?${params}`)
      if (response.ok) {
        const data = await response.json()
        setReports(data.data || [])
        setCurrentPage(data.pagination?.page || 1)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchApiTags = async () => {
    try {
      const response = await fetch('/api/cms/reports/tags?active=true')
      if (response.ok) {
        const data = await response.json()
        setApiTags(data.tags || [])
      }
    } catch {
      // silently fail
    }
  }

  useEffect(() => { fetchReports(1) }, [])
  useEffect(() => { fetchApiTags() }, [])

  const animClass = useCallback(() => {
    if (isFadingOut) return 'animate-fade-out-down'
    if (isVisible) return 'animate-fade-in-up'
    return 'opacity-0 translate-y-[100px]'
  }, [isVisible, isFadingOut])

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      scrollDirectionRef.current = currentY > lastScrollYRef.current ? 'down' : 'up'
      lastScrollYRef.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current)
          setIsFadingOut(false)
          setIsVisible(true)
        } else {
          if (scrollDirectionRef.current === 'up') {
            setIsFadingOut(true)
            setIsVisible(false)
            fadeOutTimeoutRef.current = setTimeout(() => setIsFadingOut(false), 1200)
          } else {
            setIsVisible(false)
            setIsFadingOut(false)
          }
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current)
    }
  }, [isLoading, reports])

  const allTags = [
    ...apiTags,
    ...Array.from(new Set(reports.flatMap((r) => r.tags || [])))
      .filter((nameEn) => !apiTags.some((t) => t.nameEn === nameEn))
      .map((nameEn) => ({ nameEn, nameId: nameEn })),
  ]

  const handleDownloadClick = (report: ReportData) => {
    setActiveReport(report)
    setIsModalOpen(true)
  }

  const handleDownloadSubmit = async (userData: DownloadFormData) => {
    if (!activeReport) return
    setIsDownloading(true)
    try {
      const response = await fetch('/api/cms/report-downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          reportId: activeReport._id,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.pdfFile) {
          const link = document.createElement('a')
          link.href = data.pdfFile
          link.download = `${activeReport.titleEn || 'report'}.pdf`
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden bg-background border-b border-border"
    >
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10] dark:opacity-[0.2]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 right-1/4 w-72 h-72 rounded-full bg-primary/6 dark:bg-primary/12 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-accent/5 dark:bg-accent/8 blur-[90px]" />

      {/* Top / bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {!isLoading && allTags.length > 0 && (
          <div className={`mb-8 flex flex-wrap items-center gap-2 ${animClass()}`}>
            <button
              onClick={() => { setSelectedTag(''); fetchReports(1, '') }}
              className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest
                border transition-all duration-200 overflow-hidden
                ${selectedTag === ''
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(58,111,247,0.2)]'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                }`}
            >
              {selectedTag === '' && (
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent" />
              )}
              <span className={`w-1 h-1 rounded-full ${selectedTag === '' ? 'bg-primary animate-pulse' : 'bg-muted-foreground/40'}`} />
              {language === 'en' ? 'All' : 'Semua'}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag.nameEn}
                onClick={() => {
                  const next = tag.nameEn === selectedTag ? '' : tag.nameEn
                  setSelectedTag(next)
                  fetchReports(1, next)
                }}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest
                  border transition-all duration-200 overflow-hidden
                  ${selectedTag === tag.nameEn
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(58,111,247,0.2)]'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                  }`}
              >
                {selectedTag === tag.nameEn && (
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent" />
                )}
                <span className={`w-1 h-1 rounded-full ${selectedTag === tag.nameEn ? 'bg-primary animate-pulse' : 'bg-muted-foreground/40'}`} />
                {language === 'en' ? tag.nameEn : tag.nameId}
              </button>
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card animate-pulse">
                <div className="h-50 bg-muted rounded-t-xl" style={{ height: '200px' }} />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-9 bg-muted rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className={`text-center py-16 text-muted-foreground ${animClass()}`}>
            {language === 'en' ? 'No reports found.' : 'Tidak ada laporan ditemukan.'}
          </div>
        ) : (
          <>
            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, index) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  index={index}
                  animClass={animClass()}
                  onDownload={handleDownloadClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`mt-12 flex items-center justify-center gap-4 ${animClass()}`}>
                <button
                  onClick={() => fetchReports(currentPage - 1, selectedTag)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                    border border-border text-foreground
                    hover:border-primary/40 hover:text-primary hover:bg-primary/5
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {language === 'en' ? 'Previous' : 'Sebelumnya'}
                </button>

                <span className="text-xs font-mono text-muted-foreground px-3 py-1.5 rounded-md border border-border bg-card">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => fetchReports(currentPage + 1, selectedTag)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                    border border-border text-foreground
                    hover:border-primary/40 hover:text-primary hover:bg-primary/5
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200"
                >
                  {language === 'en' ? 'Next' : 'Selanjutnya'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Download modal */}
      {activeReport && (
        <DownloadReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDownload={handleDownloadSubmit}
          reportTitle={language === 'en' ? activeReport.titleEn : activeReport.titleId}
          isDownloading={isDownloading}
        />
      )}
    </section>
  )
}
