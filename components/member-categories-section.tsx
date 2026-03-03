'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { CyberIcon } from '@/components/ui/cyber-icon'

interface MemberCategory {
  titleEn: string
  titleId: string
  count: number
  icon: string
}

export function MemberCategoriesSection() {
  const [isVisible, setIsVisible] = useState(true)
  const [categories, setCategories] = useState<MemberCategory[]>([])
  const [heading, setHeading] = useState({
    subtitleEn: 'OUR COMMUNITY',
    subtitleId: 'KOMUNITAS KAMI',
    titleEn: 'ADIGSI Cyber Security Members',
    titleId: 'Anggota Cyber Security ADIGSI',
  })
  const sectionRef = useRef<HTMLElement>(null)
  const { language } = useLanguage()

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
    fetch('/api/cms/members/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || [])
        if (data.heading) {
          setHeading({
            subtitleEn: data.heading.subtitleEn || 'OUR COMMUNITY',
            subtitleId: data.heading.subtitleId || 'KOMUNITAS KAMI',
            titleEn: data.heading.titleEn || 'ADIGSI Cyber Security Members',
            titleId: data.heading.titleId || 'Anggota Cyber Security ADIGSI',
          })
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error)
      })
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-white py-20 relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(51,80,230,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(51,80,230,0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Glow effects */}
      <div className="absolute -top-10 left-1/4 w-80 h-80 bg-[#3350e6] rounded-full opacity-[0.08] blur-[120px]" />
      <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-[#00c2ff] rounded-full opacity-[0.06] blur-[120px]" />

      <div className="max-w-310 mx-auto px-5 relative z-10">
        <div className={`text-center mb-14 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-[#3350e6] text-[21px] uppercase mb-2 font-bold tracking-wider">
            {language === 'en' ? heading.subtitleEn : heading.subtitleId}
          </h2>
          <h1 className="text-[#0f172a] text-2xl md:text-[28px] font-bold">
            {language === 'en' ? heading.titleEn : heading.titleId}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`group relative rounded-xl border border-[#d1d5db] bg-white/90 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-[#cbd5e1] hover:bg-white hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Top glow line on hover */}
              <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-[#3350e6]/0 to-transparent group-hover:via-[#3350e6]/60 transition-all duration-500" />

              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="shrink-0 w-14 h-14 rounded-lg bg-[#3350e6]/10 border border-[#3350e6]/25 flex items-center justify-center text-[#3350e6] group-hover:bg-[#3350e6]/15 group-hover:border-[#3350e6]/45 group-hover:text-[#1d4ed8] transition-all duration-300">
                  <CyberIcon type={category.icon} size={28} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-black font-semibold text-[15px] leading-tight mb-1 transition-colors duration-300">
                    {language === 'en' ? category.titleEn : category.titleId}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-black text-xl font-bold transition-colors duration-300">
                      {category.count}
                    </span>
                    <span className="text-black/70 text-sm">
                      {language === 'en' ? 'Members' : 'Anggota'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
