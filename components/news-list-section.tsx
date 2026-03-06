'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { NewsCard, type NewsData } from '@/components/news-card'

const defaultNews: NewsData[] = [
  {
    _id: '1',
    slug: 'adigsi-cyber-resilience-2026',
    titleEn: 'ADIGSI Strengthens National Cyber Resilience Framework',
    titleId: 'ADIGSI Perkuat Kerangka Ketahanan Siber Nasional',
    categoryEn: 'Policy',
    categoryId: 'Kebijakan',
    contentEn: '',
    contentId: '',
    image: '/placeholder.svg',
    published: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    slug: 'digital-ecosystem-initiative',
    titleEn: 'New Digital Ecosystem Initiative Launched by ADIGSI Members',
    titleId: 'Anggota ADIGSI Luncurkan Inisiatif Ekosistem Digital Baru',
    categoryEn: 'Industry',
    categoryId: 'Industri',
    contentEn: '',
    contentId: '',
    image: '/placeholder.svg',
    published: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    slug: 'zero-trust-adoption',
    titleEn: 'Zero-Trust Architecture Adoption Grows Among Government Agencies',
    titleId: 'Adopsi Arsitektur Zero-Trust Meningkat di Instansi Pemerintah',
    categoryEn: 'Technology',
    categoryId: 'Teknologi',
    contentEn: '',
    contentId: '',
    image: '/placeholder.svg',
    published: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    slug: 'threat-intel-collaboration',
    titleEn: 'ADIGSI and BSSN Sign Threat Intelligence Collaboration MoU',
    titleId: 'ADIGSI dan BSSN Tandatangani MOU Kolaborasi Intelijen Ancaman',
    categoryEn: 'Policy',
    categoryId: 'Kebijakan',
    contentEn: '',
    contentId: '',
    image: '/placeholder.svg',
    published: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    slug: 'ai-security-report-2026',
    titleEn: 'AI Security Report 2026: Key Findings for Indonesian Enterprises',
    titleId: 'Laporan Keamanan AI 2026: Temuan Utama untuk Perusahaan Indonesia',
    categoryEn: 'Research',
    categoryId: 'Riset',
    contentEn: '',
    contentId: '',
    image: '/placeholder.svg',
    published: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '6',
    slug: 'iot-security-standards',
    titleEn: 'New IoT Security Standards Released for Critical Infrastructure',
    titleId: 'Standar Keamanan IoT Baru Diterbitkan untuk Infrastruktur Kritis',
    categoryEn: 'Technology',
    categoryId: 'Teknologi',
    contentEn: '',
    contentId: '',
    image: '/placeholder.svg',
    published: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function NewsListSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [news, setNews] = useState<NewsData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { language } = useLanguage()

  const fetchNews = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/cms/news/news?page=${page}`)
      const data = await response.json()
      if (data.success) {
        const publishedNews = data.data.filter((item: NewsData) => item.published)
        setNews(publishedNews)
        setCurrentPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
      } else {
        setNews(defaultNews)
      }
    } catch {
      setNews(defaultNews)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchNews(1) }, [])

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
  }, [isLoading, news])

  const rawNews = news.length > 0 ? news : defaultNews

  const categories = Array.from(
    new Set(rawNews.map((n) => language === 'en' ? n.categoryEn : n.categoryId))
  )

  const displayNews = selectedCategory
    ? rawNews.filter((n) => (language === 'en' ? n.categoryEn : n.categoryId) === selectedCategory)
    : rawNews

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

        {/* Category filter bar */}
        {!isLoading && (
          <div className={`mb-8 flex flex-wrap items-center gap-2 ${animClass()}`}>
            <button
              onClick={() => setSelectedCategory('')}
              className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest
                border transition-all duration-200 overflow-hidden
                ${selectedCategory === ''
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(58,111,247,0.2)]'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                }`}
            >
              {selectedCategory === '' && (
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent" />
              )}
              <span className={`w-1 h-1 rounded-full ${selectedCategory === '' ? 'bg-primary animate-pulse' : 'bg-muted-foreground/40'}`} />
              {language === 'en' ? 'All' : 'Semua'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest
                  border transition-all duration-200 overflow-hidden
                  ${selectedCategory === cat
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(58,111,247,0.2)]'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                  }`}
              >
                {selectedCategory === cat && (
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent" />
                )}
                <span className={`w-1 h-1 rounded-full ${selectedCategory === cat ? 'bg-primary animate-pulse' : 'bg-muted-foreground/40'}`} />
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card animate-pulse">
                <div className="h-50 bg-muted rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-9 bg-muted rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayNews.map((article, index) => (
                <NewsCard
                  key={article._id}
                  article={article}
                  index={index}
                  animClass={animClass()}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`mt-12 flex items-center justify-center gap-4 ${animClass()}`}>
                <button
                  onClick={() => fetchNews(currentPage - 1)}
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
                  onClick={() => fetchNews(currentPage + 1)}
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
    </section>
  )
}

