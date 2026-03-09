'use client'

import Image from 'next/image'
import { FileText, Download } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export interface ReportData {
  _id: string
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  cover: string
  tags: string[]
  hasPdf: boolean
}

interface ReportCardProps {
  report: ReportData
  index: number
  animClass: string
  onDownload: (report: ReportData) => void
}

export function ReportCard({ report, index, animClass, onDownload }: ReportCardProps) {
  const { language } = useLanguage()
  const title = language === 'en' ? report.titleEn : report.titleId
  const description = language === 'en' ? report.descriptionEn : report.descriptionId

  return (
    <div
      className={`group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden
        transition-all duration-300 ${animClass}`}
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

      {/* Cover image */}
      <div className="relative overflow-hidden">
        {report.cover ? (
          <Image
            src={report.cover}
            alt={title}
            width={420}
            height={220}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ height: '200px' }}
          />
        ) : (
          <div className="w-full flex items-center justify-center bg-muted" style={{ height: '200px' }}>
            <FileText className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />

        {/* Top scan-line accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <div className="relative mb-3">
          <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-primary/30" />
          <h3 className="text-foreground font-bold text-sm leading-snug pl-2 pr-2 pt-1 line-clamp-3">
            {title}
          </h3>
        </div>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-3">
            {description}
          </p>
        )}

        {/* Tags */}
        {report.tags && report.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {report.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full border border-border text-[10px] font-medium text-muted-foreground bg-muted/50"
              >
                {tag}
              </span>
            ))}
            {report.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full border border-border text-[10px] font-medium text-muted-foreground bg-muted/50">
                +{report.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Download button */}
        {report.hasPdf && (
          <button
            onClick={() => onDownload(report)}
            className="group/btn relative w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs
              bg-primary text-primary-foreground border border-primary overflow-hidden
              hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(58,111,247,0.3)] transition-all duration-300"
          >
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            <Download className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
            <span className="relative">
              {language === 'en' ? 'Download Report' : 'Unduh Laporan'}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
