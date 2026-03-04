'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

export interface EventData {
  _id: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  image: string
  registerLink: string
  published: boolean
}

interface EventCardProps {
  event: EventData
  index: number
  animClass: string
  onPreviewClick: (preview: { src: string; alt: string }) => void
}

export function EventCard({ event, index, animClass, onPreviewClick }: EventCardProps) {
  const { t, language } = useLanguage()
  const title = language === 'en' ? event.titleEn : event.titleId
  const category = language === 'en' ? event.categoryEn : event.categoryId

  return (
    <div
      className={`group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden
        transition-all duration-300 ${animClass}`}
      style={{
        animationDelay: `${index * 70}ms`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(58,111,247,0.45)'
        el.style.boxShadow = '0 0 0 1px rgba(58,111,247,0.12), 0 8px 28px rgba(58,111,247,0.14)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = ''
        el.style.boxShadow = ''
      }}
    >
      {/* Shimmer sweep on hover */}
      <div className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out pointer-events-none z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(58,111,247,0.06), transparent)' }}
      />

      {/* Image area */}
      <div className="relative overflow-hidden">
        <Image
          src={event.image || '/placeholder.svg'}
          alt={title}
          width={420}
          height={220}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ height: '200px' }}
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />

        {/* Preview button */}
        <button
          onClick={() => onPreviewClick({ src: event.image, alt: title })}
          aria-label="Preview image"
          className="cursor-pointer absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-20"
        >
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest
            bg-card/90 border border-primary/40 text-primary backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Preview
          </span>
        </button>

        {/* Category badge */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest
            bg-card/95 border border-primary/30 text-primary backdrop-blur-sm">
            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            {category}
          </span>
        </div>

        {/* Top scan-line accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        {/* Bottom gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Corner brackets accent */}
        <div className="relative mb-4">
          <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-primary/30" />
          <h3 className="text-foreground font-bold text-sm leading-snug pl-2 pr-2 pt-1">
            {title}
          </h3>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="h-px bg-border mb-4 group-hover:bg-primary/30 transition-colors duration-300" />

        {/* Register button — pinned to bottom */}
        <div className="mt-auto">
          <Link
            href={event.registerLink}
            target={event.registerLink.startsWith('http') ? '_blank' : undefined}
            rel={event.registerLink.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group/btn relative inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300
                        border border-primary text-primary
                        hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_16px_rgba(58,111,247,0.3)]"
          >
            {/* Shimmer */}
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="relative">{t({ en: 'Register Now', id: 'Daftar Sekarang' })}</span>
          </Link>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}
