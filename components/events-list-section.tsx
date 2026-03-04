'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { EventCard, type EventData } from '@/components/event-card'
import { ImagePreviewModal } from '@/components/image-preview-modal'

const defaultEvents: EventData[] = [
  {
    _id: '1',
    titleEn: 'National Cybersecurity Summit 2026',
    titleId: 'Summit Keamanan Siber Nasional 2026',
    categoryEn: 'Conference',
    categoryId: 'Konferensi',
    image: '/placeholder.svg',
    registerLink: 'https://adigsi.id/agenda',
    published: true,
    date: '15 Mar 2026',
    time: '08:00 – 17:00 WIB',
    location: 'Jakarta Convention Center',
  },
  {
    _id: '2',
    titleEn: 'Digital Forensics Workshop',
    titleId: 'Workshop Forensik Digital',
    categoryEn: 'Workshop',
    categoryId: 'Workshop',
    image: '/placeholder.svg',
    registerLink: 'https://adigsi.id/agenda',
    published: true,
    date: '22 Mar 2026',
    time: '09:00 – 15:00 WIB',
    location: 'Gedung BSSN, Depok',
  },
  {
    _id: '3',
    titleEn: 'Cyber Threat Intelligence Webinar',
    titleId: 'Webinar Intelijen Ancaman Siber',
    categoryEn: 'Webinar',
    categoryId: 'Webinar',
    image: '/placeholder.svg',
    registerLink: 'https://adigsi.id/agenda',
    published: true,
    date: '28 Mar 2026',
    time: '10:00 – 12:00 WIB',
    location: 'Online (Zoom)',
  },
  {
    _id: '4',
    titleEn: 'Penetration Testing Masterclass',
    titleId: 'Masterclass Penetration Testing',
    categoryEn: 'Workshop',
    categoryId: 'Workshop',
    image: '/placeholder.svg',
    registerLink: 'https://adigsi.id/agenda',
    published: true,
    date: '05 Apr 2026',
    time: '09:00 – 16:00 WIB',
    location: 'Universitas Indonesia, Depok',
  },
  {
    _id: '5',
    titleEn: 'ADIGSI Annual Member Meeting',
    titleId: 'Rapat Anggota Tahunan ADIGSI',
    categoryEn: 'Conference',
    categoryId: 'Konferensi',
    image: '/placeholder.svg',
    registerLink: 'https://adigsi.id/agenda',
    published: true,
    date: '12 Apr 2026',
    time: '13:00 – 17:00 WIB',
    location: 'Hotel Mulia, Jakarta',
  },
  {
    _id: '6',
    titleEn: 'Zero-Trust Architecture Seminar',
    titleId: 'Seminar Arsitektur Zero-Trust',
    categoryEn: 'Seminar',
    categoryId: 'Seminar',
    image: '/placeholder.svg',
    registerLink: 'https://adigsi.id/agenda',
    published: true,
    date: '19 Apr 2026',
    time: '09:00 – 13:00 WIB',
    location: 'Online (Google Meet)',
  },
]

export function EventsListSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [events, setEvents] = useState<EventData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { t, language } = useLanguage()

  const fetchEvents = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/cms/events/events?page=${page}`)
      if (response.ok) {
        const data = await response.json()
        const publishedEvents = data.data.filter((e: EventData) => e.published)
        setEvents(publishedEvents)
        setCurrentPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
      } else {
        setEvents(defaultEvents)
      }
    } catch {
      setEvents(defaultEvents)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchEvents(1) }, [])

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
  }, [isLoading, events])

  const rawEvents = events.length > 0 ? events : defaultEvents

  // Derive unique categories from current data
  const categories = Array.from(
    new Set(rawEvents.map((e) => language === 'en' ? e.categoryEn : e.categoryId))
  )

  // Apply category filter
  const displayEvents = selectedCategory
    ? rawEvents.filter((e) =>
        (language === 'en' ? e.categoryEn : e.categoryId) === selectedCategory
      )
    : rawEvents

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full py-20 overflow-hidden bg-secondary/40 dark:bg-secondary/20 border-b border-border"
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
        <div className="pointer-events-none absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-primary/8 dark:bg-primary/14 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-accent/6 dark:bg-accent/10 blur-[90px]" />

        {/* Top / bottom accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

          {/* Category filter bar */}
          {!isLoading && (
            <div className={`mb-8 flex flex-wrap items-center gap-2 ${animClass()}`}>
              <button
                onClick={() => setSelectedCategory('')}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest
                  border transition-all duration-200 overflow-hidden
                  ${
                    selectedCategory === ''
                      ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(58,111,247,0.2)]'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                  }`}
              >
                {selectedCategory === '' && (
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent animate-[shimmer_2s_infinite]" />
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
                    ${
                      selectedCategory === cat
                        ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(58,111,247,0.2)]'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                    }`}
                >
                  {selectedCategory === cat && (
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent animate-[shimmer_2s_infinite]" />
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
                {displayEvents.map((event, index) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    index={index}
                    animClass={animClass()}
                    onPreviewClick={setPreviewImage}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={`mt-12 flex items-center justify-center gap-4 ${animClass()}`}>
                  <button
                    onClick={() => fetchEvents(currentPage - 1)}
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
                    onClick={() => fetchEvents(currentPage + 1)}
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

      <ImagePreviewModal previewImage={previewImage} onClose={() => setPreviewImage(null)} />
    </>
  )
}
