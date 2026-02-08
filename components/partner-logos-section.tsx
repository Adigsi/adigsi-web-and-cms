'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'

const partnerLogos = {
  platinum: [
    { name: 'Partner 1', logo: '/placeholder.svg?height=120&width=200' },
    { name: 'Partner 2', logo: '/placeholder.svg?height=120&width=200' },
    { name: 'Partner 3', logo: '/placeholder.svg?height=120&width=200' },
  ],
  gold: [
    { name: 'Partner 4', logo: '/placeholder.svg?height=100&width=180' },
    { name: 'Partner 5', logo: '/placeholder.svg?height=100&width=180' },
    { name: 'Partner 6', logo: '/placeholder.svg?height=100&width=180' },
    { name: 'Partner 7', logo: '/placeholder.svg?height=100&width=180' },
    { name: 'Partner 8', logo: '/placeholder.svg?height=100&width=180' },
  ],
  silver: [
    { name: 'Partner 9', logo: '/placeholder.svg?height=80&width=150' },
    { name: 'Partner 10', logo: '/placeholder.svg?height=80&width=150' },
    { name: 'Partner 11', logo: '/placeholder.svg?height=80&width=150' },
    { name: 'Partner 12', logo: '/placeholder.svg?height=80&width=150' },
    { name: 'Partner 13', logo: '/placeholder.svg?height=80&width=150' },
    { name: 'Partner 14', logo: '/placeholder.svg?height=80&width=150' },
    { name: 'Partner 15', logo: '/placeholder.svg?height=80&width=150' },
  ],
  bronze: [
    { name: 'Partner 16', logo: '/placeholder.svg?height=60&width=120' },
    { name: 'Partner 17', logo: '/placeholder.svg?height=60&width=120' },
    { name: 'Partner 18', logo: '/placeholder.svg?height=60&width=120' },
    { name: 'Partner 19', logo: '/placeholder.svg?height=60&width=120' },
    { name: 'Partner 20', logo: '/placeholder.svg?height=60&width=120' },
    { name: 'Partner 21', logo: '/placeholder.svg?height=60&width=120' },
    { name: 'Partner 22', logo: '/placeholder.svg?height=60&width=120' },
    { name: 'Partner 23', logo: '/placeholder.svg?height=60&width=120' },
    { name: 'Partner 24', logo: '/placeholder.svg?height=60&width=120' },
  ],
}

export function PartnerLogosSection() {
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
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-[1240px] mx-auto px-5">
        <div className={`text-center mb-14 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold tracking-wider">
            {t({ en: 'OUR PARTNERS', id: 'MITRA KAMI' })}
          </h2>
          <h1 className="text-[#29294b] text-2xl md:text-[28px] font-bold">
            {t({ 
              en: 'ADIGSI Members', 
              id: 'Anggota ADIGSI' 
            })}
          </h1>
        </div>

        {/* Platinum Members - Largest logos */}
        <div className={`mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partnerLogos.platinum.map((partner, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-[#3350e6]/40 hover:shadow-lg transition-all duration-300"
                style={{ width: '220px', height: '140px' }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Members - Medium-large logos */}
        <div className={`mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {partnerLogos.gold.map((partner, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-lg p-5 hover:border-[#3350e6]/40 hover:shadow-lg transition-all duration-300"
                style={{ width: '190px', height: '115px' }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Silver Members - Medium-small logos */}
        <div className={`mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
          <div className="flex flex-wrap justify-center items-center gap-5">
            {partnerLogos.silver.map((partner, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-[#3350e6]/40 hover:shadow-md transition-all duration-300"
                style={{ width: '160px', height: '95px' }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-1 grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bronze Members - Smallest logos */}
        <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {partnerLogos.bronze.map((partner, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-lg p-3 hover:border-[#3350e6]/40 hover:shadow-md transition-all duration-300"
                style={{ width: '130px', height: '75px' }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-1 grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
