'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

const events = [
  {
    id: 1,
    title: 'ADIGSI Sectalk: The Impact of Human Factors on Cyber Risk in the Healthcare Sector',
    category: 'CybersecurityEvent',
    image: 'https://static.wixstatic.com/media/e2e1f7_a7174a30fb244fc9aec18419ce3ada1f~mv2.jpg',
    registerLink: 'https://s.id/ADIGSISecTalkRegisterForm'
  },
  {
    id: 2,
    title: 'CyberSec Startup Challenge 2025 Resmi Dibuka',
    category: 'CybersecurityEvent',
    image: 'https://static.wixstatic.com/media/e2e1f7_1b20c2e5895d4e54accb598daa9f8f14~mv2.webp',
    registerLink: '#'
  },
  {
    id: 3,
    title: 'BFN Fest 2025',
    category: 'CybersecurityEvent',
    image: 'https://static.wixstatic.com/media/e2e1f7_c0b5491bf0b44850be323728bc3f744f~mv2.jpg',
    registerLink: 'https://bulanfintechnasional.com/'
  },
  {
    id: 4,
    title: 'Sosialisasi Pedoman Penerapan Keamanan Siber',
    category: 'CybersecurityEvent',
    image: 'https://static.wixstatic.com/media/e2e1f7_e54d6867842540c18887cc7d0ab60298~mv2.png',
    registerLink: '#'
  },
  {
    id: 5,
    title: 'ADIGSI - UK Embassy Jakarta: Cybersecurity Roundtable Discussion',
    category: 'CybersecurityEvent',
    image: 'https://static.wixstatic.com/media/e2e1f7_cfd74499fe0d4a92bc89866013fb56ee~mv2.png',
    registerLink: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfOOxEkoa1Zbbo-awmZ66uevnjbRg695KzMww97eLH-Iha8RQ/closedform'
  },
  {
    id: 6,
    title: 'National Cybersecurity Connect 2025',
    category: 'CybersecurityEvent',
    image: 'https://static.wixstatic.com/media/e2e1f7_d115505de756493b9b3e5ee99d84a876~mv2.jpg',
    registerLink: 'http://ncsc.co.id/register'
  },
  {
    id: 7,
    title: 'INTI SUMMIT 2025',
    category: 'CybersecurityEvent',
    image: 'https://static.wixstatic.com/media/e2e1f7_647c99efaf574559a805b4d1b2fccfbb~mv2.jpg',
    registerLink: 'https://form.cngme.com/visit'
  },
  {
    id: 8,
    title: 'Indonesia Banking & Payment Expo 2025',
    category: 'CybersecurityEvent',
    image: 'https://static.wixstatic.com/media/e2e1f7_c9c00c50ca8f4659a1bcdbd91c54071a~mv2.jpg',
    registerLink: 'https://form.cngme.com/visit'
  }
]

export function EventsListSection() {
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
    <section ref={sectionRef} className="w-full py-20 bg-white">
      <div className="max-w-[1240px] mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
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
                  <span className="text-xs font-semibold text-[#29294b]">
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col p-4 flex-1">
                <h3 className="text-base font-bold text-black mb-2 leading-tight">
                  {event.title}
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
      </div>
    </section>
  )
}
