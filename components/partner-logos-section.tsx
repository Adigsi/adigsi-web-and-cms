'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface PartnerLogo {
  alt: string
  imageUrl: string
}

interface PartnerCategory {
  categoryNameEn: string
  categoryNameId: string
  width: number
  height: number
  logos: PartnerLogo[]
}

interface PartnerLogosData {
  heading: {
    subtitleEn: string
    subtitleId: string
    titleEn: string
    titleId: string
  }
  categories: PartnerCategory[]
}

export function PartnerLogosSection() {
  const [partnerLogosData, setPartnerLogosData] = useState<PartnerLogosData | null>(null)
  const [windowWidth, setWindowWidth] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/cms/members/partner-logos')
        if (res.ok) {
          const data = await res.json()
          setPartnerLogosData(data)
        }
      } catch (error) {
        console.error('Error fetching partner logos:', error)
      }
    }
    fetchData()
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
  }, [partnerLogosData])

  if (!partnerLogosData) return null

  const hasLogos = partnerLogosData.categories.some((cat) => cat.logos.length > 0)
  if (!hasLogos) return null

  const getResponsiveSize = (baseWidth: number): number => {
    if (!windowWidth) return baseWidth
    if (windowWidth < 640) return Math.max(baseWidth * 0.5, 80)
    if (windowWidth < 1024) return Math.max(baseWidth * 0.75, 120)
    return baseWidth
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden bg-background border-b border-border"
    >
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1] dark:opacity-[0.2]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-primary/8 dark:bg-primary/12 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/3 w-96 h-96 rounded-full bg-accent/6 dark:bg-accent/10 blur-[120px]" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Header */}
        <div className={`flex flex-col items-center text-center mb-14 transition-all duration-700 ${animClass()}`}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-accent/30 bg-accent/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
              {t({
                en: partnerLogosData.heading.subtitleEn,
                id: partnerLogosData.heading.subtitleId,
              })}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">
            {t({
              en: partnerLogosData.heading.titleEn,
              id: partnerLogosData.heading.titleId,
            })}
          </h2>

          <div className="h-px w-16 rounded-full bg-linear-to-r from-primary to-accent" />
        </div>

        {/* Partner categories */}
        {partnerLogosData.categories.map((category, categoryIndex) =>
          category.logos.length > 0 ? (
            <div
              key={categoryIndex}
              className={`mb-10 transition-all duration-700 ${animClass()}`}
              style={{ animationDelay: `${categoryIndex * 100}ms` }}
            >
              {/* Logos */}
              <div className="flex flex-wrap justify-center items-center gap-4">
                {category.logos.map((logo, logoIndex) => {
                  const size = getResponsiveSize(category.width)
                  return (
                    <div
                      key={logoIndex}
                      className={`group relative rounded-xl border border-border bg-card
                        hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(58,111,247,0.12)]
                        hover:-translate-y-0.5 transition-all duration-300
                        overflow-hidden flex items-center justify-center ${animClass()}`}
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        minWidth: `${size}px`,
                        minHeight: `${size}px`,
                        animationDelay: `${categoryIndex * 100 + logoIndex * 40}ms`,
                      }}
                    >
                      {/* Corner bracket top-right */}
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-accent/20 group-hover:border-accent/60 transition-colors duration-300 rounded-tr-sm" />
                      {/* Corner bracket bottom-left */}
                      <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-primary/20 group-hover:border-primary/50 transition-colors duration-300 rounded-bl-sm" />

                      {logo.imageUrl ? (
                        <img
                          src={logo.imageUrl}
                          alt={logo.alt || 'Partner logo'}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 dark:brightness-90 dark:group-hover:brightness-110"
                          style={{ padding: `${size * 0.08}px` }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground text-center px-2 font-medium">
                          {logo.alt || '—'}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null
        )}
      </div>
    </section>
  )
}
