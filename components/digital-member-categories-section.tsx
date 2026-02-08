'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

function DigitalIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    ecommerce: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    logistic: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    financial: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    edutech: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    telecom: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    media: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/>
        <line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/>
        <line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
      </svg>
    ),
    healthcare: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    venture: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        <polyline points="7 4 7 1 17 1 17 4"/>
      </svg>
    ),
    consultant: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    university: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    bumn: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="3" height="9"/>
        <rect x="14" y="7" width="3" height="5"/>
      </svg>
    ),
  }
  return <>{icons[type] || icons.consultant}</>
}

const digitalCategories = [
  { 
    name: { en: 'Ecommerce', id: 'E-commerce' },
    count: 32,
    icon: 'ecommerce'
  },
  { 
    name: { en: 'Logistic', id: 'Logistik' },
    count: 18,
    icon: 'logistic'
  },
  { 
    name: { en: 'Financial Services', id: 'Layanan Keuangan' },
    count: 45,
    icon: 'financial'
  },
  { 
    name: { en: 'Edutech', id: 'Teknologi Pendidikan' },
    count: 21,
    icon: 'edutech'
  },
  { 
    name: { en: 'Telecommunication', id: 'Telekomunikasi' },
    count: 15,
    icon: 'telecom'
  },
  { 
    name: { en: 'Media/Publisher/EO', id: 'Media/Publisher/EO' },
    count: 28,
    icon: 'media'
  },
  { 
    name: { en: 'Healthcare', id: 'Layanan Kesehatan' },
    count: 24,
    icon: 'healthcare'
  },
  { 
    name: { en: 'Venture Capital', id: 'Modal Ventura' },
    count: 12,
    icon: 'venture'
  },
  { 
    name: { en: 'Consultant', id: 'Konsultan' },
    count: 19,
    icon: 'consultant'
  },
  { 
    name: { en: 'University/School', id: 'Universitas/Sekolah' },
    count: 35,
    icon: 'university'
  },
  { 
    name: { en: 'BUMN', id: 'BUMN' },
    count: 16,
    icon: 'bumn'
  },
]

export function DigitalMemberCategoriesSection() {
  const [isVisible, setIsVisible] = useState(false)
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

  return (
    <section ref={sectionRef} className="w-full bg-gradient-to-b from-[#0a0e27] to-[#0f1538] py-20 relative overflow-hidden">
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
      
      <div className="max-w-[1240px] mx-auto px-5 relative z-10">
        <div className={`text-center mb-14 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-[#00c2ff] text-[21px] uppercase mb-2 font-bold tracking-wider">
            {t({ en: 'DIGITAL ECOSYSTEM', id: 'EKOSISTEM DIGITAL' })}
          </h2>
          <h1 className="text-white text-2xl md:text-[28px] font-bold">
            {t({ 
              en: 'ADIGSI Digital Members', 
              id: 'Anggota Digital ADIGSI' 
            })}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {digitalCategories.map((category, index) => (
            <div
              key={index}
              className={`group relative rounded-xl border border-[#1a2255] bg-[#0f1538]/80 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#00c2ff]/60 hover:bg-[#141c4a]/80 hover:-translate-y-1 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Top glow line on hover */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#00c2ff]/0 to-transparent group-hover:via-[#00c2ff] transition-all duration-500" />
              
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-[#00c2ff]/10 border border-[#00c2ff]/20 flex items-center justify-center text-[#00c2ff] group-hover:bg-[#00c2ff]/20 group-hover:border-[#00c2ff]/40 group-hover:text-[#3350e6] transition-all duration-300">
                  <DigitalIcon type={category.icon} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-[15px] leading-tight mb-1 group-hover:text-[#e0e6ff] transition-colors duration-300">
                    {language === 'en' ? category.name.en : category.name.id}
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
                <div className="flex-shrink-0 text-[#2a3560] group-hover:text-[#00c2ff] transition-all duration-300 group-hover:translate-x-1">
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
