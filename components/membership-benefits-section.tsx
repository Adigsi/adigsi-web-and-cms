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

type TierKey = 'bronze' | 'silver' | 'gold' | 'platinum' | 'default'

const TIER_CONFIG: Record<TierKey, {
  primaryColor: string
  secondaryColor: string
  glowRgb: string
  panelBg: string
  panelBgHover: string
}> = {
  bronze: {
    primaryColor: '#B5651D',   /* dark copper / sienna */
    secondaryColor: '#6B2F0A',
    glowRgb: '181,101,29',
    panelBg: 'rgba(181,101,29,0.12)',
    panelBgHover: 'rgba(181,101,29,0.20)',
  },
  silver: {
    primaryColor: '#A8A9AD',
    secondaryColor: '#6B7280',
    glowRgb: '168,169,173',
    panelBg: 'rgba(168,169,173,0.10)',
    panelBgHover: 'rgba(168,169,173,0.18)',
  },
  gold: {
    primaryColor: '#F5C518',   /* bright gold / amber */
    secondaryColor: '#B8870B',
    glowRgb: '245,197,24',
    panelBg: 'rgba(245,197,24,0.10)',
    panelBgHover: 'rgba(245,197,24,0.18)',
  },
  platinum: {
    primaryColor: '#00C2FF',
    secondaryColor: '#0284C7',
    glowRgb: '0,194,255',
    panelBg: 'rgba(0,194,255,0.08)',
    panelBgHover: 'rgba(0,194,255,0.16)',
  },
  default: {
    primaryColor: '#3A6FF7',
    secondaryColor: '#1E2F8A',
    glowRgb: '58,111,247',
    panelBg: 'rgba(58,111,247,0.08)',
    panelBgHover: 'rgba(58,111,247,0.16)',
  },
}

function getTierConfig(tier: string) {
  const key = tier.toLowerCase() as TierKey
  return TIER_CONFIG[key] ?? TIER_CONFIG.default
}

/**
 * All tiers share the same medal silhouette (ribbon + circle).
 * Only the number of rank stripes inside the medal differs:
 *   Bronze   → 1 stripe
 *   Silver   → 2 stripes
 *   Gold     → 3 stripes
 *   Platinum → 4 stripes
 */
function TierIcon({ tier }: { tier: string }) {
  const t = tier.toLowerCase()

  // Stripe layouts per tier, positioned inside the inner ring (circle r≈8 at cy=24)
  const stripeGroups: Record<string, { y: number; x1: number; x2: number }[]> = {
    bronze:   [{ y: 24.5, x1: 13, x2: 27 }],
    silver:   [{ y: 22.5, x1: 13.5, x2: 26.5 }, { y: 26.5, x1: 13.5, x2: 26.5 }],
    gold:     [{ y: 21, x1: 14, x2: 26 }, { y: 24.5, x1: 13, x2: 27 }, { y: 28, x1: 14, x2: 26 }],
    platinum: [{ y: 20, x1: 14.5, x2: 25.5 }, { y: 23, x1: 13, x2: 27 }, { y: 26, x1: 13, x2: 27 }, { y: 29, x1: 14.5, x2: 25.5 }],
  }
  const stripes = stripeGroups[t] ?? stripeGroups.bronze

  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-11 h-11" stroke="currentColor" strokeWidth="1.5">
      {/* Ribbon — identical for all tiers */}
      <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
      <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
      <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />

      {/* Medal circle */}
      <circle cx="20" cy="24" r="12" />

      {/* Inner detail ring — identical for all tiers */}
      <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />

      {/* Rank stripes — vary by tier */}
      {stripes.map((s, i) => (
        <line
          key={i}
          x1={s.x1} y1={s.y} x2={s.x2} y2={s.y}
          strokeLinecap="round"
          strokeWidth={1.8}
        />
      ))}
    </svg>
  )
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
          {memberships.map((membership, index) => {
            const cfg = getTierConfig(membership.tier)
            return (
              <div
                key={`${membership.tier}-${index}`}
                className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden
                  transition-all duration-300 ${animClass()}`}
                style={{
                  borderColor: `rgba(${cfg.glowRgb},0.25)`,
                  animationDelay: `${index * 80}ms`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = `rgba(${cfg.glowRgb},0.55)`
                  el.style.boxShadow = `0 0 0 1px rgba(${cfg.glowRgb},0.15), 0 8px 28px rgba(${cfg.glowRgb},0.18)`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = `rgba(${cfg.glowRgb},0.25)`
                  el.style.boxShadow = ''
                }}
              >
                {/* Shimmer sweep on hover */}
                <div
                  className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out pointer-events-none z-10"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(${cfg.glowRgb},0.06), transparent)` }}
                />

                {/* Top gradient stripe */}
                {/* <div
                  className="h-1 w-full transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${cfg.primaryColor}90, ${cfg.secondaryColor}60, ${cfg.primaryColor}30)` }}
                /> */}

                {/* Left icon panel — absolute so it always fills full card height */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-22 flex flex-col items-center justify-between py-5 border-r transition-colors duration-300"
                  style={{
                    background: cfg.panelBg,
                    borderRightColor: `rgba(${cfg.glowRgb},0.20)`,
                  }}
                >
                  {/* Tier icon */}
                  <div
                    className="flex items-center justify-center w-13 h-13 rounded-xl"
                    style={{
                      color: cfg.primaryColor,
                      background: `rgba(${cfg.glowRgb},0.12)`,
                      border: `1px solid rgba(${cfg.glowRgb},0.25)`,
                    }}
                  >
                    <TierIcon tier={membership.tier} />
                  </div>

                  {/* Tier label vertical */}
                  <span
                    className="text-[12px] font-black tracking-[0.2em] uppercase select-none"
                    style={{
                      color: cfg.primaryColor,
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      opacity: 0.55,
                    }}
                  >
                    {membership.tier || 'MEMBER'}
                  </span>
                </div>

                {/* Main content — left padding clears the absolute panel */}
                <div className="flex flex-col flex-1 pl-26 pr-4 py-4 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-foreground font-bold text-sm uppercase tracking-wide leading-snug">
                        {language === 'en' ? membership.nameEn : membership.nameId}
                      </h3>

                      {/* Tier badge */}
                      {/* {membership.tier && (
                        <span
                          className="shrink-0 text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest border"
                          style={{
                            color: cfg.primaryColor,
                            borderColor: `rgba(${cfg.glowRgb},0.30)`,
                            backgroundColor: `rgba(${cfg.glowRgb},0.06)`,
                          }}
                        >
                          {membership.tier}
                        </span>
                      )} */}
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {language === 'en' ? membership.descriptionEn : membership.descriptionId}
                    </p>

                    {/* Tier progress indicator — pinned to bottom, count matches stripe count */}
                    {(() => {
                      const ALL_TIERS = ['bronze', 'silver', 'gold', 'platinum'] as const
                      const tierStr = membership.tier.toLowerCase()
                      // match exact first, then partial (handles "Bronze Member" etc.)
                      const matched = ALL_TIERS.find(t => tierStr === t)
                        ?? ALL_TIERS.find(t => tierStr.includes(t))
                        ?? 'bronze'
                      const count = ALL_TIERS.indexOf(matched) + 1   // bronze=1, silver=2, gold=3, platinum=4
                      return (
                        <div className="flex items-center gap-1.5 mt-auto pt-3">
                          {ALL_TIERS.slice(0, count).map((t, i) => {
                            const segCfg = TIER_CONFIG[t]
                            const isLast = i === count - 1
                            return (
                              <div
                                key={t}
                                className="h-1 w-1/4 rounded-full"
                                style={{
                                  backgroundColor: segCfg.primaryColor,
                                  opacity: isLast ? 1 : 0.35,
                                }}
                              />
                            )
                          })}
                        </div>
                      )
                    })()}
                  </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}