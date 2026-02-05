'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from './icons/arrow-right'

const events = [
  {
    id: 1,
    image: '/images/agenda-1.jpg',
    category: 'CybersecurityEvent',
    date: '12 Februari 2026',
    location: 'Zoom Meeting',
    title: 'ADIGSI Sectalk: The Impact of Human Factors on Cyber Risk in the Healthcare Sector',
    registerUrl: 'https://s.id/ADIGSISecTalkRegisterForm',
  },
  {
    id: 2,
    image: '/images/agenda-2.webp',
    category: 'CybersecurityEvent',
    date: '22 Juli 2025',
    location: 'Bidakara Hotel, Jakarta',
    title: 'CyberSec Startup Challenge 2025 Resmi Dibuka',
    registerUrl: '#',
  },
  {
    id: 3,
    image: '/images/agenda-3.jpg',
    category: 'CybersecurityEvent',
    date: '10 Desember 2025',
    location: 'The Kasablanka Hall, Jakarta',
    title: 'BFN Fest 2025',
    registerUrl: 'https://bulanfintechnasional.com/',
  },
]

export function AgendaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-[131px]">
        <div
          className={`flex flex-col items-center justify-center text-center mb-8 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
            AGENDA
          </h2>
          <h1 className="text-[#29294b] text-2xl md:text-[28px] font-bold">
            Adigsi Activity Agenda
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-8">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col max-w-[350px] w-full transition-all duration-1000 hover:shadow-md ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${(index + 1) * 100}ms`,
              }}
            >
              <div className="relative">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt="Event image"
                  width={350}
                  height={200}
                  className="object-cover"
                  style={{ width: '100%', height: '200px' }}
                />
                <div className="absolute bottom-3 left-6 bg-white shadow-md rounded-lg px-2.5 py-1">
                  <span className="text-xs font-semibold">{event.category}</span>
                </div>
              </div>

              <div className="flex flex-col p-4">
                <div className="flex justify-between text-[12.8px] text-[#555555] mt-4 mb-1">
                  <span>{event.date}</span>
                  <span>{event.location}</span>
                </div>

                <h3 className="text-black text-base font-bold mt-2">
                  {event.title}
                </h3>

                <div className="flex gap-2 mt-8">
                  <a
                    href={event.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-[#2f55ff] font-semibold text-sm border border-[#2f55ff] rounded-lg py-2 transition-all duration-200 hover:bg-[#2f55ff] hover:text-white"
                  >
                    Register
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/agenda"
          className={`flex justify-center mt-12 ${
            isVisible ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'
          }`}
        >
          <div className="flex gap-4 items-center justify-center border-b border-[#333333] pb-2">
            <span className="text-sm font-medium text-[#29294b]">See All</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </section>
  )
}
