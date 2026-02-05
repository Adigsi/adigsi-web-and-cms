'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from '@/components/icons/arrow-right'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

const newsArticles = [
  {
    id: '79ea6f21-5d55-41fc-b7d8-08302b19cc1e',
    title: 'Ketua ADIGSI: Deepfake, Voice Copy Jadi Kejahatan Siber Paling Marak di Era AI',
    image: '/images/article-1.webp',
    category: 'Siaran Pers',
    readTime: '3 mins read',
    timeAgo: '7 hours ago',
  },
  {
    id: '5d88f7e0-bc80-46b0-8cc2-9cf6bdb45dd3',
    title: 'Kadin resmikan Asosiasi Digitalisasi dan Kemanan Siber Indonesia',
    image: '/images/article-2.webp',
    category: 'Siaran Pers',
    readTime: '3 mins read',
    timeAgo: '7 days ago',
  },
  {
    id: 'bf2fa120-e902-4e4b-87cb-793d41bcf76b',
    title: 'ITSEC Asia dan ADIGSI Luncurkan Gerakan Nasional Ketahanan Siber, Ini Target nya!',
    image: '/images/article-3.png',
    category: 'Siaran Pers',
    readTime: '4 mins read',
    timeAgo: '8 days ago',
  },
]

export function LatestNewsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

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
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-[131px] py-20">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 justify-items-center">
          {newsArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className={`bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-1000 ease-out hover:shadow-lg flex flex-col max-w-[350px] w-full ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{
                animationDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms',
              }}
            >
              <div className="relative">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt="Event image"
                  width={350}
                  height={200}
                  className="object-cover"
                  style={{ width: '100%', height: '200px' }}
                />
                <div className="absolute bottom-3 left-6 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)] rounded-lg px-[10px] py-1">
                  <span className="text-xs font-semibold text-[#29294b]">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col p-4">
                <h3 className="text-base font-bold text-black mt-2">
                  {article.title}
                </h3>
                <div className="flex justify-between text-[12.8px] text-[#555] mt-4">
                  <span className="block">{article.readTime}</span>
                  <span className="block">{article.timeAgo}</span>
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
      </div>
    </section>
  )
}
