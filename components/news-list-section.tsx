'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'

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

export function NewsListSection() {
  const [isVisible, setIsVisible] = useState(true)
  const [news, setNews] = useState<NewsData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()

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

  const fetchNews = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/cms/news/news?page=${page}`)
      const data = await response.json()

      if (data.success) {
        // Filter only published news
        const publishedNews = data.data.filter((item: NewsData) => item.published)
        console.log('News data:', publishedNews) // Debug
        setNews(publishedNews)
        setCurrentPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(1)
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
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-310 mx-auto px-5">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'en' ? 'Loading...' : 'Memuat...'}
          </div>
        ) : news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article, index) => (
                <Link
                  key={article._id}
                  href={`/news/${article.slug}`}
                  className={`group bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] no-underline ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    maxWidth: '450px',
                    margin: '0 auto',
                    width: '100%'
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
                    <div className="absolute bottom-3 left-6 bg-white shadow-md rounded-lg px-2.5 py-1">
                      <span className="text-xs font-semibold text-[#29294b]">
                        {language === 'en' ? article.categoryEn : article.categoryId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col p-4">
                    <h3 className="text-base font-bold text-black mt-2 leading-tight line-clamp-3">
                      {language === 'en' ? article.titleEn : article.titleId}
                    </h3>

                    <div className="text-[12.8px] text-[#888] mt-4">
                      {article.createdAt ? getTimeAgo(article.createdAt) : 'Recently'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => fetchNews(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {language === 'en' ? 'Previous' : 'Sebelumnya'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {language === 'en' 
                    ? `Page ${currentPage} of ${totalPages}` 
                    : `Halaman ${currentPage} dari ${totalPages}`}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchNews(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {language === 'en' ? 'Next' : 'Selanjutnya'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'en' ? 'No news found' : 'Tidak ada berita'}
          </div>
        )}
      </div>
    </section>
  )
}
