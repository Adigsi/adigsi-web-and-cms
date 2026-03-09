'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

interface JoinSectionData {
  titleEn: string
  titleId: string
  buttonTextEn: string
  buttonTextId: string
  buttonUrl: string
}

export function JoinAdigsiSection() {
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [joinData, setJoinData] = useState<JoinSectionData>({
    titleEn: "",
    titleId: '',
    buttonTextEn: '',
    buttonTextId: '',
    buttonUrl: '/registration-form',
  })
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef<'up' | 'down'>('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cms/register/join')
        if (response.ok) {
          const data = await response.json()
          setJoinData((prev) => ({
            titleEn: data.titleEn || prev.titleEn,
            titleId: data.titleId || prev.titleId,
            buttonTextEn: data.buttonTextEn || 'Join Now',
            buttonTextId: data.buttonTextId || 'Bergabung Sekarang',
            buttonUrl: data.buttonUrl || prev.buttonUrl,
          }))
        }
      } catch (error) {
        console.error('Error fetching join data:', error)
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
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 overflow-hidden bg-secondary/40 dark:bg-secondary/20 border-b border-border"
    >
      {/* Line-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Central hero glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-150 h-75 rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-75 h-50 rounded-full bg-accent/8 dark:bg-accent/14 blur-[80px]" />
      </div>

      {/* Top / bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" />

      {/* Corner brackets — decorative */}
      <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary/20 rounded-tl-sm" />
      <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent/20 rounded-tr-sm" />
      <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent/20 rounded-bl-sm" />
      <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary/20 rounded-br-sm" />

      <div className="relative max-w-3xl mx-auto px-4 md:px-8 text-center">
        {/* Badge */}
        <div className={`flex justify-center mb-6 transition-all duration-700 ${animClass()}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {language === 'en' ? 'Join Us' : 'Bergabung'}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2
          className={`text-2xl md:text-3xl font-bold text-foreground leading-snug mb-6 transition-all duration-700 ${animClass()}`}
          style={{ animationDelay: '80ms' }}
        >
          {language === 'en' ? joinData.titleEn : joinData.titleId}
        </h2>

        {/* Gradient underline */}
        <div className={`flex justify-center mb-8 transition-all duration-700 ${animClass()}`} style={{ animationDelay: '120ms' }}>
          <div className="h-px w-16 rounded-full bg-linear-to-r from-primary to-accent" />
        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-700 ${animClass()}`} style={{ animationDelay: '160ms' }}>
          <Link
            href={joinData.buttonUrl}
            // target="_blank"
            target={joinData.buttonUrl.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 relative overflow-hidden
              bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary
              text-primary-foreground font-semibold rounded-xl px-8 py-4
              shadow-[0_4px_24px_rgba(58,111,247,0.35)] hover:shadow-[0_6px_32px_rgba(58,111,247,0.50)]
              transition-all duration-300 no-underline"
          >
            {/* Scan line on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700
              bg-linear-to-r from-transparent via-white/10 to-transparent" />
            <span>{language === 'en' ? joinData.buttonTextEn : joinData.buttonTextId}</span>
            {/* Arrow icon */}
            <svg viewBox="0 0 16 16" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
