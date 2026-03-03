'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { CyberIcon } from '@/components/ui/cyber-icon'

interface MemberCategory {
  titleEn: string
  titleId: string
  count: number
  icon: string
}

export function MemberCategoriesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [categories, setCategories] = useState<MemberCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [heading, setHeading] = useState({
    subtitleEn: 'OUR COMMUNITY',
    subtitleId: 'KOMUNITAS KAMI',
    titleEn: 'ADIGSI Cyber Security Members',
    titleId: 'Anggota Cyber Security ADIGSI',
  })
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    fetch('/api/cms/members/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || [])
        if (data.heading) {
          setHeading({
            subtitleEn: data.heading.subtitleEn || 'OUR COMMUNITY',
            subtitleId: data.heading.subtitleId || 'KOMUNITAS KAMI',
            titleEn: data.heading.titleEn || 'ADIGSI Cyber Security Members',
            titleId: data.heading.titleId || 'Anggota Cyber Security ADIGSI',
          })
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error)
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

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-primary/10 dark:bg-primary/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-accent/8 dark:bg-accent/12 blur-[100px]" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

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

          {/* Gradient underline */}
          <div className="h-px w-16 bg-linear-to-r from-primary to-accent" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-muted animate-pulse"
              />
            ))
            : categories.map((category, index) => (
              <div
                key={index}
                className={`group relative rounded-2xl border border-border bg-card overflow-hidden p-5
                    hover:border-primary/40 hover:shadow-[0_8px_32px_rgba(58,111,247,0.12)]
                    hover:-translate-y-0.5 transition-all duration-300 ${animClass()}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Subtle dot-grid in background */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.16] pointer-events-none transition-opacity duration-500"
                  style={{
                    backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
                    backgroundSize: '14px 14px',
                  }}
                />

                {/* Top scan line on hover */}
                <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500" />

                {/* Corner brackets */}
                <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent/20 group-hover:border-accent/60 transition-colors duration-300 rounded-tr-sm" />
                <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-primary/20 group-hover:border-primary/50 transition-colors duration-300 rounded-bl-sm" />

                <div className="flex items-center gap-4 pl-1">
                  {/* Icon container */}
                  <div className="shrink-0 w-13 h-13 rounded-xl bg-primary/8 dark:bg-primary/15 border border-primary/20
                      flex items-center justify-center text-primary
                      group-hover:bg-primary/15 group-hover:border-primary/40
                      transition-all duration-300">
                    <CyberIcon type={category.icon} size={26} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-semibold text-sm leading-snug mb-1.5">
                      {language === 'en' ? category.titleEn : category.titleId}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-primary text-xl font-bold tabular-nums">
                        {category.count}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {language === 'en' ? 'Members' : 'Anggota'}
                      </span>
                    </div>
                  </div>

                  {/* Mini cyber badge */}
                  <div className="shrink-0 flex flex-col items-end gap-0.5 opacity-20 group-hover:opacity-60 transition-opacity duration-300">
                    <div className="w-4 h-0.5 rounded-full bg-accent" />
                    <div className="w-2.5 h-0.5 rounded-full bg-primary" />
                    <div className="w-3.5 h-0.5 rounded-full bg-accent" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
