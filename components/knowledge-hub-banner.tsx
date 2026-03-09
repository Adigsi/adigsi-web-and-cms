'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { PageBannerSection } from '@/components/page-banner-section'

export function KnowledgeHubBanner() {
  const { language } = useLanguage()
  const [bannerData, setBannerData] = useState({
    titleEn: 'Knowledge Hub',
    titleId: 'Pusat Pengetahuan',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch('/api/cms/reports/banner')
        if (response.ok) {
          const data = await response.json()
          if (data.titleEn && data.titleId) {
            setBannerData({ titleEn: data.titleEn, titleId: data.titleId })
          }
        }
      } catch (error) {
        console.error('Error fetching knowledge hub banner data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBannerData()
  }, [])

  const title = language === 'en' ? bannerData.titleEn : bannerData.titleId

  return <PageBannerSection title={title} isLoading={isLoading} />
}
