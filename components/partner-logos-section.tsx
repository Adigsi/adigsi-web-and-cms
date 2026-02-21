'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface PartnerLogo {
  alt: string
  imageUrl: string
}

interface PartnerCategory {
  categoryNameEn: string
  categoryNameId: string
  width: number
  height: number
  logos: PartnerLogo[]
}

interface PartnerLogosData {
  heading: {
    subtitleEn: string
    subtitleId: string
    titleEn: string
    titleId: string
  }
  categories: PartnerCategory[]
}

export function PartnerLogosSection() {
  const [isVisible, setIsVisible] = useState(true)
  const [partnerLogosData, setPartnerLogosData] = useState<PartnerLogosData | null>(null)
  const [windowWidth, setWindowWidth] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Fetch partner logos data
    const fetchData = async () => {
      try {
        const res = await fetch('/api/cms/members/partner-logos')
        if (res.ok) {
          const data = await res.json()
          console.log('Partner logos data:', data)
          setPartnerLogosData(data)
        } else {
          console.error('Failed to fetch partner logos:', res.status)
        }
      } catch (error) {
        console.error('Error fetching partner logos:', error)
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
      // Check if already in view on mount
      if (sectionRef.current.getBoundingClientRect().top < window.innerHeight) {
        setIsVisible(true)
      }
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  if (!partnerLogosData) {
    return null
  }

  // Don't render if no categories with logos
  const hasLogos = partnerLogosData.categories.some(cat => cat.logos.length > 0)
  console.log('Partner logos loaded:', {
    categoriesCount: partnerLogosData.categories.length,
    hasLogos,
    categories: partnerLogosData.categories.map(cat => ({
      name: cat.categoryNameEn,
      logosCount: cat.logos.length,
      width: cat.width,
      height: cat.height,
      logos: cat.logos.map(l => ({ alt: l.alt, hasImage: !!l.imageUrl }))
    }))
  })
  if (!hasLogos) {
    return null
  }

  // Calculate responsive logo size
  const getResponsiveSize = (baseWidth: number): number => {
    if (!windowWidth) return baseWidth
    if (windowWidth < 640) return Math.max(baseWidth * 0.5, 80) // Mobile: 50% or min 80px
    if (windowWidth < 1024) return Math.max(baseWidth * 0.75, 120) // Tablet: 75% or min 120px
    return baseWidth // Desktop: 100%
  }

  return (
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-310 mx-auto px-5">
        <div className={`text-center mb-14 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold tracking-wider">
            {t({ 
              en: partnerLogosData.heading.subtitleEn, 
              id: partnerLogosData.heading.subtitleId 
            })}
          </h2>
          <h1 className="text-[#29294b] text-2xl md:text-[28px] font-bold">
            {t({ 
              en: partnerLogosData.heading.titleEn, 
              id: partnerLogosData.heading.titleId 
            })}
          </h1>
        </div>

        {/* Dynamic Partner Categories */}
        {partnerLogosData.categories.map((category, categoryIndex) => (
          category.logos.length > 0 && (
            <div 
              key={categoryIndex}
              className={`mb-12`}
            >
              <div className="flex flex-wrap justify-center items-center gap-6">
                {category.logos.map((logo, logoIndex) => {
                  const responsiveSize = getResponsiveSize(category.width)
                  return (
                    <div
                      key={logoIndex}
                      className="group bg-white border-2 border-gray-300 rounded-xl hover:border-[#3350e6] hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center justify-center shadow-md"
                      style={{ 
                        width: `${responsiveSize}px`, 
                        height: `${responsiveSize}px`,
                        minWidth: `${responsiveSize}px`,
                        minHeight: `${responsiveSize}px`
                      }}
                    >
                      {logo.imageUrl ? (
                        <>
                          <img
                            src={logo.imageUrl}
                            alt={logo.alt || 'Partner logo'}
                            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                            style={{ padding: `${responsiveSize * 0.05}px` }}
                            onError={(e) => {
                              console.error('Image load error:', logo.alt, logo.imageUrl)
                              e.currentTarget.style.display = 'none'
                            }}
                            onLoad={() => {
                              console.log('Image loaded:', logo.alt)
                            }}
                          />
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground text-center px-2 font-medium">
                          {logo.alt || 'No image URL'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  )
}
