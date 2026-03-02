'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon } from '@/components/icons/arrow-right'
import { useLanguage } from '@/contexts/language-context'

interface EventData {
  _id: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  image: string
  registerLink: string
  published: boolean
}

export function AgendaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [events, setEvents] = useState<EventData[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
                <div
                  key={event._id}
                  className={`group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${animClass()}`}
                  style={animStyle(`${250 + (index + 1) * 150}ms`)}
                >
                  {/* Top accent bar — always visible, primary color (unlike news left-border on hover) */}
                  <div className="h-1 w-full bg-linear-to-r from-primary via-primary/70 to-accent group-hover:from-accent group-hover:to-primary transition-all duration-500" />

                  {/* Image with gradient overlay */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.image}
                      alt={language === 'en' ? event.titleEn : event.titleId}
                      width={350}
                      height={200}
                      className="object-cover w-full transition-transform duration-500 group-hover:scale-105"
                      style={{ height: '200px' }}
                    />

                    {/* Bottom gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category badge — top-right (contrast with news which is bottom-left) */}
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-2.5 py-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground leading-none">
                        {language === 'en' ? event.categoryEn : event.categoryId}
                      </span>
                    </div>

                    {/* Event label bottom-left on image */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
                        {t({ en: 'Upcoming Event', id: 'Event Mendatang' })}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-base font-bold text-foreground line-clamp-3 group-hover:text-primary transition-colors duration-200 mb-4">
                      {language === 'en' ? event.titleEn : event.titleId}
                    </h3>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Divider */}
                    <div className="h-px bg-border mb-4 group-hover:bg-primary/30 transition-colors duration-300" />

                    {/* Register CTA */}
                    <Link
                      href={event.registerLink}
                      target={event.registerLink.startsWith('http') ? '_blank' : undefined}
                      rel={event.registerLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group/btn relative inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300
                        border border-primary text-primary
                        hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_16px_rgba(58,111,247,0.3)]"
                    >
                      {/* Shimmer */}
                      <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="relative">{t({ en: 'Register Now', id: 'Daftar Sekarang' })}</span>
                    </Link>
                  </div>
                </div>
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
    </section>
  )
}
