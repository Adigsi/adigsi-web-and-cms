'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@/components/icons/arrow-right'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { NewsCard, type NewsData } from '@/components/news-card'

export function LatestNewsSection() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [news, setNews] = useState<NewsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDirectionRef = useRef('down')
  const lastScrollYRef = useRef(0)
  const { t } = useLanguage()

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
                <NewsCard
                  key={article._id}
                  article={article}
                  index={index}
                  animClass={isFadingOut ? 'animate-fade-out-down' : (isVisible && !isLoading ? 'animate-fade-in-up' : 'opacity-0 translate-y-30')}
                />
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
