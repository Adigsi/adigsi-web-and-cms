'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'

interface AboutData {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  visionEn: string
  visionId: string
  missions: Array<{ en: string; id: string }>
}

interface Logo {
  alt: string
  imageUrl: string
}

interface Category {
  titleEn: string
  titleId: string
  logos: Logo[]
}

// ─── Shared animation hook ───────────────────────────────────────────────────
function useScrollAnimation(deps: unknown[] = []) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      scrollDirectionRef.current = window.scrollY > lastScrollYRef.current ? 'down' : 'up'
      lastScrollYRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && scrollDirectionRef.current === 'down') {
          if (fadeOutTimeoutRef.current) { clearTimeout(fadeOutTimeoutRef.current); fadeOutTimeoutRef.current = null }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const animClass = () =>
    isFadingOut ? 'animate-fade-out-down'
      : isVisible ? 'animate-fade-in-up'
      : 'opacity-0 translate-y-[120px]'

  const animStyle = (delay: string) => ({
    animationDelay: isFadingOut ? '0ms' : isVisible ? delay : '0ms',
    animationDuration: isFadingOut || isVisible ? '1.2s' : '0s',
  })

  return { sectionRef, isVisible, isFadingOut, animClass, animStyle }
}

// ─── AboutAdigsiSection ───────────────────────────────────────────────────────
export function AboutAdigsiSection() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t, language } = useLanguage()
  const { sectionRef, animClass, animStyle } = useScrollAnimation([isLoading, aboutData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/cms/about/about')
        if (res.ok) {
          const data = await res.json()
          setAboutData({
            titleEn: data.titleEn || 'Indonesian Association for Digitalization and Cybersecurity',
            titleId: data.titleId || 'Asosiasi Indonesia untuk Digitalisasi dan Keamanan Siber',
            descriptionEn: data.descriptionEn || '',
            descriptionId: data.descriptionId || '',
            visionEn: data.visionEn || '',
            visionId: data.visionId || '',
            missions: data.missions?.length > 0 ? data.missions : [{ en: '', id: '' }],
          })
        }
      } catch (error) {
        console.error('Error fetching about data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <section className="w-full py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center text-muted-foreground">
          {t({ en: 'Loading...', id: 'Memuat...' })}
        </div>
      </section>
    )
  }

  if (!aboutData) return null

  const title = language === 'en' ? aboutData.titleEn : aboutData.titleId
  const description = language === 'en' ? aboutData.descriptionEn : aboutData.descriptionId
  const vision = language === 'en' ? aboutData.visionEn : aboutData.visionId
  const missions = aboutData.missions.map(m => language === 'en' ? m.en : m.id).filter(m => m.length > 0)

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden bg-secondary/40 dark:bg-secondary/20 border-y border-border"
    >
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Header */}
        <div
          className={`flex flex-col items-center text-center mb-12 ${animClass()}`}
          style={animStyle('0ms')}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-accent/30 bg-accent/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
              {t({ en: 'About ADIGSI', id: 'Tentang ADIGSI' })}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground max-w-2xl">
            {title}
          </h2>
          <div className="mt-3 h-px w-16 bg-linear-to-r from-primary to-accent" />
        </div>

        {/* Description */}
        <div
          className={`max-w-3xl mx-auto text-center ${animClass()}`}
          style={animStyle('150ms')}
        >
          <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
        </div>

        {/* Vision */}
        <div
          className={`relative flex flex-col items-center text-center py-10 ${animClass()}`}
          style={animStyle('300ms')}
        >
          {/* Top accent line */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-primary/40 to-transparent mb-10" />

          {/* Label */}
          <span className="font-bold uppercase tracking-[0.2em] text-primary mb-4">
            {t({ en: 'Our Vision', id: 'Visi Kami' })}
          </span>

          {/* Decorative quote mark */}
          <svg className="w-8 h-8 text-accent/30 mb-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>

          <p className="max-w-2xl text-lg md:text-xl font-medium text-foreground leading-relaxed italic">
            {vision}
          </p>

          {/* Bottom accent line */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-primary/40 to-transparent mt-10" />
        </div>

        {/* Mission */}
        <div
          className={`${animClass()}`}
          style={animStyle('450ms')}
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-border" />
            <span className="font-bold uppercase tracking-[0.2em] text-accent shrink-0">
              {t({ en: 'Our Mission', id: 'Misi Kami' })}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Mission items as a 2-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            {missions.map((mission, index) => (
              <div key={index} className="flex items-center gap-4">
                {/* Index number */}
                <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {/* Left accent bar */}
                <div className="shrink-0 w-0.5 self-stretch bg-linear-to-b from-primary/50 to-accent/20 rounded-full" />
                <p className="text-[16px] text-muted-foreground leading-relaxed">{mission}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PartnersSection ──────────────────────────────────────────────────────────
export function PartnersSection() {
  const [partnersData, setPartnersData] = useState<{ categories: Category[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t, language } = useLanguage()
  const pathname = usePathname()
  const { sectionRef, animClass, animStyle } = useScrollAnimation([isLoading, partnersData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/cms/about/partners')
        if (res.ok) {
          const data = await res.json()
          setPartnersData(data)
        }
      } catch (error) {
        console.error('Error fetching partners data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <section className="w-full py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center text-muted-foreground">
          {t({ en: 'Loading...', id: 'Memuat...' })}
        </div>
      </section>
    )
  }

  if (!partnersData) return null

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden bg-background border-b border-border"
    >
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Header */}
        <div
          className={`flex flex-col items-center text-center mb-12 ${animClass()}`}
          style={animStyle('0ms')}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {t({ en: 'Partners & Members', id: 'Mitra & Anggota' })}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t({ en: 'Our', id: 'Ekosistem' })}{' '}
            <span className="text-primary">{t({ en: 'Ecosystem', id: 'Kami' })}</span>
          </h2>
          <div className="mt-3 h-px w-16 bg-linear-to-r from-primary to-accent" />
        </div>

        {/* Categories */}
        <div
          className={`bg-card border border-border rounded-2xl overflow-hidden shadow-sm ${animClass()}`}
          style={animStyle('200ms')}
        >
          {partnersData.categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {/* Category header */}
              <div className="flex items-center gap-3 px-6 md:px-8 pt-6 pb-4">
                <div className="w-1 h-5 rounded-full bg-linear-to-b from-primary to-accent shrink-0" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  {language === 'en' ? category.titleEn : category.titleId}
                </h3>
              </div>

              {/* Logos */}
              <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start px-6 md:px-8 pb-6">
                {category.logos?.length > 0 ? (
                  category.logos.map((logo, logoIndex) => (
                    <div
                      key={logoIndex}
                      className="relative h-40 w-40 flex items-center justify-center rounded-xl border border-border bg-muted/30 px-4 py-3 hover:border-primary/30 hover:bg-muted/60 transition-all duration-200"
                    >
                      <Image
                        src={logo.imageUrl || '/placeholder.svg'}
                        alt={logo.alt}
                        height={148}
                        width={148}
                        className="object-contain h-full w-auto"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t({ en: 'No logos added yet', id: 'Belum ada logo' })}
                  </p>
                )}
              </div>

              {categoryIndex < partnersData.categories.length - 1 && (
                <div className="h-px bg-border mx-6 md:mx-8" />
              )}
            </div>
          ))}
        </div>

        {/* Learn More CTA */}
        {pathname === '/' && (
          <div
            className={`flex justify-center mt-12 ${animClass()}`}
            style={animStyle('400ms')}
          >
            <Link
              href="/about"
              className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm overflow-hidden transition-all duration-300
                bg-primary text-primary-foreground border border-primary
                hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(58,111,247,0.35)]"
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">{t({ en: 'See All', id: 'Lihat Semua' })}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
