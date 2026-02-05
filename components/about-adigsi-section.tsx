'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle } from '@/components/icons/check-circle'

export function AboutAdigsiSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const missions = [
    'Enhancing the capacity of the cybersecurity industry',
    'Strengthening partnerships with government and related institutions',
    'Building awareness and compliance with cybersecurity regulations',
    'Developing a resilient cybersecurity ecosystem',
    'Promoting certification and standardization in cybersecurity',
    'Promoting innovation and entrepreneurship in cybersecurity',
    'Contributing to the protection of national critical infrastructure',
  ]

  const govLogos = [
    { src: '/images/logos/image-16.png', alt: 'Government Logo 1' },
    { src: '/images/logos/image-17.png', alt: 'Government Logo 2' },
    { src: '/images/logos/image-18.png', alt: 'Government Logo 3' },
    { src: '/images/logos/image-19.png', alt: 'Government Logo 4' },
  ]

  const intlLogos = [
    { src: '/images/logos/image-25.png', alt: 'USTDA' },
    { src: '/images/logos/image-26.png', alt: 'Australian Embassy' },
    { src: '/images/logos/image-27.png', alt: 'British Embassy' },
    { src: '/images/logos/image-28.png', alt: 'Cyberus' },
    { src: '/images/logos/image-29.png', alt: 'GASA' },
    { src: '/images/logos/image-30.png', alt: 'US-ASEAN' },
  ]

  const assocLogos = [
    { src: '/images/logos/image-31.png', alt: 'APJII' },
    { src: '/images/logos/image-32.png', alt: 'Fintech Indonesia' },
    { src: '/images/logos/image-33.png', alt: 'APTIKNAS' },
    { src: '/images/logos/image-34.png', alt: 'PANDI' },
  ]

  const companyLogos = [
    { src: '/images/companies/image-6.png', alt: 'Company Logo 6' },
    { src: '/images/companies/image-7.png', alt: 'Company Logo 7' },
    { src: '/images/companies/image-8.png', alt: 'Company Logo 8' },
    { src: '/images/companies/image-9.png', alt: 'Company Logo 9' },
    { src: '/images/companies/image-10.png', alt: 'Company Logo 10' },
    { src: '/images/companies/image-11.png', alt: 'Company Logo 11' },
    { src: '/images/companies/image-12.png', alt: 'Company Logo 12' },
    { src: '/images/companies/image-13.png', alt: 'Company Logo 13' },
  ]

  return (
    <section ref={sectionRef} className="w-full max-w-[1240px] mx-auto px-4 md:px-8 lg:px-[131px] py-20">
      <div className={`p-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="flex-grow min-w-[320px]">
          <h2 className="text-primary text-[19.2px] font-bold text-center mb-4">ABOUT ADIGSI</h2>
          <h1 className="text-[#29294b] text-[28.8px] font-bold text-center mb-4">
            Indonesian Association for Digitalization and Cybersecurity
          </h1>
          
          <p className="text-[#29294b] leading-relaxed mb-6">
            ADIGSI is a national organization established to strengthen and protect Indonesia's digital 
            infrastructure. Amid rapid digital transformation, ADIGSI focuses on enhancing the capacity 
            of the cybersecurity industry through industry player capability development, technology 
            mastery, and cross-sector collaboration, so that the national digital ecosystem can withstand 
            increasingly complex cyber threats.
          </p>

          <div className="mb-8">
            <h3 className="text-[#29294b] text-lg font-semibold mb-2">Vision:</h3>
            <p className="text-[#29294b] leading-relaxed mb-6">
              To become a key pillar in building and strengthening a resilient, innovative, and 
              sustainable cybersecurity ecosystem in Indonesia, protecting national digital sovereignty, 
              and supporting Indonesia's economic growth.
            </p>

            <h3 className="text-[#29294b] text-lg font-semibold mb-2">Mission:</h3>
            <ul className="list-none p-0 m-0 space-y-3">
              {missions.map((mission, index) => (
                <li key={index} className="flex items-center gap-2 text-[#29294b]">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span>{mission}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 md:p-10 space-y-10">
            {/* Government Organizations */}
            <div>
              <h3 className="text-[#29294b] text-lg font-semibold mb-5">
                Partnering with Government Organizations
              </h3>
              <div className="flex flex-wrap gap-6 items-center justify-center md:justify-end">
                {govLogos.map((logo, index) => (
                  <div key={index} className="w-[100px] h-[60px] relative">
                    <Image
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-t border-gray-300" />

            {/* International Institutions */}
            <div>
              <h3 className="text-[#29294b] text-lg font-semibold mb-5">
                Partnering with International Institutions
              </h3>
              <div className="flex flex-wrap gap-6 items-center justify-center md:justify-end">
                {intlLogos.map((logo, index) => (
                  <div key={index} className="w-[100px] h-[60px] relative">
                    <Image
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-t border-gray-300" />

            {/* Associations */}
            <div>
              <h3 className="text-[#29294b] text-lg font-semibold mb-5">
                Partnering with Associations
              </h3>
              <div className="flex flex-wrap gap-6 items-center justify-center md:justify-end">
                {assocLogos.map((logo, index) => (
                  <div key={index} className="w-[100px] h-[60px] relative">
                    <Image
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-t border-gray-300" />

            {/* Companies */}
            <div>
              <h3 className="text-[#29294b] text-lg font-semibold mb-5">
                Partnering with Companies
              </h3>
              <div className="flex flex-wrap gap-6 items-center justify-center md:justify-end">
                {companyLogos.map((logo, index) => (
                  <div key={index} className="w-[125px] h-[60px] relative">
                    <Image
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/about"
            className="bg-[#3350E6] text-white font-semibold px-6 py-4 rounded-[10px] hover:bg-[#2940cc] transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}
