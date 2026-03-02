'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

export function FloatingJoinButton() {
  const { t } = useLanguage()

  return (
    <>
      <style>{`
        @keyframes fjb-nudge {
          0%, 70%, 100% { transform: translateY(-50%) translateX(0); }
          74%            { transform: translateY(-50%) translateX(-10px); }
          78%            { transform: translateY(-50%) translateX(-5px); }
          82%            { transform: translateY(-50%) translateX(-8px); }
          86%            { transform: translateY(-50%) translateX(-3px); }
        }
        @keyframes fjb-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(58,111,247,0.4); }
          50%       { box-shadow: 0 4px 36px rgba(58,111,247,0.85), 0 0 0 6px rgba(58,111,247,0.15); }
        }
        .fjb-wrapper {
          animation: fjb-nudge 4s ease-in-out infinite;
        }
        .fjb-link {
          animation: fjb-glow 2s ease-in-out infinite;
        }
        .fjb-wrapper:hover {
          animation: none;
          transform: translateY(-50%) translateX(-4px);
        }
      `}</style>

      <div className="fjb-wrapper fixed right-0 top-1/2 z-40 group">
        <Link
          href="/register"
          className="fjb-link relative flex flex-col items-center justify-center gap-2 px-3 pt-5 pb-7 w-11
            bg-primary text-primary-foreground
            transition-all duration-300
            group-hover:w-14 group-hover:brightness-110"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)' }}
          aria-label={t({ en: 'Join Now', id: 'Daftar Sekarang' })}
        >
          {/* Shimmer sweep on hover */}
          <span
            className="absolute inset-0 bg-linear-to-b from-white/20 via-white/5 to-transparent
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          />

          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>

          {/* Vertical text */}
          <span
            className="relative z-10 text-[10px] font-black uppercase tracking-widest leading-none"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
          >
            {t({ en: 'Join Now', id: 'Daftar' })}
          </span>
        </Link>
      </div>
    </>
  )
}
