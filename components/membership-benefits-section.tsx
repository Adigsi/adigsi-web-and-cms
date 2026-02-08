'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

function MembershipBadge({ tier }: { tier: string }) {
  const colors = {
    bronze: { primary: '#CD7F32', secondary: '#A0522D', glow: 'rgba(205, 127, 50, 0.3)' },
    silver: { primary: '#C0C0C0', secondary: '#A8A8A8', glow: 'rgba(192, 192, 192, 0.3)' },
    gold: { primary: '#FFD700', secondary: '#FFA500', glow: 'rgba(255, 215, 0, 0.3)' },
    platinum: { primary: '#E5E4E2', secondary: '#B9B8B6', glow: 'rgba(229, 228, 226, 0.3)' },
  }

  const color = colors[tier as keyof typeof colors]

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Outer circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={color.primary}
          stroke={color.secondary}
          strokeWidth="2"
        />
        {/* Inner circle */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={color.secondary}
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        {/* Center circle */}
        <circle cx="50" cy="50" r="32" fill={color.secondary} opacity="0.3" />
        
        {/* Circular text path */}
        <defs>
          <path
            id={`circle-${tier}`}
            d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        <text className="text-[6px] font-bold fill-white uppercase tracking-wider">
          <textPath href={`#circle-${tier}`} startOffset="50%" textAnchor="middle">
            MEMBERSHIP • {tier.toUpperCase()} •
          </textPath>
        </text>

        {/* Center icon */}
        <g transform="translate(50, 50)">
          <path
            d="M-8,-12 L8,-12 L10,-8 L10,8 L8,12 L-8,12 L-10,8 L-10,-8 Z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M-6,-10 L6,-10 L8,-7 L8,6 L6,10 L-6,10 L-8,6 L-8,-7 Z"
            fill={color.secondary}
          />
          <circle cx="0" cy="0" r="4" fill="white" />
        </g>
      </svg>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
        style={{ backgroundColor: color.glow }}
      />
    </div>
  )
}

const membershipData = [
  {
    tier: 'bronze',
    name: { en: 'BRONZE MEMBERSHIP', id: 'BRONZE MEMBERSHIP' },
    description: {
      en: 'Bronze Membership provides basic access to ADIGSI information and activities, opportunities to participate in selected public events, limited brand exposure, and flexibility to upgrade membership category anytime as needed.',
      id: 'BRONZE MEMBERSHIP MEMBERIKAN AKSES DASAR KE INFORMASI DAN KEGIATAN ADIGSI, KESEMPATAN MENGIKUTI BEBERAPA EVENT UMUM, EXPOSUR BRAND TERBATAS, SERTA FLEKSIBILITAS UNTUK MENINGKATKAN KATEGORI MEMBERSHIP KAPAN SAJA SESUAI KEBUTUHAN.',
    },
  },
  {
    tier: 'silver',
    name: { en: 'SILVER MEMBERSHIP', id: 'SILVER MEMBERSHIP' },
    description: {
      en: 'Silver Membership offers access to ADIGSI core programs, including logo placement and promotional slots, rights to use ADIGSI logo, custom content when needed, networking opportunities with stakeholders, special incentives, and training support with regulatory analysis to enhance competence and compliance.',
      id: 'SILVER MEMBERSHIP MENAWARKAN AKSES KE PROGRAM INTI ADIGSI, TERMASUK PENEMPATAN LOGO DAN SLOT PROMOSI, HAK PENGGUNAAN LOGO ADIGSI, KONTEN KUSTOM BILA DIPERLUKAN, KESEMPATAN NETWORKING DENGAN PARA PEMANGKU KEPENTINGAN, INSENTIF KHUSUS, SERTA DUKUNGAN PELATIHAN DAN ANALISIS REGULASI UNTUK MENINGKATKAN KOMPETENSI DAN KEPATUHAN.',
    },
  },
  {
    tier: 'gold',
    name: { en: 'GOLD MEMBERSHIP', id: 'GOLD MEMBERSHIP' },
    description: {
      en: 'Gold Membership provides extensive benefits including branding placement, customizable content and programs, access to exclusive networking events, program incentives, certification support and regulatory analysis, exclusive industry updates, advocacy opportunities with regulators, and access to national and international market information to expand business opportunities and collaboration.',
      id: 'GOLD MEMBERSHIP MEMBERIKAN MANFAAT LUAS BERUPA PENEMPATAN BRANDING, KONTEN DAN PROGRAM YANG DAPAT DIKUSTOMISASI, AKSES KE EVENT NETWORKING KHUSUS, INSENTIF PROGRAM, DUKUNGAN SERTIFIKASI DAN ANALISIS REGULASI, PEMBARUAN INDUSTRI EKSKLUSIF, PELUANG ADVOKASI DENGAN REGULATOR, SERTA AKSES INFORMASI PASAR NASIONAL MAUPUN INTERNASIONAL UNTUK MEMPERLUAS PELUANG BISNIS DAN KOLABORASI.',
    },
  },
  {
    tier: 'platinum',
    name: { en: 'PLATINUM MEMBERSHIP', id: 'PLATINUM MEMBERSHIP' },
    description: {
      en: 'Platinum Membership provides priority access to all ADIGSI programs, opportunities to participate in national policy formulation, chances to represent ADIGSI in strategic meetings with government, exclusive networking access, premium branding facilities, certification support and regulatory analysis, industry research updates, and rights to use ADIGSI logo as an official partner.',
      id: 'PLATINUM MEMBERSHIP MEMBERIKAN AKSES PRIORITAS KE SELURUH PROGRAM ADIGSI, PELUANG BERPERAN DALAM PENYUSUNAN KEBIJAKAN NASIONAL, KESEMPATAN MEWAKILI ADIGSI DI PERTEMUAN STRATEGIS DENGAN PEMERINTAH, AKSES NETWORKING EKSKLUSIF, FASILITAS BRANDING PREMIUM, DUKUNGAN SERTIFIKASI DAN ANALISIS REGULASI, PEMBARUAN RISET INDUSTRI, SERTA HAK PENGGUNAAN LOGO ADIGSI SEBAGAI MITRA RESMI.',
    },
  },
]

export function MembershipBenefitsSection() {
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
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-[1240px] mx-auto px-5">
        <div className={`text-center mb-14 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold tracking-wider">
            {t({ en: 'JOIN US', id: 'BERGABUNG' })}
          </h2>
          <h1 className="text-[#29294b] text-2xl md:text-[28px] font-bold">
            {t({ en: 'Membership Category', id: 'Kategori Keanggotaan' })}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {membershipData.map((membership, index) => (
            <div
              key={membership.tier}
              className={`group relative rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-6 items-start">
                <MembershipBadge tier={membership.tier} />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#29294b] font-bold text-lg mb-3 uppercase">
                    {language === 'en' ? membership.name.en : membership.name.id}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed">
                    {language === 'en' ? membership.description.en : membership.description.id}
                  </p>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl opacity-10">
                <div 
                  className="absolute -top-10 -right-10 w-20 h-20 rounded-full"
                  style={{ 
                    backgroundColor: membership.tier === 'bronze' ? '#CD7F32' : 
                                   membership.tier === 'silver' ? '#C0C0C0' : 
                                   membership.tier === 'gold' ? '#FFD700' : '#E5E4E2' 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
