'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

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
    <div
      className="relative flex items-center justify-center min-h-[1110px] w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("${bannerData.backgroundImage}")`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      
      <section className="relative z-10 max-w-[1240px] px-4 md:px-8 lg:px-[131px] py-20">
        <div className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-12">
          <h1 className="text-[#FFB703] uppercase text-xl md:text-2xl font-semibold mb-4">
            {language === 'en' ? bannerData.titleSmallEn : bannerData.titleSmallId}
          </h1>
          
          <h2 className="text-5xl md:text-7xl lg:text-[88px] text-white font-bold mb-4 leading-tight">
            {language === 'en' ? bannerData.titleLargeEn : bannerData.titleLargeId}
          </h2>
          
          <p className="text-white text-base md:text-lg leading-[27px] max-w-[75%] mx-auto mb-8">
            {language === 'en' ? bannerData.descriptionEn : bannerData.descriptionId}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 items-center mt-8">
            <Link
              href={bannerData.aboutButtonLink}
              className="bg-[#3350E6] border border-[#29294b] rounded-[10px] px-6 py-4 no-underline transition-all hover:bg-[#2a40c0]"
            >
              <span className="font-semibold text-white">
                {language === 'en' ? bannerData.aboutButtonTextEn : bannerData.aboutButtonTextId}
              </span>
            </Link>
            
            <Link
              href={bannerData.joinButtonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#3350E6] rounded-[10px] px-6 py-4 no-underline transition-all hover:bg-[#3350E6]/10"
            >
              <span className="font-semibold text-white">
                {language === 'en' ? bannerData.joinButtonTextEn : bannerData.joinButtonTextId}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
