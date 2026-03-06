'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

export interface NewsData {
  _id: string
  slug: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  contentEn: string
  contentId: string
  image: string
  published: boolean
  createdAt: string
}

interface NewsCardProps {
  article: NewsData
  index: number
  animClass: string
}

function getTimeAgo(dateString: string, language: string): string {
  try {
    const now = new Date()
    const past = new Date(dateString)
    if (isNaN(past.getTime())) return language === 'en' ? 'Recently' : 'Baru-baru ini'
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)
    if (diffMins < 1) return language === 'en' ? 'Just now' : 'Baru saja'
    if (diffMins < 60) return language === 'en' ? `${diffMins} minute${diffMins > 1 ? 's' : ''} ago` : `${diffMins} menit yang lalu`
    if (diffHours < 24) return language === 'en' ? `${diffHours} hour${diffHours > 1 ? 's' : ''} ago` : `${diffHours} jam yang lalu`
    if (diffDays < 7) return language === 'en' ? `${diffDays} day${diffDays > 1 ? 's' : ''} ago` : `${diffDays} hari yang lalu`
    if (diffWeeks < 4) return language === 'en' ? `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago` : `${diffWeeks} minggu yang lalu`
    if (diffMonths < 12) return language === 'en' ? `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago` : `${diffMonths} bulan yang lalu`
    return language === 'en' ? `${diffYears} year${diffYears > 1 ? 's' : ''} ago` : `${diffYears} tahun yang lalu`
  } catch {
    return language === 'en' ? 'Recently' : 'Baru-baru ini'
  }
}

export function NewsCard({ article, index, animClass }: NewsCardProps) {
  const { language } = useLanguage()
  const title = language === 'en' ? article.titleEn : article.titleId
  const category = language === 'en' ? article.categoryEn : article.categoryId

  return (
    <Link
      href={`/news/${article.slug}`}
      className={`group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden
        no-underline transition-all duration-300 ${animClass}`}
      style={{ animationDelay: `${index * 70}ms` }}
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
      <div
        className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out pointer-events-none z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(58,111,247,0.06), transparent)' }}
      />

      {/* Image area */}
      <div className="relative overflow-hidden">
        <Image
          src={article.image || '/placeholder.svg'}
          alt={title}
          width={420}
          height={220}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ height: '200px' }}
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />

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

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Corner bracket + title */}
        <div className="relative mb-3">
          <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-primary/30" />
          <h3 className="text-foreground font-bold text-sm leading-snug pl-2 pr-2 pt-1 line-clamp-3">
            {title}
          </h3>
        </div>

        {/* Time ago */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
          <svg className="w-3 h-3 shrink-0 text-primary/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{article.createdAt ? getTimeAgo(article.createdAt, language) : (language === 'en' ? 'Recently' : 'Baru-baru ini')}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="h-px bg-border mb-4 group-hover:bg-primary/30 transition-colors duration-300" />

        {/* Read article button */}
        <div className="mt-auto">
          <span className="group/btn relative inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300
            border border-primary text-primary
            group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_16px_rgba(58,111,247,0.3)]">
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="relative">{language === 'en' ? 'Read Article' : 'Baca Artikel'}</span>
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  )
}
