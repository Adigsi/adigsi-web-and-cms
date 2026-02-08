'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'

function MembershipBadge({ tier }: { tier: string }) {
  // Using a sprite approach - the full badge image is displayed with CSS to show specific badge
  // Positioning offsets for each badge from the sprite image
  const badgePositions: Record<string, { objectPosition: string }> = {
    platinum: { objectPosition: '0% 50%' },      // leftmost badge
    gold: { objectPosition: '33.33% 50%' },      // second from left
    silver: { objectPosition: '66.66% 50%' },    // third from left
    bronze: { objectPosition: '100% 50%' },      // rightmost badge
  }

  const position = badgePositions[tier] || badgePositions.platinum

  return (
    <div className="relative w-28 h-28 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src="/images/membership-badges.png"
          alt={`${tier} membership badge`}
          fill
          className="object-cover scale-[4]"
          style={{ objectPosition: position.objectPosition }}
        />
      </div>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
        style={{ 
          backgroundColor: tier === 'bronze' ? 'rgba(205, 127, 50, 0.4)' : 
                         tier === 'silver' ? 'rgba(192, 192, 192, 0.4)' : 
                         tier === 'gold' ? 'rgba(255, 215, 0, 0.4)' : 'rgba(229, 228, 226, 0.4)' 
        }}
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
