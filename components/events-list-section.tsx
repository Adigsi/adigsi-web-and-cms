'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'

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

const defaultEvents = [
  {
    _id: '0',
    titleEn: 'No Event Available',
    titleId: 'Tidak Ada Event',
    categoryEn: 'No Category',
    categoryId: 'Tanpa Kategori',
    image: '/placeholder.svg',
    registerLink: 'https://adigsi.id/agenda',
    published: false,
  },
]

export function EventsListSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [events, setEvents] = useState<EventData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

  const fetchEvents = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/cms/events/events?page=${page}`)
      if (response.ok) {
        const data = await response.json()
        // Only show published events
        const publishedEvents = data.data.filter((event: EventData) => event.published)
        setEvents(publishedEvents)
        setCurrentPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
      } else {
        // Fallback to default events if API fails
        setEvents(defaultEvents as any)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      // Fallback to default events
      setEvents(defaultEvents as any)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents(1)
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

  if (isLoading) {
    return (
      <section ref={sectionRef} className="w-full py-20 bg-white">
        <div className="max-w-310 mx-auto px-5 text-center text-muted-foreground">
          {t({ en: 'Loading...', id: 'Memuat...' })}
        </div>
      </section>
    )
  }

  const displayEvents = events.length > 0 ? events : (defaultEvents as unknown as EventData[])

  return (
    <>
      <section ref={sectionRef} className="w-full py-20 bg-white">
        <div className="max-w-310 mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEvents.map((event, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt="Event image"
                  width={350}
                  height={200}
                  onClick={() => setPreviewImage(event.image)}
                  className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ width: '100%', height: '200px' }}
                />
                <div className="absolute bottom-3 left-6 bg-white shadow-md rounded-lg px-2.5 py-1">
                  <span className="text-xs font-semibold text-[#29294b]">
                    {language === 'en' ? event.categoryEn : event.categoryId}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col p-4 flex-1">
                <h3 className="text-base font-bold text-black mb-2 leading-tight">
                  {language === 'en' ? event.titleEn : event.titleId}
                </h3>
                
                <div className="flex gap-2 mt-auto pt-8">
                  <Link
                    href={event.registerLink}
                    target={event.registerLink.startsWith('http') ? '_blank' : undefined}
                    rel={event.registerLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex-1 bg-transparent border border-[#2f55ff] text-[#2f55ff] font-semibold text-sm rounded-lg px-4 py-2 text-center hover:bg-[#2f55ff] hover:text-white transition-all duration-200 no-underline"
                  >
                    {t({ en: 'Register', id: 'Daftar' })}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => fetchEvents(currentPage - 1)}
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
              onClick={() => fetchEvents(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {language === 'en' ? 'Next' : 'Selanjutnya'}
            </Button>
          </div>
        )}
      </div>
    </section>

    {/* Image Preview Modal */}
    {previewImage !== null && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 top-20"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[calc(100vh-120px)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors z-10 shadow-lg"
            >
              <span className="text-2xl font-bold text-gray-700">×</span>
            </button>
            <img 
              src={previewImage || ''} 
              alt="Preview" 
              className="w-full h-auto rounded-lg max-h-[calc(100vh-160px)] object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
