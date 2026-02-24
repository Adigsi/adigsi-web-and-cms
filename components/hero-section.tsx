'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { CarousellSection } from './carousell-section'

interface HeroBannerData {
  titleSmallEn: string
  titleSmallId: string
  titleLargeEn: string
  titleLargeId: string
  descriptionEn: string
  descriptionId: string
  backgroundImage: string
  aboutButtonTextEn: string
  aboutButtonTextId: string
  aboutButtonLink: string
  joinButtonTextEn: string
  joinButtonTextId: string
  joinButtonLink: string
}

export function HeroSection() {
  const { t, language } = useLanguage()
  const [bannerData, setBannerData] = useState<HeroBannerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch('/api/cms/home/banner')
        if (response.ok) {
          const data = await response.json()
          setBannerData(data)
        }
      } catch (error) {
        console.error('Error fetching banner data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBannerData()
  }, [])

  if (isLoading || !bannerData) {
    return null
  }

  return (
    <section className="w-full bg-gradient-to-br from-card via-background to-card border-b border-border relative overflow-hidden">
      {/* Cybersecurity Theme - Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left - Primary security accent */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-40 -left-40 w-80 h-80 border-2 border-primary/15 rounded-full" />
        
        {/* Top right - Accent cyan tech accent (cybersecurity color) */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/6 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-40 w-72 h-72 border border-accent/20 rounded-full" />
        
        {/* Middle - Tech vertical lines (circuit board aesthetic) */}
        <div className="absolute top-1/4 right-0 w-px h-64 bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
        <div className="absolute top-1/3 right-20 w-px h-40 bg-gradient-to-b from-accent/20 via-accent/10 to-transparent" />
        
        {/* Digital grid pattern - enhanced for tech feel */}
        <svg className="absolute inset-0 w-full h-full opacity-4" preserveAspectRatio="none">
          <defs>
            <pattern id="cybergrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="0" cy="0" r="1.5" fill="currentColor" opacity="0.4"/>
              <circle cx="80" cy="80" r="1.5" fill="currentColor" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cyborgrid)" />
        </svg>
        
        {/* Subtle circuit board nodes - tech aesthetic */}
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-accent rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-primary rounded-full opacity-15" />
        <div className="hidden lg:block absolute top-2/3 right-1/4 w-2 h-2 bg-accent rounded-full opacity-20" />
        
        {/* Bottom left - Security defense accent */}
        <div className="absolute bottom-0 -left-32 w-72 h-72 bg-accent/7 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-12 w-96 h-96 border border-accent/10 rounded-full" />
        
        {/* Bottom right accent - subtle shield shape suggestion */}
        <div className="hidden lg:block absolute bottom-12 right-12 w-32 h-40 border border-primary/10 rounded-lg transform -rotate-45 opacity-30" />
        
        {/* Horizontal security line - bottom accent */}
        <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </div>

      {/* Main content with Carousel */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 md:gap-6 lg:gap-16 items-center min-h-auto md:min-h-[500px] lg:min-h-[520px]">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-primary text-sm md:text-base font-bold uppercase tracking-widest mb-2">
                {language === 'en' ? bannerData.titleSmallEn : bannerData.titleSmallId}
              </h3>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
                {language === 'en' ? bannerData.titleLargeEn : bannerData.titleLargeId}
              </h1>
            </div>
            
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
              {language === 'en' ? bannerData.descriptionEn : bannerData.descriptionId}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={bannerData.aboutButtonLink}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-6 py-3 font-semibold no-underline hover:opacity-90 hover:shadow-lg transition-all duration-200 group"
              >
                <span>{language === 'en' ? bannerData.aboutButtonTextEn : bannerData.aboutButtonTextId}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href={bannerData.joinButtonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary rounded-lg px-6 py-3 font-semibold no-underline hover:bg-primary hover:text-primary-foreground transition-all duration-200 group"
              >
                <span>{language === 'en' ? bannerData.joinButtonTextEn : bannerData.joinButtonTextId}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="hidden lg:flex">
            <div className="relative w-full">
              {/* Decorative elements - larger */}
              <div className="absolute -top-8 -right-8 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
              
              {/* Inline Carousel */}
              <div className="relative z-10">
                <CarousellSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Carousel */}
      <div className="lg:hidden px-4 md:px-8 pb-4 md:pb-6">
        <div className="relative">
          <div className="absolute -top-4 -right-4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <CarousellSection />
          </div>
        </div>
      </div>
    </section>
  )
}
