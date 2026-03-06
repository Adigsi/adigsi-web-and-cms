'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon } from '@/components/icons/arrow-right'
import { useLanguage } from '@/contexts/language-context'
import { EventCard, type EventData } from '@/components/event-card'
import { ImagePreviewModal } from '@/components/image-preview-modal'

export function AgendaSection() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [events, setEvents] = useState<EventData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    const fetchLatestEvents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/cms/events/events?page=1')
        if (response.ok) {
          const data = await response.json()
          const publishedEvents = data.data.filter((event: EventData) => event.published).slice(0, 3)
          setEvents(publishedEvents)
        }
      } catch (error) {
        console.error('Error fetching latest events:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLatestEvents()
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

  // Observer — re-attach after data loads
  useEffect(() => {
    if (isLoading || !sectionRef.current) return

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
  }, [isLoading])

  const animClass = (delay?: string) =>
    isFadingOut
      ? 'animate-fade-out-down'
      : isVisible && !isLoading
      ? 'animate-fade-in-up'
      : 'opacity-0 translate-y-[120px]'

  const animStyle = (delay: string) => ({
    animationDelay: isFadingOut ? '0ms' : isVisible && !isLoading ? delay : '0ms',
    animationDuration: isFadingOut || (isVisible && !isLoading) ? '1.2s' : '0s',
  })

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden bg-background border-b border-border"
    >
      {/* Cybersecurity dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Section header */}
        <div
          className={`flex flex-col items-center text-center mb-12 ${animClass()}`}
          style={animStyle('0ms')}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {t({ en: 'Agenda', id: 'Agenda' })}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t({ en: 'ADIGSI', id: 'Agenda' })}{' '}
            <span className="text-primary">{t({ en: 'Activity Agenda', id: 'Kegiatan ADIGSI' })}</span>
          </h2>
          <div className="mt-3 h-px w-16 bg-linear-to-r from-primary to-accent" />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            {t({ en: 'Loading...', id: 'Memuat...' })}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <EventCard
                  key={event._id}
                  event={event}
                  index={index}
                  animClass={animClass()}
                  onPreviewClick={setPreviewImage}
                />
              ))}
            </div>

            {/* See all link */}
            <Link
              href="/events"
              className={`flex justify-center mt-12 ${animClass()}`}
              style={animStyle(`${250 + 4 * 150}ms`)}
            >
              <div className="flex gap-3 items-center justify-center text-primary font-semibold border-b-2 border-primary pb-2 hover:gap-4 transition-all duration-200">
                <span className="text-sm">
                  {t({ en: 'See All Events', id: 'Lihat Semua Event' })}
                </span>
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            </Link>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t({ en: 'No events available', id: 'Tidak ada event' })}
          </div>
        )}
      </div>

      <ImagePreviewModal previewImage={previewImage} onClose={() => setPreviewImage(null)} />
    </section>
  )
}
