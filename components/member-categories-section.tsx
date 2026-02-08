'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

const memberCategories = [
  { 
    name: { en: 'Network & Infrastructure Security', id: 'Keamanan Jaringan & Infrastruktur' },
    count: 25 
  },
  { 
    name: { en: 'Web Security', id: 'Keamanan Web' },
    count: 18 
  },
  { 
    name: { en: 'End Point Security', id: 'Keamanan End Point' },
    count: 22 
  },
  { 
    name: { en: 'Application Security', id: 'Keamanan Aplikasi' },
    count: 20 
  },
  { 
    name: { en: 'MSSP', id: 'MSSP' },
    count: 15 
  },
  { 
    name: { en: 'Data Security', id: 'Keamanan Data' },
    count: 28 
  },
  { 
    name: { en: 'Mobile Security', id: 'Keamanan Mobile' },
    count: 16 
  },
  { 
    name: { en: 'Risk & Compliance', id: 'Risiko & Kepatuhan' },
    count: 12 
  },
  { 
    name: { en: 'Security Ops & Incident Response', id: 'Operasi Keamanan & Respon Insiden' },
    count: 19 
  },
  { 
    name: { en: 'Threat Intelligence', id: 'Intelijen Ancaman' },
    count: 14 
  },
  { 
    name: { en: 'Identity & Access Management', id: 'Manajemen Identitas & Akses' },
    count: 17 
  },
  { 
    name: { en: 'Digital Risk Management', id: 'Manajemen Risiko Digital' },
    count: 13 
  },
  { 
    name: { en: 'Blockchain', id: 'Blockchain' },
    count: 10 
  },
  { 
    name: { en: 'IoT', id: 'IoT' },
    count: 11 
  },
  { 
    name: { en: 'Messaging Security', id: 'Keamanan Pesan' },
    count: 9 
  },
  { 
    name: { en: 'Security Consulting & Service', id: 'Konsultasi & Layanan Keamanan' },
    count: 21 
  },
  { 
    name: { en: 'Fraud & Transaction Security', id: 'Keamanan Transaksi & Anti-Fraud' },
    count: 16 
  },
  { 
    name: { en: 'Cloud Security', id: 'Keamanan Cloud' },
    count: 24 
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
    <section ref={sectionRef} className="w-full bg-[#f5f6f7] py-20">
      <div className="max-w-[1240px] mx-auto px-5">
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
            {t({ en: 'OUR COMMUNITY', id: 'KOMUNITAS KAMI' })}
          </h2>
          <h1 className="text-[#29294b] text-2xl md:text-[28px] font-bold">
            {t({ 
              en: 'ADIGSI Cyber Security Members', 
              id: 'Anggota Keamanan Siber ADIGSI' 
            })}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {memberCategories.map((category, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center text-center ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#3350e6] to-[#5571f5] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">{category.count}</span>
              </div>
              <h3 className="text-[#29294b] font-semibold text-base leading-tight">
                {language === 'en' ? category.name.en : category.name.id}
              </h3>
              <p className="text-[#666] text-sm mt-2">
                {t({ en: 'Members', id: 'Anggota' })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
