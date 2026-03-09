'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { CyberIcon } from '@/components/ui/cyber-icon'

interface JoinButtonConfig {
  textEn: string
  textId: string
  link: string
  icon: string
}

const DEFAULT_CONFIG: JoinButtonConfig = {
  textEn: 'Join Now',
  textId: 'Daftar',
  link: '/register',
  icon: 'network',
}

export function FloatingJoinButton() {
  const { t, language } = useLanguage()
  const [config, setConfig] = useState<JoinButtonConfig>(DEFAULT_CONFIG)

  useEffect(() => {
    fetch('/api/cms/home/floating-buttons')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.joinButton) setConfig({ ...DEFAULT_CONFIG, ...data.joinButton })
      })
      .catch(() => {})
  }, [])

  const label = language === 'en' ? config.textEn : config.textId

  function FloatingIcon() {
    if (config.icon === 'join') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    }
    return <CyberIcon type={config.icon || 'network'} />
  }

  return (
    <>
      <style>{`
        @keyframes fjb-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(58,111,247,0.4); }
          50%       { box-shadow: 0 4px 36px rgba(58,111,247,0.85), 0 0 0 6px rgba(58,111,247,0.15); }
        }
        .fjb-link {
          animation: fjb-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 group">
        <Link
          href={config.link || '/register'}
          target={config.link?.startsWith('http') ? '_blank' : undefined}
          rel={config.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="fjb-link relative flex flex-col items-center justify-center gap-2 px-3 py-2 sm:py-5 w-8 sm:w-11
            bg-linear-to-b from-primary to-accent text-primary-foreground rounded-l-md sm:rounded-l-2xl
            transition-all duration-300
            group-hover:w-14 group-hover:brightness-110"
          aria-label={label}
        >
          {/* Shimmer sweep on hover */}
          <span
            className="absolute inset-0 bg-linear-to-b from-white/20 via-white/5 to-transparent
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          />

          {/* Icon */}
          <div className="shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110 text-primary-foreground [&_svg]:w-3 sm:[&_svg]:w-4 [&_svg]:h-3 sm:[&_svg]:h-4 [&_svg]:stroke-0.5 sm:[&_svg]:stroke-current">
            <FloatingIcon />
          </div>

          {/* Vertical text */}
          <span
            className="relative z-10 text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-none"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
          >
            {label}
          </span>
        </Link>
      </div>
    </>
  )
}
