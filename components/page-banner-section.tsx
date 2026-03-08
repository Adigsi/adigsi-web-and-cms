'use client'

import Image from 'next/image'

interface PageBannerSectionProps {
  title: string
  badge?: string
  isLoading?: boolean
}

export function PageBannerSection({
  title,
  badge = 'ADIGSI',
  isLoading = false,
}: PageBannerSectionProps) {
  return (
    <section className="relative w-full pt-12 sm:pt-24 pb-14 overflow-hidden bg-secondary/40 dark:bg-secondary/20">

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow — top center */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
      {/* Bottom accent line */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" /> */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" /> */}

      {/* Decorative corner brackets */}
      {/* <span className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-accent/40 rounded-tl-lg" />
      <span className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-accent/40 rounded-tr-lg" />
      <span className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
      <span className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-primary/30 rounded-br-lg" /> */}

      {/* Floating hex circuit nodes — right */}
      {/* <svg
        className="pointer-events-none absolute right-10 top-8 opacity-[0.06] dark:opacity-[0.10] text-primary"
        width="220" height="160" viewBox="0 0 220 160" fill="none"
      >
        <circle cx="20" cy="20" r="4" fill="currentColor" />
        <circle cx="100" cy="20" r="4" fill="currentColor" />
        <circle cx="200" cy="20" r="4" fill="currentColor" />
        <circle cx="60" cy="80" r="4" fill="currentColor" />
        <circle cx="160" cy="80" r="4" fill="currentColor" />
        <circle cx="20" cy="140" r="4" fill="currentColor" />
        <circle cx="110" cy="140" r="4" fill="currentColor" />
        <circle cx="200" cy="140" r="4" fill="currentColor" />
        <line x1="20" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="1" />
        <line x1="100" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="1" />
        <line x1="20" y1="20" x2="60" y2="80" stroke="currentColor" strokeWidth="1" />
        <line x1="100" y1="20" x2="60" y2="80" stroke="currentColor" strokeWidth="1" />
        <line x1="100" y1="20" x2="160" y2="80" stroke="currentColor" strokeWidth="1" />
        <line x1="200" y1="20" x2="160" y2="80" stroke="currentColor" strokeWidth="1" />
        <line x1="60" y1="80" x2="20" y2="140" stroke="currentColor" strokeWidth="1" />
        <line x1="60" y1="80" x2="110" y2="140" stroke="currentColor" strokeWidth="1" />
        <line x1="160" y1="80" x2="110" y2="140" stroke="currentColor" strokeWidth="1" />
        <line x1="160" y1="80" x2="200" y2="140" stroke="currentColor" strokeWidth="1" />
      </svg> */}

      {/* Floating hex circuit nodes — left */}
      <svg
        className="pointer-events-none absolute left-8 bottom-4 opacity-[0.05] dark:opacity-[0.08] text-accent"
        width="160" height="120" viewBox="0 0 160 120" fill="none"
      >
        <circle cx="10" cy="10" r="3" fill="currentColor" />
        <circle cx="80" cy="10" r="3" fill="currentColor" />
        <circle cx="150" cy="10" r="3" fill="currentColor" />
        <circle cx="40" cy="60" r="3" fill="currentColor" />
        <circle cx="120" cy="60" r="3" fill="currentColor" />
        <circle cx="10" cy="110" r="3" fill="currentColor" />
        <circle cx="80" cy="110" r="3" fill="currentColor" />
        <circle cx="150" cy="110" r="3" fill="currentColor" />
        <line x1="10" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="1" />
        <line x1="80" y1="10" x2="150" y2="10" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="10" x2="40" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="80" y1="10" x2="40" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="80" y1="10" x2="120" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="150" y1="10" x2="120" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="40" y1="60" x2="10" y2="110" stroke="currentColor" strokeWidth="1" />
        <line x1="40" y1="60" x2="80" y2="110" stroke="currentColor" strokeWidth="1" />
        <line x1="120" y1="60" x2="80" y2="110" stroke="currentColor" strokeWidth="1" />
        <line x1="120" y1="60" x2="150" y2="110" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Logo — faded watermark, right side */}
      <div className="pointer-events-none absolute right-0 md:right-16 top-3/5 -translate-y-1/2 opacity-[0.08] dark:opacity-[0.09] select-none">
        <Image
          src="/images/logo-bottom.png"
          alt="ADIGSI Logo"
          width={160}
          height={160}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 mb-2 px-4 py-1.5 bg-accent/5 overflow-hidden">
          {/* Corner brackets — reticle / targeting aesthetic */}
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent/70" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent/70" />
          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-accent/70" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-accent/70" />
          {/* Code comment prefix */}
          <span className="w-px h-3 bg-accent/70 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent font-mono leading-none">
            {badge}
          </span>
          {/* Blinking cursor */}
          <span className="w-px h-3 bg-accent/70 animate-pulse" />
        </div>

        {/* Title */}
        {isLoading ? (
          <div className="h-11 w-44 rounded-lg bg-muted animate-pulse mb-4" />
        ) : (
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            {title}
          </h1>
        )}

        {/* Accent underline */}
        <div className="h-1 w-16 rounded-full bg-linear-to-r from-primary to-accent" />
      </div>
    </section>
  )
}
