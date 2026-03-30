'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { PageBannerSection } from '@/components/page-banner-section'

export function TermsConditionsBanner() {
  const { language } = useLanguage()
  const [bannerData, setBannerData] = useState({
    bannerTitleEn: 'Terms & Conditions',
    bannerTitleId: 'Syarat & Ketentuan',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch('/api/cms/terms-conditions')
        if (response.ok) {
          const data = await response.json()
          if (data.bannerTitleEn && data.bannerTitleId) {
            setBannerData({
              bannerTitleEn: data.bannerTitleEn,
              bannerTitleId: data.bannerTitleId,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching terms-conditions banner data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBannerData()
  }, [])

  const title =
    language === 'en' ? bannerData.bannerTitleEn : bannerData.bannerTitleId

  return <PageBannerSection title={title} isLoading={isLoading} />
}
