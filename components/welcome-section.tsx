'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Verified } from 'lucide-react'
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
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-20 w-full">
        <div className="text-center text-muted-foreground">Loading...</div>
      </section>
    )
  }
  
  if (!welcomeData) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-20 w-full">
        <div className="text-center text-muted-foreground">No data available</div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-20 w-full relative">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h2 className="text-primary text-sm md:text-base font-bold uppercase tracking-widest mb-3">
          {language === 'en' ? welcomeData.titleSmallEn : welcomeData.titleSmallId}
        </h2>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          {language === 'en' ? welcomeData.titleLargeEn : welcomeData.titleLargeId}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
        {welcomeData.testimonials && welcomeData.testimonials.length > 0 ? (
          welcomeData.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative bg-card border border-border rounded-xl p-6 md:p-8 max-w-xl w-full flex flex-col justify-between shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 overflow-hidden group ${
                isVisible ? 'animate-fade-in-up' : ''
              }`}
              style={{
                animationDelay: isVisible ? `${index * 100}ms` : '0ms',
              }}
            >
              {/* Subtle top line accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-accent/0 group-hover:bg-accent/40 transition-colors duration-300" />
              
              <p className="italic text-base md:text-lg leading-relaxed text-foreground mb-8 relative z-10">
                &quot;{language === 'en' ? testimonial.quoteEn : testimonial.quoteId}&quot;
              </p>
              
              <div className="flex items-center gap-3 relative z-10">
                {testimonial.image && (
                  <div className="relative shrink-0">
                    <Image
                      alt={testimonial.name}
                      src={testimonial.image}
                      width={56}
                      height={56}
                      className="rounded-full object-cover shrink-0"
                    />
                  </div>
                )}
                <div className="flex flex-col grow">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-foreground">
                      {testimonial.name}
                    </span>
                    <Verified className="w-4 h-4 text-primary shrink-0" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? testimonial.positionEn : testimonial.positionId}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-muted-foreground py-8">
            No testimonials available
          </div>
        )}
      </div>
    </section>
  )
}
