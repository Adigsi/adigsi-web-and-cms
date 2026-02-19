'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface Testimonial {
  quoteEn: string
  quoteId: string
  name: string
  positionEn: string
  positionId: string
  image: string
}

interface WelcomeData {
  titleSmallEn: string
  titleSmallId: string
  titleLargeEn: string
  titleLargeId: string
  testimonials: Testimonial[]
}

export function WelcomeSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [welcomeData, setWelcomeData] = useState<WelcomeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    const fetchWelcomeData = async () => {
      try {
        console.log('🔄 Fetching welcome data...')
        const response = await fetch('/api/cms/home/welcome')
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Fetched welcome data:', data)
          console.log('📊 Number of testimonials:', data.testimonials?.length)
          setWelcomeData(data)
          setIsLoading(false)
        } else {
          console.error('❌ Failed to fetch welcome data:', response.status)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('❌ Error fetching welcome data:', error)
        setIsLoading(false)
      }
    }

    fetchWelcomeData()
  }, [])

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-32 py-20 w-full">
        <div className="text-center text-gray-500">Loading...</div>
      </section>
    )
  }
  
  if (!welcomeData) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-32 py-20 w-full">
        <div className="text-center text-gray-500">No data available</div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 md:px-8 lg:px-32 py-20 w-full">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
          {language === 'en' ? welcomeData.titleSmallEn : welcomeData.titleSmallId}
        </h2>
        <h1 className="text-[#29294b] text-2xl md:text-[28px] font-bold">
          {language === 'en' ? welcomeData.titleLargeEn : welcomeData.titleLargeId}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
        {welcomeData.testimonials && welcomeData.testimonials.length > 0 ? (
          welcomeData.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white shadow-sm max-w-xl w-full flex flex-col justify-between border border-gray-200 rounded-2xl p-6 hover:shadow-md"
            >
              <p className="italic text-base leading-[25.6px] text-[#333333] mb-8">
                &quot;{language === 'en' ? testimonial.quoteEn : testimonial.quoteId}&quot;
              </p>
              <div className="flex items-center">
                {testimonial.image && (
                  <Image
                    alt={testimonial.name}
                    src={testimonial.image}
                    width={48}
                    height={48}
                    className="rounded-full object-cover mr-3"
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-base text-black">
                    {testimonial.name}
                  </span>
                  <span className="text-[13.6px] text-[#555555]">
                    {language === 'en' ? testimonial.positionEn : testimonial.positionId}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500 py-8">
            No testimonials available
          </div>
        )}
      </div>
    </section>
  )
}
