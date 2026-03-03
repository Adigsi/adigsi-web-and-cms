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
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [news, setNews] = useState<NewsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef('down')
  const lastScrollYRef = useRef(0)
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

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      scrollDirectionRef.current = window.scrollY > lastScrollYRef.current ? 'down' : 'up'
      lastScrollYRef.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [])

  // Intersection Observer - only animate when scrolling DOWN from TOP
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger fade-in animation when entering viewport while scrolling down
        if (entry.isIntersecting && scrollDirectionRef.current === 'down') {
          setIsVisible(true)
          setIsFadingOut(false)
        }
        // Trigger fade-out animation when leaving viewport from TOP while scrolling up
        else if (!entry.isIntersecting && scrollDirectionRef.current === 'up') {
          setIsFadingOut(true)
          // After fade-out animation completes (800ms), hide the content
          setTimeout(() => {
            setIsVisible(false)
            setIsFadingOut(false)
          }, 800)
        }
        // When leaving from BOTTOM (scrolling down) or entering from BOTTOM (scrolling up) → do nothing
      },
      { threshold: 0.4 }
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
      className="w-full bg-background border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-20">
        <div
          className={`flex flex-col items-center justify-center text-center ${
            isFadingOut ? 'animate-fade-out-down' : (isVisible && !isLoading ? 'animate-fade-in-up' : 'opacity-0 translate-y-30')
          }`}
          style={{
            animationDelay: isFadingOut ? '0ms' : (isVisible && !isLoading ? '0ms' : '0ms'),
            animationDuration: isFadingOut || (isVisible && !isLoading) ? '1.2s' : '0s',
          }}
        >
          <h2 className="text-primary text-sm md:text-base font-bold uppercase tracking-widest mb-3">
            {t({ en: 'NEWS & ARTICLES', id: 'BERITA & ARTIKEL' })}
          </h2>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t({ en: 'Latest News from ADIGSI', id: 'Berita Terbaru dari ADIGSI' })}
          </h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            {t({ en: 'Loading...', id: 'Memuat...' })}
          </div>
        ) : news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 justify-items-center">
              {news.map((article, index) => (
                <Link
                  key={article._id}
                  href={`/news/${article.slug}`}
                  className={`group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 flex flex-col max-w-sm w-full ${
                    isFadingOut ? 'animate-fade-out-down' : (isVisible && !isLoading ? 'animate-fade-in-up' : 'opacity-0 translate-y-30')
                  }`}
                  style={{
                    animationDelay: isFadingOut ? '0ms' : (isVisible && !isLoading ? `${250 + (index + 1) * 150}ms` : '0ms'),
                    animationDuration: isFadingOut || (isVisible && !isLoading) ? '1.2s' : '0s',
                  }}
                >
                  {/* Left accent border - cybersecurity style */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/0 group-hover:bg-accent/60 transition-colors duration-300" />

                  {/* Image container with subtle accent */}
                  <div className="relative overflow-hidden bg-muted">
                    <Image
                      src={article.image}
                      alt="News image"
                      width={350}
                      height={200}
                      className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-0 animate-fade-in-up"
                      style={{ width: '100%', height: '200px', animationDuration: '0.8s' }}
                      onLoadingComplete={(result) => {
                        if (result.naturalWidth === 0) {
                          setNews(prev => prev.filter(item => item._id !== article._id))
                        }
                      }}
                    />
                    
                    {/* Top gradient accent on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category badge - enhanced design */}
                    <div className="absolute bottom-3 left-3 bg-linear-to-r from-accent/90 to-accent bg-accent text-accent-foreground rounded-md px-2 py-1 shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
                        {language === 'en' ? article.categoryEn : article.categoryId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col p-5 grow">
                    <h3 className="text-base font-bold text-foreground mt-1 line-clamp-3 group-hover:text-primary transition-colors duration-200">
                      {language === 'en' ? article.titleEn : article.titleId}
                    </h3>
                    
                    {/* Divider line */}
                    <div className="h-px bg-border/50 my-4 group-hover:bg-accent/30 transition-colors duration-300" />
                    
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {article.createdAt ? getTimeAgo(article.createdAt) : t({ en: 'Recently', id: 'Baru-baru ini' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/news"
              className={`flex justify-center mt-12 ${
                isFadingOut ? 'animate-fade-out-down' : (isVisible && !isLoading ? 'animate-fade-in-up' : 'opacity-0 translate-y-30')
              }`}
              style={{
                animationDelay: isFadingOut ? '0ms' : (isVisible && !isLoading ? `${250 + 4 * 150}ms` : '0ms'),
                animationDuration: isFadingOut || (isVisible && !isLoading) ? '1.2s' : '0s',
              }}
            >
              <div className="flex gap-3 items-center justify-center text-primary font-semibold border-b-2 border-primary pb-2 hover:gap-4 transition-all duration-200">
                <span className="text-sm">
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
