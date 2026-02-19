'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from './icons/arrow-right'
import { useLanguage } from '@/contexts/language-context'

interface EventData {
  _id: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  image: string
  registerLink: string
  published: boolean
}

export function AgendaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [events, setEvents] = useState<EventData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    const fetchLatestEvents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/cms/events/events?page=1')
        if (response.ok) {
          const data = await response.json()
          // Filter only published events and take first 3
          const publishedEvents = data.data.filter((event: EventData) => event.published).slice(0, 3)
          setEvents(publishedEvents)
        }
      } catch (error) {
        console.error('Error fetching latest events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestEvents()
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
      className="bg-[#f5f6f7] py-20"
    >
      <div className="max-w-310 mx-auto px-4 md:px-8 lg:px-32.75">
        <div
          className={`flex flex-col items-center justify-center text-center mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
        >
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
            {t({ en: 'EVENT', id: 'AGENDA' })}
          </h2>
          <h1 className="text-[#29294b] text-2xl md:text-[28px] font-bold">
            {t({ en: 'Adigsi Activity Agenda', id: 'Agenda Kegiatan Adigsi' })}
          </h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            {t({ en: 'Loading...', id: 'Memuat...' })}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-8">
              {events.map((event, index) => (
                <div
                  key={event._id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col max-w-87.5 w-full transition-all duration-1000 hover:shadow-md ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                  style={{
                    animationDelay: `${(index + 1) * 100}ms`,
                  }}
                >
                  <div className="relative">
                    <Image
                      src={event.image}
                      alt="Event image"
                      width={350}
                      height={200}
                      className="object-cover"
                      style={{ width: '100%', height: '200px' }}
                    />
                    <div className="absolute bottom-3 left-6 bg-white shadow-md rounded-lg px-2.5 py-1">
                      <span className="text-xs font-semibold">
                        {language === 'en' ? event.categoryEn : event.categoryId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col p-4">
                    <h3 className="text-black text-base font-bold mt-2 line-clamp-3">
                      {language === 'en' ? event.titleEn : event.titleId}
                    </h3>

                    <div className="flex gap-2 mt-8">
                      <Link
                        href={event.registerLink}
                        target={event.registerLink.startsWith('http') ? '_blank' : undefined}
                        rel={event.registerLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex-1 text-center text-[#2f55ff] font-semibold text-sm border border-[#2f55ff] rounded-lg py-2 transition-all duration-200 hover:bg-[#2f55ff] hover:text-white no-underline"
                      >
                        {t({ en: 'Register', id: 'Daftar' })}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/events"
              className={`flex justify-center mt-12 ${isVisible ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'
                }`}
            >
              <div className="flex gap-4 items-center justify-center border-b border-[#333333] pb-2">
                <span className="text-sm font-medium text-[#29294b]">
                  {t({ en: 'See All', id: 'Lihat Semua' })}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t({ en: 'No events available', id: 'Tidak ada event' })}
          </div>
        )}
      </div>
    </section>
  )
}
