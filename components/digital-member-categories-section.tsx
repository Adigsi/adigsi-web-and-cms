'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { CyberIcon } from '@/components/ui/cyber-icon'

interface DigitalCategory {
  nameEn: string
  nameId: string
  count: number
  icon: string
}

interface HeadingData {
  subtitleEn: string
  subtitleId: string
  titleEn: string
  titleId: string
}

export function DigitalMemberCategoriesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [categories, setCategories] = useState<DigitalCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [heading, setHeading] = useState<HeadingData>({
    subtitleEn: 'DIGITAL ECOSYSTEM',
    subtitleId: 'EKOSISTEM DIGITAL',
    titleEn: 'ADIGSI Digital Members',
    titleId: 'Anggota Digital ADIGSI',
  })
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    fetch('/api/cms/members/digital-categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || [])
        if (data.heading) {
          setHeading({
            subtitleEn: data.heading.subtitleEn || 'DIGITAL ECOSYSTEM',
            subtitleId: data.heading.subtitleId || 'EKOSISTEM DIGITAL',
            titleEn: data.heading.titleEn || 'ADIGSI Digital Members',
            titleId: data.heading.titleId || 'Anggota Digital ADIGSI',
          })
        }
      })
      .catch((error) => {
        console.error('Error fetching digital categories:', error)
      })
      .finally(() => setIsLoading(false))
  }, [])

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
  }, [isLoading, categories])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden bg-secondary/40 dark:bg-secondary/20 border-b border-border"
    >
      {/* Line-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-20 right-1/4 w-80 h-80 rounded-full bg-accent/10 dark:bg-accent/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-primary/8 dark:bg-primary/12 blur-[100px]" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Header */}
        <div
          className={`flex flex-col items-center text-center mb-14 transition-all duration-700 ${animClass()}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {language === 'en' ? heading.subtitleEn : heading.subtitleId}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">
            {language === 'en' ? heading.titleEn : heading.titleId}
          </h2>

          {/* Gradient underline — reversed direction for visual variety */}
          <div className="h-px w-16 rounded-full bg-linear-to-r from-accent to-primary" />
        </div>

        {/* Cards grid — 3 cols, different card style from member-categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
              ))
            : categories.map((category, index) => (
                <div
                  key={index}
                  className={`group relative rounded-2xl border border-border bg-card overflow-hidden
                    hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(0,194,255,0.10)]
                    hover:-translate-y-0.5 transition-all duration-300 ${animClass()}`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Line-grid background */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08]"
                    style={{
                      backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                                        linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Top gradient band — accent→primary */}
                  <div className="h-0.5 w-full bg-linear-to-r from-accent/70 via-primary/60 to-accent/30 group-hover:from-accent group-hover:via-primary group-hover:to-accent transition-all duration-500" />

                  {/* Bottom-right circuit watermark */}
                  <svg
                    className="pointer-events-none absolute -bottom-2 -right-2 opacity-[0.04] group-hover:opacity-[0.09] transition-opacity duration-500 text-accent"
                    width="64" height="64" viewBox="0 0 64 64" fill="none"
                  >
                    <circle cx="48" cy="48" r="3" fill="currentColor" />
                    <circle cx="24" cy="48" r="2" fill="currentColor" />
                    <circle cx="48" cy="24" r="2" fill="currentColor" />
                    <line x1="24" y1="48" x2="48" y2="48" stroke="currentColor" strokeWidth="1" />
                    <line x1="48" y1="24" x2="48" y2="48" stroke="currentColor" strokeWidth="1" />
                    <line x1="24" y1="48" x2="48" y2="24" stroke="currentColor" strokeWidth="1" />
                  </svg>

                  {/* Pulse dot — top right */}
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent/30 group-hover:animate-ping group-hover:bg-accent/50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent/40 group-hover:bg-accent/80 transition-colors duration-300" />
                  </span>

                  <div className="flex items-center gap-4 p-5 pl-6">
                    {/* Icon — accent tinted */}
                    <div className="shrink-0 w-13 h-13 rounded-xl
                      bg-linear-to-br from-accent/10 to-primary/10
                      dark:from-accent/15 dark:to-primary/15
                      border border-accent/20
                      flex items-center justify-center text-accent
                      group-hover:from-accent/20 group-hover:to-primary/20
                      group-hover:border-accent/50
                      transition-all duration-300">
                      <CyberIcon type={category.icon} size={26} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-foreground font-semibold text-sm leading-snug mb-1.5">
                        {language === 'en' ? category.nameEn : category.nameId}
                      </h3>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-accent text-xl font-bold tabular-nums">
                          {category.count}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {language === 'en' ? 'Members' : 'Anggota'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
