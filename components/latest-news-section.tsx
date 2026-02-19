'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from '@/components/icons/arrow-right'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface NewsData {
  _id: string
  slug: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  contentEn: string
  contentId: string
  image: string
  published: boolean
  createdAt: string
}

export function LatestNewsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [news, setNews] = useState<NewsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

  const getTimeAgo = (dateString: string) => {
    try {
      const now = new Date()
      const past = new Date(dateString)
      
      // Check if date is valid
      if (isNaN(past.getTime())) {
        return language === 'en' ? 'Recently' : 'Baru-baru ini'
      }
      
      const diffMs = now.getTime() - past.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      const diffWeeks = Math.floor(diffDays / 7)
      const diffMonths = Math.floor(diffDays / 30)
      const diffYears = Math.floor(diffDays / 365)

      if (diffMins < 1) {
        return language === 'en' ? 'Just now' : 'Baru saja'
      } else if (diffMins < 60) {
        return language === 'en' 
          ? `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
          : `${diffMins} menit yang lalu`
      } else if (diffHours < 24) {
        return language === 'en'
          ? `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
          : `${diffHours} jam yang lalu`
      } else if (diffDays < 7) {
        return language === 'en'
          ? `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
          : `${diffDays} hari yang lalu`
      } else if (diffWeeks < 4) {
        return language === 'en'
          ? `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`
          : `${diffWeeks} minggu yang lalu`
      } else if (diffMonths < 12) {
        return language === 'en'
          ? `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
          : `${diffMonths} bulan yang lalu`
      } else {
        return language === 'en'
          ? `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
          : `${diffYears} tahun yang lalu`
      }
    } catch (error) {
      console.error('Error parsing date:', dateString, error)
      return language === 'en' ? 'Recently' : 'Baru-baru ini'
    }
  }

  useEffect(() => {
    const fetchLatestNews = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/cms/news/news?page=1')
        const data = await response.json()

        if (data.success) {
          // Filter only published news and take first 3
          const publishedNews = data.data.filter((item: NewsData) => item.published).slice(0, 3)
          setNews(publishedNews)
        }
      } catch (error) {
        console.error('Error fetching latest news:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestNews()
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

  return (
    <section
      ref={sectionRef}
      className="bg-[#f5f6f7] w-full"
      style={{ fontFamily: 'Gotham, sans-serif' }}
    >
      <div className="max-w-310 mx-auto px-4 md:px-8 lg:px-32.75 py-20">
        <div
          className={`flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
            {t({ en: 'NEWS & ARTICLES', id: 'BERITA & ARTIKEL' })}
          </h2>
          <h1 className="text-[#29294b] text-[28px] font-bold">
            {t({ en: 'Latest News from ADIGSI', id: 'Berita Terbaru dari ADIGSI' })}
          </h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            {t({ en: 'Loading...', id: 'Memuat...' })}
          </div>
        ) : news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 justify-items-center">
              {news.map((article, index) => (
                <Link
                  key={article._id}
                  href={`/news/${article.slug}`}
                  className={`bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-1000 ease-out hover:shadow-lg flex flex-col max-w-[350px] w-full ${
                    isVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{
                    animationDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms',
                  }}
                >
                  <div className="relative">
                    <Image
                      src={article.image}
                      alt="News image"
                      width={350}
                      height={200}
                      className="object-cover"
                      style={{ width: '100%', height: '200px' }}
                    />
                    <div className="absolute bottom-3 left-6 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)] rounded-lg px-[10px] py-1">
                      <span className="text-xs font-semibold text-[#29294b]">
                        {language === 'en' ? article.categoryEn : article.categoryId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col p-4">
                    <h3 className="text-base font-bold text-black mt-2 line-clamp-3">
                      {language === 'en' ? article.titleEn : article.titleId}
                    </h3>
                    <div className="text-[12.8px] text-[#888] mt-4 text-right">
                      {article.createdAt ? getTimeAgo(article.createdAt) : t({ en: 'Recently', id: 'Baru-baru ini' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/news"
              className={`flex justify-center mt-12 transition-all duration-1000 ease-out ${
                isVisible ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'
              }`}
            >
              <div className="flex gap-4 items-center justify-center text-[#29294b] border-b border-[#333] pb-2">
                <span className="text-sm font-medium">
                  {t({ en: 'See All', id: 'Lihat Semua' })}
                </span>
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            </Link>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t({ en: 'No news available', id: 'Tidak ada berita' })}
          </div>
        )}
      </div>
    </section>
  )
}
