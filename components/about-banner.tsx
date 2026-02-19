'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'

export function AboutBanner() {
  const { t, language } = useLanguage()
  const [bannerData, setBannerData] = useState({
    titleEn: 'About Us',
    titleId: 'Tentang Kami',
    imageUrl: '/images/about-banner.png',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch('/api/cms/about/banner')
        if (response.ok) {
          const data = await response.json()
          if (data.titleEn && data.titleId) {
            setBannerData({
              titleEn: data.titleEn,
              titleId: data.titleId,
              imageUrl: data.imageUrl || '/images/about-banner.png',
            })
          }
        }
      } catch (error) {
        console.error('Error fetching banner data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBannerData()
  }, [])

  const title = language === 'en' ? bannerData.titleEn : bannerData.titleId

  return (
    <section className="relative w-full h-[620px] flex items-center justify-center overflow-hidden">
      <Image
        alt={title}
        src={bannerData.imageUrl}
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
      {isLoading ? (
        <div className="relative z-20 text-5xl md:text-[48px] font-bold text-white animate-pulse">
          {t({ en: 'Loading...', id: 'Memuat...' })}
        </div>
      ) : (
        <h1 className="relative z-20 text-5xl md:text-[48px] font-bold text-white">
          {title}
        </h1>
      )}
    </section>
  )
}
