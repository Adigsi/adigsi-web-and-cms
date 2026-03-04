'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { EventCard, type EventData } from '@/components/event-card'
import { ImagePreviewModal } from '@/components/image-preview-modal'

const defaultEvents: EventData[] = [
  {
    _id: '0',
    titleEn: 'No Event Available',
    titleId: 'Tidak Ada Event',
    categoryEn: 'No Category',
    categoryId: 'Tanpa Kategori',
    image: '/placeholder.svg',
    registerLink: 'https://adigsi.id/agenda',
    published: false,
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

  const displayEvents = events.length > 0 ? events : defaultEvents

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
