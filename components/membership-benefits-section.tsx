'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface Membership {
  tier: string
  nameEn: string
  nameId: string
  descriptionEn: string
  descriptionId: string
  iconUrl: string
}

export function MembershipBenefitsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await fetch('/api/cms/members/membership-benefits')
        if (response.ok) {
          const data = await response.json()
          if (data.memberships && Array.isArray(data.memberships) && data.memberships.length > 0) {
            setMemberships(data.memberships)
          }
        }
      } catch (error) {
        console.error('Error fetching membership benefits:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMemberships()
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
  }, [isLoading, memberships])

  if (isLoading || memberships.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden bg-background border-b border-border"
    >
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09] dark:opacity-[0.18]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 right-1/3 w-80 h-80 rounded-full bg-primary/10 dark:bg-primary/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-accent/8 dark:bg-accent/12 blur-[100px]" />

      {/* Top / bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Header */}
        <div className={`flex flex-col items-center text-center mb-14 transition-all duration-700 ${animClass()}`}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {language === 'en' ? 'MEMBERSHIP TIERS' : 'TINGKATAN KEANGGOTAAN'}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
            {language === 'en' ? 'Membership Category' : 'Kategori Keanggotaan'}
          </h2>

          <div className="h-1 w-16 rounded-full bg-linear-to-r from-primary to-accent" />
        </div>

        {/* Cards grid */}
        <div
          className={`grid gap-6 ${
            memberships.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : memberships.length === 3
              ? 'grid-cols-1 lg:grid-cols-3'
              : 'grid-cols-1 lg:grid-cols-2'
          }`}
        >
          {memberships.map((membership, index) => (
            <div
              key={`${membership.tier}-${index}`}
              className={`group relative rounded-2xl border border-border bg-card overflow-hidden
                hover:border-primary/40 hover:shadow-[0_8px_32px_rgba(58,111,247,0.12)]
                hover:-translate-y-0.5 transition-all duration-300 ${animClass()}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-linear-to-b from-primary/60 via-accent/50 to-primary/20 group-hover:from-primary group-hover:via-accent group-hover:to-primary/50 transition-all duration-500" />

              {/* Top scan line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500" />

              {/* Dot-grid overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] dark:group-hover:opacity-[0.12] pointer-events-none transition-opacity duration-500"
                style={{
                  backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
                  backgroundSize: '14px 14px',
                }}
              />

              {/* Corner brackets */}
              <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent/20 group-hover:border-accent/60 transition-colors duration-300 rounded-tr-sm" />
              <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-primary/20 group-hover:border-primary/50 transition-colors duration-300 rounded-bl-sm" />

              <div className="flex items-start gap-5 p-5 pl-6">
                {/* Badge Icon */}
                <div className="relative shrink-0 w-16 h-16">
                  <div
                    className="w-full h-full rounded-xl bg-primary/8 dark:bg-primary/15 border border-primary/20
                      group-hover:bg-primary/15 group-hover:border-primary/40
                      flex items-center justify-center overflow-hidden
                      transition-all duration-300 group-hover:scale-105"
                  >
                    {membership.iconUrl &&
                    (membership.iconUrl.startsWith('data:') ||
                      membership.iconUrl.startsWith('http') ||
                      membership.iconUrl.startsWith('/')) ? (
                      <img
                        src={membership.iconUrl}
                        alt={language === 'en' ? membership.nameEn : membership.nameId}
                        className="w-10 h-10 object-contain dark:brightness-90 dark:group-hover:brightness-110 transition-all duration-300"
                      />
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {(language === 'en' ? membership.nameEn : membership.nameId).charAt(0)}
                      </span>
                    )}
                  </div>
                  {/* Glow behind icon */}
                  <div className="absolute inset-0 rounded-xl blur-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-foreground font-bold text-base uppercase tracking-wide">
                      {language === 'en' ? membership.nameEn : membership.nameId}
                    </h3>
                    {membership.tier && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-primary/20 bg-primary/8 text-primary uppercase tracking-wider">
                        {membership.tier}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {language === 'en' ? membership.descriptionEn : membership.descriptionId}
                  </p>
                </div>

                {/* Mini barcode bars */}
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
