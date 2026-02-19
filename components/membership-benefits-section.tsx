'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface Membership {
  tier: string
  nameEn: string
  nameId: string
  descriptionEn: string
  descriptionId: string
  iconUrl: string
}

function MembershipBadge({ iconUrl }: { iconUrl: string }) {
  return (
    <div className="relative w-28 h-28 shrink-0 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
      {iconUrl.startsWith('data:') || iconUrl.startsWith('http') || iconUrl.startsWith('/') ? (
        <img
          src={iconUrl}
          alt="membership badge"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
          {iconUrl.charAt(0).toUpperCase()}
        </div>
      )}
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
        style={{
          backgroundColor: 'rgba(200, 200, 200, 0.3)'
        }}
      />
    </div>
  )
}

export function MembershipBenefitsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [memberships, setMemberships] = useState<Membership[]>([])
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
    const fetchMemberships = async () => {
      try {
        const response = await fetch('/api/cms/members/membership-benefits')
        if (response.ok) {
          const data = await response.json()
          if (data.memberships && Array.isArray(data.memberships) && data.memberships.length > 0) {
            setMemberships(data.memberships)
          }
        }
      } catch (error) {
        console.error('Error fetching membership benefits:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemberships()
  }, [])

  if (isLoading || memberships.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-310 mx-auto px-5">
        <div className={`text-center mb-14 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold tracking-wider">
            {t({ en: 'JOIN US', id: 'BERGABUNG' })}
          </h2>
          <h1 className="text-[#29294b] text-2xl md:text-[28px] font-bold">
            {t({ en: 'Membership Category', id: 'Kategori Keanggotaan' })}
          </h1>
        </div>

        <div className={`grid gap-6 ${
          memberships.length === 1 
            ? 'grid-cols-1 max-w-md mx-auto' 
            : memberships.length === 2 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : memberships.length === 3 
            ? 'grid-cols-1 lg:grid-cols-3' 
            : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          {memberships.map((membership, index) => (
            <div
              key={`${membership.tier}-${index}`}
              className={`group relative rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-6 items-start">
                <MembershipBadge iconUrl={membership.iconUrl} />

                <div className="flex-1 min-w-0">
                  <h3 className="text-[#29294b] font-bold text-lg mb-3 uppercase">
                    {language === 'en' ? membership.nameEn : membership.nameId}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed">
                    {language === 'en' ? membership.descriptionEn : membership.descriptionId}
                  </p>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl opacity-10">
                <div
                  className="absolute -top-10 -right-10 w-20 h-20 rounded-full"
                  style={{
                    backgroundColor: '#A0A0A0'
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
