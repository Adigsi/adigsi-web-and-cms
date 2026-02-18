'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface BannerData {
  titleEn: string
  titleId: string
  imageUrl: string
}

export function NewsBanner() {
  const { t, language } = useLanguage()
  const [bannerData, setBannerData] = useState<BannerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch('/api/cms/news/banner')
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
    return (
      <section className="relative w-full h-155 flex items-center justify-center overflow-hidden bg-muted">
        <div className="text-muted-foreground">{t({ en: 'Loading...', id: 'Memuat...' })}</div>
      </section>
    )
  }

  const title = language === 'en' ? bannerData.titleEn : bannerData.titleId
  
  return (
    <section className="relative w-full h-155 flex items-center justify-center overflow-hidden">
      <Image
        alt={title}
        src={bannerData.imageUrl || "/placeholder.svg"}
        fill
        className="object-cover"
        priority
      />
      <div 
        className="absolute w-full h-full top-0 left-0 opacity-40 z-10"
        style={{
          backgroundImage: 'linear-gradient(rgb(51, 80, 230) 0%, rgb(0, 0, 0) 70%)',
        }}
      />
      <h1 className="relative z-20 text-5xl md:text-[48px] font-bold text-white">
        {title}
      </h1>
    </section>
  )
}
