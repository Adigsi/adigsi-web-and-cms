'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'

interface BannerData {
  titleEn: string
  titleId: string
  imageUrl: string
}

export function RegisterBanner() {
  const { language } = useLanguage()
  const [bannerData, setBannerData] = useState<BannerData>({
    titleEn: 'REGISTER',
    titleId: 'DAFTAR',
    imageUrl: '/images/about-banner.png',
  })

  useEffect(() => {
    fetch('/api/cms/register/banner')
      .then((res) => res.json())
      .then((data) =>
        setBannerData({
          titleEn: data.titleEn || 'REGISTER',
          titleId: data.titleId || 'DAFTAR',
          imageUrl: data.imageUrl || '/images/about-banner.png',
        })
      )
      .catch(() => {
        // Keep defaults on error
      })
  }, [])

  return (
    <section className="relative w-full h-[620px] flex items-center justify-center overflow-hidden">
      <Image
        alt={language === 'en' ? bannerData.titleEn : bannerData.titleId}
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
      <h1 className="relative z-20 text-5xl md:text-[48px] font-bold text-white uppercase">
        {language === 'en' ? bannerData.titleEn : bannerData.titleId}
      </h1>
    </section>
  )
}
