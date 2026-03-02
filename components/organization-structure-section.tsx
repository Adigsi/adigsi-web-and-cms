'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface Member {
  name: string
  positionEn: string
  positionId: string
  imageUrl: string
}

interface Group {
  titleEn: string
  titleId: string
  members: Member[]
}

export function OrganizationStructureSection() {
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef('down')
  const lastScrollYRef = useRef(0)
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { t, language } = useLanguage()

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
      { threshold: 0.1 }
    )
    observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current)
    }
  }, [isLoading, groups])

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const response = await fetch('/api/cms/about/organization')
        if (response.ok) {
          const data = await response.json()
          if (data.groups && data.groups.length > 0) {
            setGroups(data.groups)
          }
        }
      } catch (error) {
        console.error('Error fetching organization data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrganizationData()
  }, [])

  const animClass = () =>
    isFadingOut ? 'animate-fade-out-down'
      : isVisible ? 'animate-fade-in-up'
      : 'opacity-0 translate-y-[120px]'

  const animStyle = (delay: string) => ({
    animationDelay: isFadingOut ? '0ms' : isVisible ? delay : '0ms',
    animationDuration: isFadingOut || isVisible ? '1.2s' : '0s',
  })

  if (isLoading) {
    return (
      <section ref={sectionRef} className="w-full py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center text-muted-foreground">
          {t({ en: 'Loading...', id: 'Memuat...' })}
        </div>
      </section>
    )
  }

  if (!groups || groups.length === 0) return null

  return (
    <section ref={sectionRef} className="relative w-full py-20 overflow-hidden bg-background border-b border-border">

      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Header */}
        <div
          className={`flex flex-col items-center text-center mb-14 ${animClass()}`}
          style={animStyle('0ms')}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {t({ en: 'Organization', id: 'Organisasi' })}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t({ en: 'Organization', id: 'Struktur' })}{' '}
            <span className="text-primary">{t({ en: 'Structure', id: 'Organisasi' })}</span>
          </h2>
          <div className="mt-3 h-px w-16 bg-linear-to-r from-primary to-accent" />
        </div>

        {/* Groups */}
        <div className="space-y-16">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex}>

              {/* Group label */}
              <div
                className={`flex items-center gap-3 mb-8 ${animClass()}`}
                style={animStyle(`${groupIndex * 150}ms`)}
              >
                <div className="h-px flex-1 bg-border" />
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 shrink-0">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
                    {language === 'en' ? group.titleEn : group.titleId}
                  </span>
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Members grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {group.members.map((member, memberIndex) => (
                  <div
                    key={memberIndex}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card
                      hover:border-primary/50 hover:shadow-[0_8px_32px_rgba(58,111,247,0.18)]
                      transition-all duration-300 ${animClass()}`}
                    style={animStyle(`${(groupIndex * 150) + (memberIndex * 60) + 100}ms`)}
                  >
                    {/* Top accent strip */}
                    <div className="relative flex items-center justify-between px-3 py-2 bg-linear-to-r from-primary to-accent/80 shrink-0">
                      <svg className="absolute inset-0 w-full h-full opacity-10 text-white" viewBox="0 0 200 30" fill="none" preserveAspectRatio="xMidYMid slice">
                        <line x1="0" y1="15" x2="200" y2="15" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="20" cy="15" r="2" fill="currentColor" />
                        <circle cx="80" cy="15" r="2" fill="currentColor" />
                        <circle cx="140" cy="15" r="2" fill="currentColor" />
                        <circle cx="180" cy="15" r="2" fill="currentColor" />
                      </svg>
                      <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.2em] text-white/80">
                        ADIGSI
                      </span>
                      <span className="relative z-10 flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-white/50" />
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                      </span>
                    </div>

                    {/* Photo */}
                    <div className="relative w-full aspect-square overflow-hidden bg-muted">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125a7.5 7.5 0 0114.998 0" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Name & position */}
                    <div className="flex flex-col items-center text-center px-3 pt-3 pb-2">
                      <h3 className="text-sm font-bold text-foreground leading-snug mb-0.5 group-hover:text-primary transition-colors duration-200">
                        {member.name}
                      </h3>
                      <span className="text-[10px] text-muted-foreground leading-relaxed">
                        {language === 'en' ? member.positionEn : member.positionId}
                      </span>
                    </div>

                    {/* Footer strip */}
                    <div className="flex items-center justify-center gap-1 pb-3 px-3">
                      <span className="w-1 h-1 rounded-full bg-primary/40" />
                      <span className="w-4 h-1 rounded-full bg-primary/20" />
                      <span className="w-2 h-1 rounded-full bg-accent/30" />
                      <span className="w-3 h-1 rounded-full bg-primary/20" />
                      <span className="w-1 h-1 rounded-full bg-accent/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


