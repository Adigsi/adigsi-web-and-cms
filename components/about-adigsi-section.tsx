'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle } from '@/components/icons/check-circle'
import { useLanguage } from '@/contexts/language-context'

interface AboutData {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  visionEn: string
  visionId: string
  missions: Array<{ en: string; id: string }>
}

interface Logo {
  alt: string
  imageUrl: string
}

interface Category {
  titleEn: string
  titleId: string
  logos: Logo[]
}

export function AboutAdigsiSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [partnersData, setPartnersData] = useState<{ categories: Category[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, partnersRes] = await Promise.all([
          fetch('/api/cms/about/about'),
          fetch('/api/cms/about/partners')
        ])

        if (aboutRes.ok) {
          const data = await aboutRes.json()
          setAboutData({
            titleEn: data.titleEn || 'Indonesian Association for Digitalization and Cybersecurity',
            titleId: data.titleId || 'Asosiasi Indonesia untuk Digitalisasi dan Keamanan Siber',
            descriptionEn: data.descriptionEn || '',
            descriptionId: data.descriptionId || '',
            visionEn: data.visionEn || '',
            visionId: data.visionId || '',
            missions: (data.missions && data.missions.length > 0) ? data.missions : [{ en: '', id: '' }]
          })
        }

        if (partnersRes.ok) {
          const data = await partnersRes.json()
          setPartnersData(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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

  if (isLoading) {
    return (
      <section ref={sectionRef} className="w-full max-w-310 mx-auto px-4 md:px-8 lg:px-32.75 py-20">
        <div className="text-center py-8 text-[#29294b]">
          {t({ en: 'Loading...', id: 'Memuat...' })}
        </div>
      </section>
    )
  }

  if (!aboutData) {
    return null
  }

  const title = language === 'en' ? aboutData.titleEn : aboutData.titleId
  const description = language === 'en' ? aboutData.descriptionEn : aboutData.descriptionId
  const vision = language === 'en' ? aboutData.visionEn : aboutData.visionId
  const missions = aboutData.missions.map(m => language === 'en' ? m.en : m.id).filter(m => m.length > 0)

  return (
    <section ref={sectionRef} className="w-full max-w-310uto px-4 md:px-8 lg:px-32.75 py-20">
      <div className={`p-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="grow min-w-[320px]">
          <h2 className="text-primary text-[19.2px] font-bold text-center mb-4">ABOUT ADIGSI</h2>
          <h1 className="text-[#29294b] text-[28.8px] font-bold text-center mb-4">
            {title}
          </h1>
          
          <p className="text-[#29294b] leading-relaxed mb-6">
            {description}
          </p>

          <div className="mb-8">
            <h3 className="text-[#29294b] text-lg font-semibold mb-2">Vision:</h3>
            <p className="text-[#29294b] leading-relaxed mb-6">
              {vision}
            </p>

            <h3 className="text-[#29294b] text-lg font-semibold mb-2">Mission:</h3>
            <ul className="list-none p-0 m-0 space-y-3">
              {missions.map((mission, index) => (
                <li key={index} className="flex items-center gap-2 text-[#29294b]">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                  <span>{mission}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 md:p-10 space-y-10">
            {partnersData?.categories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-[#29294b] text-lg font-semibold mb-5">
                  {language === 'en' ? category.titleEn : category.titleId}
                </h3>
                <div className="flex flex-wrap gap-6 items-center justify-center md:justify-end">
                  {category.logos && category.logos.length > 0 ? (
                    category.logos.map((logo, logoIndex) => (
                      <div key={logoIndex} className="h-25 max-w-37.5 relative">
                        <Image
                          src={logo.imageUrl || "/placeholder.svg"}
                          alt={logo.alt}
                          height={100}
                          width={200}
                          className="object-contain h-full w-auto"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">{t({ en: 'No logos added yet', id: 'Belum ada logo' })}</p>
                  )}
                </div>
                {categoryIndex < (partnersData?.categories.length ?? 0) - 1 && (
                  <hr className="border-t border-gray-300 mt-10" />
                )}
              </div>
            ))}
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
