'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface Member {
  name: string
  positionEn: string
  positionId: string
  imageUrl: string
}

interface Group {
  titleEn: string
  titleId: string
  members: Member[]
}

export function OrganizationStructureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
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
    const fetchOrganizationData = async () => {
      try {
        const response = await fetch('/api/cms/about/organization')
        if (response.ok) {
          const data = await response.json()
          if (data.groups && data.groups.length > 0) {
            setGroups(data.groups)
          }
        }
      } catch (error) {
        console.error('Error fetching organization data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizationData()
  }, [])

  if (isLoading) {
    return (
      <section ref={sectionRef} className="bg-[#f5f6f7] w-full py-20">
        <div className="max-w-[1240px] mx-auto px-5">
          <div className="text-center py-8 text-[#29294b]">
            {t({ en: 'Loading...', id: 'Memuat...' })}
          </div>
        </div>
      </section>
    )
  }

  if (!groups || groups.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} className="bg-[#f5f6f7] w-full py-20">
      <div className="max-w-[1240px] mx-auto px-5">
        <div className={`flex flex-col items-center justify-center text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
            {t({ en: 'ORGANIZATION', id: 'ORGANISASI' })}
          </h2>
          <h1 className="text-[#29294b] text-[28px] font-bold">
            {t({ en: 'Organization Structure', id: 'Struktur Organisasi' })}
          </h1>
        </div>

        <div>
          {groups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className={`text-xl font-bold text-[#29294b] ${groupIndex === 0 ? 'mt-8' : 'mt-12'} mb-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${(groupIndex * 100) + 500}ms` }}>
                {language === 'en' ? group.titleEn : group.titleId}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {group.members.map((member, memberIndex) => (
                  <div
                    key={memberIndex}
                    className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${(groupIndex * 100) + (memberIndex * 50) + 500}ms` }}
                  >
                    <div className="relative rounded-lg overflow-hidden mb-4" style={{ width: '100%', height: '250px' }}>
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">{t({ en: 'No image', id: 'Tidak ada gambar' })}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-[#29294b] mb-1">{member.name}</h3>
                    <span className="text-sm text-[#29294b]">{language === 'en' ? member.positionEn : member.positionId}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


