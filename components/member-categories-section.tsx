'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

function CyberIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    network: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/>
        <line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/>
      </svg>
    ),
    web: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    endpoint: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    app: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    mssp: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    data: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    mobile: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    risk: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    secops: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    threat: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
    identity: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    digitalrisk: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    blockchain: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="8" height="8" rx="1"/><rect x="15" y="4" width="8" height="8" rx="1"/>
        <rect x="8" y="12" width="8" height="8" rx="1"/><line x1="9" y1="8" x2="15" y2="8"/>
        <line x1="12" y1="12" x2="12" y2="8"/>
      </svg>
    ),
    iot: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.12 19a7 7 0 0 1 0-14"/><path d="M18.88 5a7 7 0 0 1 0 14"/>
        <circle cx="12" cy="12" r="3"/><path d="M2 12h3"/><path d="M19 12h3"/>
      </svg>
    ),
    messaging: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    consulting: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <line x1="9" y1="10" x2="15" y2="10"/>
      </svg>
    ),
    fraud: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    cloud: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        <path d="M12 12v4"/><path d="M12 8v.01"/>
      </svg>
    ),
  }
  return <>{icons[type] || icons.mssp}</>
}

const memberCategories = [
  { 
    name: { en: 'Network & Infrastructure Security', id: 'Keamanan Jaringan & Infrastruktur' },
    count: 25,
    icon: 'network'
  },
  { 
    name: { en: 'Web Security', id: 'Keamanan Web' },
    count: 18,
    icon: 'web'
  },
  { 
    name: { en: 'End Point Security', id: 'Keamanan End Point' },
    count: 22,
    icon: 'endpoint'
  },
  { 
    name: { en: 'Application Security', id: 'Keamanan Aplikasi' },
    count: 20,
    icon: 'app'
  },
  { 
    name: { en: 'MSSP', id: 'MSSP' },
    count: 15,
    icon: 'mssp'
  },
  { 
    name: { en: 'Data Security', id: 'Keamanan Data' },
    count: 28,
    icon: 'data'
  },
  { 
    name: { en: 'Mobile Security', id: 'Keamanan Mobile' },
    count: 16,
    icon: 'mobile'
  },
  { 
    name: { en: 'Risk & Compliance', id: 'Risiko & Kepatuhan' },
    count: 12,
    icon: 'risk'
  },
  { 
    name: { en: 'Security Ops & Incident Response', id: 'Operasi Keamanan & Respon Insiden' },
    count: 19,
    icon: 'secops'
  },
  { 
    name: { en: 'Threat Intelligence', id: 'Intelijen Ancaman' },
    count: 14,
    icon: 'threat'
  },
  { 
    name: { en: 'Identity & Access Management', id: 'Manajemen Identitas & Akses' },
    count: 17,
    icon: 'identity'
  },
  { 
    name: { en: 'Digital Risk Management', id: 'Manajemen Risiko Digital' },
    count: 13,
    icon: 'digitalrisk'
  },
  { 
    name: { en: 'Blockchain', id: 'Blockchain' },
    count: 10,
    icon: 'blockchain'
  },
  { 
    name: { en: 'IoT', id: 'IoT' },
    count: 11,
    icon: 'iot'
  },
  { 
    name: { en: 'Messaging Security', id: 'Keamanan Pesan' },
    count: 9,
    icon: 'messaging'
  },
  { 
    name: { en: 'Security Consulting & Service', id: 'Konsultasi & Layanan Keamanan' },
    count: 21,
    icon: 'consulting'
  },
  { 
    name: { en: 'Fraud & Transaction Security', id: 'Keamanan Transaksi & Anti-Fraud' },
    count: 16,
    icon: 'fraud'
  },
  { 
    name: { en: 'Cloud Security', id: 'Keamanan Cloud' },
    count: 24,
    icon: 'cloud'
  },
]

export function MemberCategoriesSection() {
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
    <section ref={sectionRef} className="w-full bg-[#0a0e27] py-20 relative overflow-hidden">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(51,80,230,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(51,80,230,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3350e6] rounded-full opacity-[0.06] blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00c2ff] rounded-full opacity-[0.05] blur-[120px]" />
      
      <div className="max-w-[1240px] mx-auto px-5 relative z-10">
        <div className={`text-center mb-14 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-[#00c2ff] text-[21px] uppercase mb-2 font-bold tracking-wider">
            {t({ en: 'OUR COMMUNITY', id: 'KOMUNITAS KAMI' })}
          </h2>
          <h1 className="text-white text-2xl md:text-[28px] font-bold">
            {t({ 
              en: 'ADIGSI Cyber Security Members', 
              id: 'Anggota Keamanan Siber ADIGSI' 
            })}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {memberCategories.map((category, index) => (
            <div
              key={index}
              className={`group relative rounded-xl border border-[#1a2255] bg-[#0f1538]/80 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#3350e6]/60 hover:bg-[#141c4a]/80 hover:-translate-y-1 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Top glow line on hover */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#3350e6]/0 to-transparent group-hover:via-[#3350e6] transition-all duration-500" />
              
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-[#3350e6]/10 border border-[#3350e6]/20 flex items-center justify-center text-[#3350e6] group-hover:bg-[#3350e6]/20 group-hover:border-[#3350e6]/40 group-hover:text-[#00c2ff] transition-all duration-300">
                  <CyberIcon type={category.icon} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-[15px] leading-tight mb-1 group-hover:text-[#e0e6ff] transition-colors duration-300">
                    {language === 'en' ? category.name.en : category.name.id}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3350e6] text-xl font-bold group-hover:text-[#00c2ff] transition-colors duration-300">
                      {category.count}
                    </span>
                    <span className="text-[#5a6380] text-sm">
                      {t({ en: 'Members', id: 'Anggota' })}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 text-[#2a3560] group-hover:text-[#3350e6] transition-all duration-300 group-hover:translate-x-1">
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
