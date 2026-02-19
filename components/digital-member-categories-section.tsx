'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { CyberIcon } from '@/components/ui/cyber-icon'

interface DigitalCategory {
  nameEn: string
  nameId: string
  count: number
  icon: string
}

interface HeadingData {
  subtitleEn: string
  subtitleId: string
  titleEn: string
  titleId: string
}

export function DigitalMemberCategoriesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [categories, setCategories] = useState<DigitalCategory[]>([])
  const [heading, setHeading] = useState<HeadingData>({
    subtitleEn: 'DIGITAL ECOSYSTEM',
    subtitleId: 'EKOSISTEM DIGITAL',
    titleEn: 'ADIGSI Digital Members',
    titleId: 'Anggota Digital ADIGSI',
  })
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    fetch('/api/cms/members/digital-categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || [])
        if (data.heading) {
          setHeading({
            subtitleEn: data.heading.subtitleEn || 'DIGITAL ECOSYSTEM',
            subtitleId: data.heading.subtitleId || 'EKOSISTEM DIGITAL',
            titleEn: data.heading.titleEn || 'ADIGSI Digital Members',
            titleId: data.heading.titleId || 'Anggota Digital ADIGSI',
          })
        }
      })
      .catch((error) => {
        console.error('Error fetching digital categories:', error)
      })
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-linear-to-b from-[#0a0e27] to-[#0f1538] py-20 relative overflow-hidden">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,194,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#00c2ff] rounded-full opacity-[0.04] blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#3350e6] rounded-full opacity-[0.04] blur-[120px]" />
      
      <div className="max-w-310 mx-auto px-5 relative z-10">
        <div className={`text-center mb-14 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-[#00c2ff] text-[21px] uppercase mb-2 font-bold tracking-wider">
            {language === 'en' ? heading.subtitleEn : heading.subtitleId}
          </h2>
          <h1 className="text-white text-2xl md:text-[28px] font-bold">
            {language === 'en' ? heading.titleEn : heading.titleId}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`group relative rounded-xl border border-[#1a2255] bg-[#0f1538]/80 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#00c2ff]/60 hover:bg-[#141c4a]/80 hover:-translate-y-1 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Top glow line on hover */}
              <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-[#00c2ff]/0 to-transparent group-hover:via-[#00c2ff] transition-all duration-500" />
              
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="shrink-0 w-14 h-14 rounded-lg bg-[#00c2ff]/10 border border-[#00c2ff]/20 flex items-center justify-center text-[#00c2ff] group-hover:bg-[#00c2ff]/20 group-hover:border-[#00c2ff]/40 group-hover:text-[#3350e6] transition-all duration-300">
                  <CyberIcon type={category.icon} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-[15px] leading-tight mb-1 group-hover:text-[#e0e6ff] transition-colors duration-300">
                    {language === 'en' ? category.nameEn : category.nameId}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00c2ff] text-xl font-bold group-hover:text-[#3350e6] transition-colors duration-300">
                      {category.count}
                    </span>
                    <span className="text-[#5a6380] text-sm">
                      {t({ en: 'Members', id: 'Anggota' })}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 text-[#2a3560] group-hover:text-[#00c2ff] transition-all duration-300 group-hover:translate-x-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
