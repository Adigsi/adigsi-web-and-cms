'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { CyberIcon } from '@/components/ui/cyber-icon'

interface Category {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  iconUrl: string
}

export function MembershipCategorySection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [sectionData, setSectionData] = useState<{
    sectionTitleEn: string
    sectionTitleId: string
    sectionDescriptionEn: string
    sectionDescriptionId: string
    categories: Category[]
  }>({
    sectionTitleEn: 'CATEGORY',
    sectionTitleId: 'KATEGORI',
    sectionDescriptionEn:
      'We offer several membership categories designed to accommodate the diverse backgrounds and needs of stakeholders in the digital ecosystem.',
    sectionDescriptionId:
      'Kami menawarkan beberapa kategori keanggotaan yang dirancang untuk mengakomodasi latar belakang dan kebutuhan berbagai pemangku kepentingan dalam ekosistem digital.',
    categories: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cms/register/membership')
        if (response.ok) {
          const data = await response.json()
          setSectionData({
            sectionTitleEn: data.sectionTitleEn || 'CATEGORY',
            sectionTitleId: data.sectionTitleId || 'KATEGORI',
            sectionDescriptionEn: data.sectionDescriptionEn || '',
            sectionDescriptionId: data.sectionDescriptionId || '',
            categories: data.categories || [],
          })
        }
      } catch (error) {
        console.error('Error fetching membership data:', error)
      } finally {
        setIsLoading(false)
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
  }, [isLoading, sectionData.categories])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden bg-background border-b border-border"
    >
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.18]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-primary/10 dark:bg-primary/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-accent/8 dark:bg-accent/12 blur-[100px]" />

      {/* Top / bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Header */}
        <div className={`flex flex-col items-center text-center mb-14 transition-all duration-700 ${animClass()}`}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-accent/30 bg-accent/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
              {language === 'en' ? sectionData.sectionTitleEn : sectionData.sectionTitleId}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
            {language === 'en' ? 'Membership Category' : 'Kategori Keanggotaan'}
          </h2>

          <div className="h-px w-16 rounded-full bg-linear-to-r from-accent to-primary mb-4" />

          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
            {language === 'en' ? sectionData.sectionDescriptionEn : sectionData.sectionDescriptionId}
          </p>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : sectionData.categories.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {language === 'en' ? 'No categories available' : 'Tidak ada kategori yang tersedia'}
          </p>
        ) : (
          <div
            className={`grid gap-6 ${
              sectionData.categories.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {sectionData.categories.map((category, index) => (
              <div
                key={index}
                className={`group relative rounded-xl border border-border bg-card overflow-hidden
                  hover:border-primary/40
                  hover:shadow-[0_0_0_1px_rgba(58,111,247,0.15),0_8px_28px_rgba(58,111,247,0.12)]
                  transition-all duration-300 ${animClass()}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Scan-line sweep on hover */}
                <div className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out
                  bg-linear-to-r from-transparent via-primary/6 to-transparent pointer-events-none z-10" />

                {/* Left panel */}
                <div className="absolute left-0 top-0 bottom-0 w-14 flex flex-col items-center justify-between py-4
                  bg-linear-to-b from-primary/8 to-primary/4 dark:from-primary/18 dark:to-primary/8
                  border-r border-border group-hover:from-primary/14 group-hover:to-primary/8 transition-all duration-300">

                  {/* Icon */}
                  <div className="flex items-center justify-center w-9 h-9 text-primary/70 group-hover:text-primary transition-colors duration-300">
                    <CyberIcon type={category.iconUrl || 'network'} size={32} />
                  </div>

                  {/* Vertical indicator dots */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary/60 group-hover:bg-primary transition-colors duration-300" />
                    <div className="w-1 h-3 rounded-full bg-primary/20 group-hover:bg-primary/50 transition-colors duration-300" />
                    <div className="w-1 h-1 rounded-full bg-primary/10 group-hover:bg-primary/30 transition-colors duration-300" />
                  </div>

                  {/* Index number */}
                  <span className="text-[10px] font-mono font-bold text-primary/30 group-hover:text-primary/60 transition-colors duration-300 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Main content */}
                <div className="pl-18 pr-4 py-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Title */}
                    <h3 className="text-foreground font-bold text-sm uppercase tracking-wide leading-snug">
                      {language === 'en' ? category.titleEn : category.titleId}
                    </h3>

                    {/* Status badge */}
                    <div className="shrink-0 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-3 rounded-full bg-primary group-hover:animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-0.5 h-2 rounded-full bg-primary/70 group-hover:animate-bounce" style={{ animationDelay: '80ms' }} />
                        <div className="w-0.5 h-4 rounded-full bg-primary group-hover:animate-bounce" style={{ animationDelay: '160ms' }} />
                        <div className="w-0.5 h-1.5 rounded-full bg-primary/50 group-hover:animate-bounce" style={{ animationDelay: '240ms' }} />
                        <div className="w-0.5 h-3 rounded-full bg-primary/80 group-hover:animate-bounce" style={{ animationDelay: '320ms' }} />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {language === 'en' ? category.descriptionEn : category.descriptionId}
                  </p>

                  {/* Bottom rule */}
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border group-hover:bg-linear-to-r group-hover:from-primary/30 group-hover:to-transparent transition-all duration-500" />
                    <svg viewBox="0 0 12 12" className="w-3 h-3 text-primary/20 group-hover:text-primary/50 transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polygon points="6,1 11,4 11,8 6,11 1,8 1,4" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
