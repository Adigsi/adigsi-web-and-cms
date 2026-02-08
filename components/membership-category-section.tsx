'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'

export function MembershipCategorySection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

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
    <section ref={sectionRef} className="w-full py-20 max-w-[1240px] mx-auto px-5">
      <div className={`flex flex-col items-center justify-center text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
          {t({ en: 'CATEGORY', id: 'KATEGORI' })}
        </h2>
        <h1 className="text-[#29294b] text-[28px] font-bold mb-2">
          {t({ en: 'Membership Category', id: 'Kategori Keanggotaan' })}
        </h1>
        <p className="text-[#29294b] text-base leading-6 max-w-[744px] mt-2">
          {t({
            en: 'We offer several membership categories designed to accommodate the diverse backgrounds and needs of stakeholders in the digital ecosystem. Each category offers specific benefits aimed at strengthening collaboration and mutual growth.',
            id: 'Kami menawarkan beberapa kategori keanggotaan yang dirancang untuk mengakomodasi latar belakang dan kebutuhan berbagai pemangku kepentingan dalam ekosistem digital. Setiap kategori menawarkan manfaat khusus yang bertujuan untuk memperkuat kolaborasi dan pertumbuhan bersama.'
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className={`flex flex-col items-center text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
          <div className="bg-[#333333] rounded-full p-8 mb-6 flex items-center justify-center">
            <Image
              src="/images/icon/icon1.png"
              alt="Cybersecurity Industry Member"
              width={100}
              height={100}
              className="w-[100px] h-[100px]"
            />
          </div>
          <h3 className="text-[#29294b] text-xl font-semibold mb-2">
            {t({ en: 'Cybersecurity Industry Member', id: 'Anggota Industri Keamanan Siber' })}
          </h3>
          <p className="text-[#29294b] text-[15px] leading-[21px]">
            {t({
              en: 'This category is for companies, organizations, and institutions that specialize in cybersecurity. Members in this group are actively involved in providing cybersecurity solutions, services, or technologies, and they play a critical role in strengthening national cybersecurity.',
              id: 'Kategori ini untuk perusahaan, organisasi, dan institusi yang bergerak di bidang keamanan siber. Anggota dalam kelompok ini terlibat aktif dalam menyediakan solusi, layanan, atau teknologi keamanan siber, dan mereka berperan penting dalam memperkuat keamanan siber nasional.'
            })}
          </p>
        </div>

        <div className={`flex flex-col items-center text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="bg-[#333333] rounded-full p-8 mb-6 flex items-center justify-center">
            <Image
              src="/images/icon/icon2.png"
              alt="Digital Ecosystem Member"
              width={100}
              height={100}
              className="w-[100px] h-[100px]"
            />
          </div>
          <h3 className="text-[#29294b] text-xl font-semibold mb-2">
            {t({ en: 'Digital Ecosystem Member', id: 'Anggota Ekosistem Digital' })}
          </h3>
          <p className="text-[#29294b] text-[15px] leading-[21px]">
            {t({
              en: 'This category is for companies, organizations, institutions and individuals within the broader digital ecosystem. It includes sectors such as ICT, e-commerce, fintech, edtech, healthcare, digital media & entertainment, energy, digital logistics & transportation, smart cities, IoT, cloud services, blockchain, and e-government.',
              id: 'Kategori ini untuk perusahaan, organisasi, institusi dan individu dalam ekosistem digital yang lebih luas. Ini mencakup sektor seperti TIK, e-commerce, fintech, edtech, kesehatan, media digital & hiburan, energi, logistik & transportasi digital, kota pintar, IoT, layanan cloud, blockchain, dan e-government.'
            })}
          </p>
        </div>
      </div>
    </section>
  )
}
