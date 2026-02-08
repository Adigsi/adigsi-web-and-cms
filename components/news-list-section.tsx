'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

const newsArticles = [
  {
    id: '79ea6f21-5d55-41fc-b7d8-08302b19cc1e',
    title: {
      en: 'ADIGSI Chairman: Deepfake, Voice Copy Become Most Rampant Cyber Crimes in AI Era',
      id: 'Ketua ADIGSI: Deepfake, Voice Copy Jadi Kejahatan Siber Paling Marak di Era AI'
    },
    category: { en: 'Press Release', id: 'Siaran Pers' },
    image: '/images/news-deepfake.webp',
    readTime: { en: '3 mins read', id: '3 menit baca' },
    date: { en: '9 days ago', id: '9 hari lalu' }
  },
  {
    id: 'b2c4d6e8-1234-5678-9abc-def012345678',
    title: {
      en: 'ADIGSI Joins KADIN Indonesia to Strengthen National Cybersecurity',
      id: 'ADIGSI Bergabung dengan KADIN Indonesia Perkuat Keamanan Siber Nasional'
    },
    category: { en: 'Partnership', id: 'Kemitraan' },
    image: '/images/news-kadin.webp',
    readTime: { en: '4 mins read', id: '4 menit baca' },
    date: { en: '2 weeks ago', id: '2 minggu lalu' }
  },
  {
    id: 'c3d5e7f9-2345-6789-abcd-ef0123456789',
    title: {
      en: 'Indonesia IT Security Summit 2024: Building Resilient Digital Infrastructure',
      id: 'Indonesia IT Security Summit 2024: Membangun Infrastruktur Digital yang Tangguh'
    },
    category: { en: 'Event', id: 'Acara' },
    image: '/images/news-itsec.png',
    readTime: { en: '5 mins read', id: '5 menit baca' },
    date: { en: '3 weeks ago', id: '3 minggu lalu' }
  },
  {
    id: 'd4e6f8a0-3456-789a-bcde-f01234567890',
    title: {
      en: 'New Ransomware Attacks Target Indonesian Healthcare Sector',
      id: 'Serangan Ransomware Baru Targetkan Sektor Kesehatan Indonesia'
    },
    category: { en: 'Security Alert', id: 'Peringatan Keamanan' },
    image: '/images/event-1.jpg',
    readTime: { en: '6 mins read', id: '6 menit baca' },
    date: { en: '1 month ago', id: '1 bulan lalu' }
  },
  {
    id: 'e5f7g9b1-4567-89ab-cdef-012345678901',
    title: {
      en: 'ADIGSI Launches Cybersecurity Certification Program for Professionals',
      id: 'ADIGSI Luncurkan Program Sertifikasi Keamanan Siber untuk Profesional'
    },
    category: { en: 'Education', id: 'Pendidikan' },
    image: '/images/event-2.webp',
    readTime: { en: '4 mins read', id: '4 menit baca' },
    date: { en: '1 month ago', id: '1 bulan lalu' }
  },
  {
    id: 'f6g8h0c2-5678-9abc-def0-123456789012',
    title: {
      en: 'Government Collaborates with ADIGSI on National Cyber Defense Strategy',
      id: 'Pemerintah Berkolaborasi dengan ADIGSI dalam Strategi Pertahanan Siber Nasional'
    },
    category: { en: 'Government', id: 'Pemerintah' },
    image: '/images/event-3.jpg',
    readTime: { en: '7 mins read', id: '7 menit baca' },
    date: { en: '2 months ago', id: '2 bulan lalu' }
  },
]

export function NewsListSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { language } = useLanguage()

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
      <div className="max-w-[1240px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className={`group bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] no-underline ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                maxWidth: '350px',
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
                    {language === 'en' ? article.category.en : article.category.id}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col p-4">
                <h3 className="text-base font-bold text-black mt-2 leading-tight line-clamp-3">
                  {language === 'en' ? article.title.en : article.title.id}
                </h3>
                
                <div className="flex justify-between text-[12.8px] text-[#555] mt-4 mb-1">
                  <span className="block">
                    {language === 'en' ? article.readTime.en : article.readTime.id}
                  </span>
                  <span className="block">
                    {language === 'en' ? article.date.en : article.date.id}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
