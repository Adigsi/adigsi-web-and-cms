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
    <section className="w-full bg-gradient-to-br from-card via-background to-card border-b border-border">
      {/* Main content with Carousel */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-[700px]">
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
          <div className="hidden lg:block">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
              
              {/* Inline Carousel */}
              <div className="relative z-10">
                <CarousellSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Carousel */}
      <div className="lg:hidden">
        <CarousellSection />
      </div>
    </section>
  )
}
