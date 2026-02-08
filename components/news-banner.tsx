'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'

export function NewsBanner() {
  const { t } = useLanguage()
  
  return (
    <section className="relative w-full h-[620px] flex items-center justify-center overflow-hidden">
      <Image
        alt={t({ en: 'Latest News', id: 'Berita Terbaru' })}
        src="/images/about-banner.jpg"
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
        {t({ en: 'Latest News', id: 'Berita Terbaru' })}
      </h1>
    </section>
  )
}
