'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'

interface Category {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  iconUrl: string
}

export function MembershipCategorySection() {
  const [isVisible, setIsVisible] = useState(false)
  const [sectionData, setSectionData] = useState<{
    sectionTitleEn: string
    sectionTitleId: string
    sectionDescriptionEn: string
    sectionDescriptionId: string
    categories: Category[]
  }>({
    sectionTitleEn: 'CATEGORY',
    sectionTitleId: 'KATEGORI',
    sectionDescriptionEn: 'We offer several membership categories designed to accommodate the diverse backgrounds and needs of stakeholders in the digital ecosystem. Each category offers specific benefits aimed at strengthening collaboration and mutual growth.',
    sectionDescriptionId: 'Kami menawarkan beberapa kategori keanggotaan yang dirancang untuk mengakomodasi latar belakang dan kebutuhan berbagai pemangku kepentingan dalam ekosistem digital. Setiap kategori menawarkan manfaat khusus yang bertujuan untuk memperkuat kolaborasi dan pertumbuhan bersama.',
    categories: [],
  })
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()

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
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cms/register/membership')
        if (response.ok) {
          const data = await response.json()
          setSectionData({
            sectionTitleEn: data.sectionTitleEn || 'CATEGORY',
            sectionTitleId: data.sectionTitleId || 'KATEGORI',
            sectionDescriptionEn: data.sectionDescriptionEn || '',
            sectionDescriptionId: data.sectionDescriptionId || '',
            categories: data.categories || [],
          })
        }
      } catch (error) {
        console.error('Error fetching membership data:', error)
      }
    }

    fetchData()
  }, [])

  // Get the icon image based on index (fallback to default if not available)
  const getIconImage = (index: number) => {
    return `/images/icon/icon${index + 1}.png`
  }

  return (
    <section ref={sectionRef} className="w-full py-20 max-w-[1240px] mx-auto px-5">
      <div className={`flex flex-col items-center justify-center text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
          {language === 'en' ? sectionData.sectionTitleEn : sectionData.sectionTitleId}
        </h2>
        <h1 className="text-[#29294b] text-[28px] font-bold mb-2">
          {t({ en: 'Membership Category', id: 'Kategori Keanggotaan' })}
        </h1>
        <p className="text-[#29294b] text-base leading-6 max-w-[744px] mt-2">
          {language === 'en' ? sectionData.sectionDescriptionEn : sectionData.sectionDescriptionId}
        </p>
      </div>

      <div className={`grid ${sectionData.categories.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-8 mt-12`}>
        {sectionData.categories.length > 0 ? (
          sectionData.categories.map((category, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="bg-[#333333] rounded-full p-8 mb-6 flex items-center justify-center">
                <Image
                  src={category.iconUrl || getIconImage(index)}
                  alt={language === 'en' ? category.titleEn : category.titleId}
                  width={100}
                  height={100}
                  className="w-[100px] h-[100px]"
                />
              </div>
              <h3 className="text-[#29294b] text-xl font-semibold mb-2">
                {language === 'en' ? category.titleEn : category.titleId}
              </h3>
              <p className="text-[#29294b] text-[15px] leading-[21px]">
                {language === 'en' ? category.descriptionEn : category.descriptionId}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-8">
            {t({ en: 'No categories available', id: 'Tidak ada kategori yang tersedia' })}
          </div>
        )}
      </div>
    </section>
  )
}
