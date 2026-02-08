'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

const supervisoryBoard = [
  {
    name: 'Slamet Aji Pamungkas',
    position: { en: 'Chairman of the Supervisory Board', id: 'Ketua Dewan Pengawas' },
    image: '/images/teams/01.jpg'
  },
  {
    name: 'Sylvia Efi Widyantari S',
    position: { en: 'Member', id: 'Anggota' },
    image: '/images/teams/02.jpg'
  },
  {
    name: 'Pratama D. Persadha',
    position: { en: 'Member', id: 'Anggota' },
    image: '/images/teams/03.png'
  }
]

const executiveBoard = [
  {
    name: 'Firlle H. Ganandito',
    position: { en: 'Chairman', id: 'Ketua Umum' },
    image: '/images/teams/06.png'
  },
  {
    name: 'Jamalul Izza',
    position: { en: 'Vice Chairman 1', id: 'Wakil Ketua Umum 1' },
    image: '/images/teams/07.png'
  },
  {
    name: 'Eva Noor',
    position: { en: 'Vice Chairman 2', id: 'Wakil Ketua Umum 2' },
    image: '/images/teams/08.png'
  },
  {
    name: 'Sunu Widyatmoko',
    position: { en: 'Secretary General', id: 'Sekretaris Jenderal' },
    image: '/images/teams/09.png'
  },
  {
    name: 'Rorian Pratyaksa',
    position: { en: 'Treasurer General', id: 'Bendahara Umum' },
    image: '/images/teams/010.png'
  }
]

const executiveBoardExtended = [
  {
    name: 'Mercy Simorangkir',
    position: { en: 'Deputy Secretary General I', id: 'Wakil Sekretaris Jenderal I' },
    image: '/images/teams/new/mercy simorangkir.jpg'
  },
  {
    name: 'Aditya Adiguna',
    position: { en: 'Deputy Treasurer I', id: 'Wakil Bendahara I' },
    image: '/images/teams/new/Aditya Adiguna.png'
  },
  {
    name: 'Abraham Auzan',
    position: { en: 'Deputy Treasurer II', id: 'Wakil Bendahara II' },
    image: '/images/teams/new/Abraham Auzan.webp'
  },
  {
    name: 'Arry Abdi Sylman',
    position: { en: 'Head of Infrastructure Protection', id: 'Kepala Bidang Infrastructure Protection' },
    image: '/images/teams/new/Arry Abdi Syalman.png'
  },
  {
    name: 'Edwin Purwandesi',
    position: { en: 'Head of Community Development', id: 'Kepala Bidang Community Development' },
    image: '/images/teams/new/Edwin Purwandesi.jpg'
  },
  {
    name: 'Dr. Charles',
    position: { en: 'Head of Talent Development', id: 'Kepala Bidang Talent Development' },
    image: '/images/teams/new/Dr. Charles.webp'
  },
  {
    name: 'Eryk Budi Pratama',
    position: { en: 'Head of Data Security & Privacy', id: 'Kepala Bidang Data Security & Privacy' },
    image: '/images/teams/new/Eryk Budi Pratama.webp'
  },
  {
    name: 'Handi Priono',
    position: { en: 'Head of Cyber Incident Response & Cooperation', id: 'Kepala Bidang Cyber Incident Response & Cooperation' },
    image: '/images/teams/new/Handi Priono.jpg'
  },
  {
    name: 'Girindro P. Digdo',
    position: { en: 'Head of Cyber Threats & Risk Management', id: 'Kepala Bidang Cyber Threats & Risk Management' },
    image: '/images/teams/new/Girindro P. Digdo.jpg'
  },
  {
    name: 'Anwar Siregar',
    position: { en: 'Head of Cybersecurity Policy & Regulation', id: 'Kepala Bidang Cybersecurity Policy & Regulation' },
    image: '/images/teams/new/Anwar Siregar.jpg'
  },
  {
    name: 'Defi Nofitra',
    position: { en: 'Head of International Collaboration & Cyber Research', id: 'Kepala Bidang International Collaboration & Cyber Research' },
    image: '/images/teams/new/Defi Nofitra.jpg'
  }
]

export function OrganizationStructureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

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
    <section ref={sectionRef} className="bg-[#f5f6f7] w-full py-20">
      <div className="max-w-[1240px] mx-auto px-5">
        <div className={`flex flex-col items-center justify-center text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
            {t({ en: 'ORGANIZATION', id: 'ORGANISASI' })}
          </h2>
          <h1 className="text-[#29294b] text-[28px] font-bold">
            {t({ en: 'Organization Structure', id: 'Struktur Organisasi' })}
          </h1>
        </div>

        <div>
          <h3 className={`text-xl font-bold text-[#29294b] mt-8 mb-4 ${isVisible ? 'animate-fade-in-up animate-delay-100' : 'opacity-0'}`}>
            {t({ en: 'Supervisory Board', id: 'Dewan Pengawas' })}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {supervisoryBoard.map((member, index) => (
              <div 
                key={index} 
                className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="relative rounded-lg overflow-hidden mb-4" style={{ width: '100%', height: '250px' }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="font-bold text-[#29294b] mb-1">{member.name}</h3>
                <span className="text-sm text-[#29294b]">{member.position[language]}</span>
              </div>
            ))}
          </div>

          <h3 className={`text-xl font-bold text-[#29294b] mt-12 mb-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '500ms' }}>
            {t({ en: 'Executive Board', id: 'Dewan Pengurus' })}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {executiveBoard.map((member, index) => (
              <div 
                key={index} 
                className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 6) * 100}ms` }}
              >
                <div className="relative rounded-lg overflow-hidden mb-4" style={{ width: '100%', height: '250px' }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="font-bold text-[#29294b] mb-1">{member.name}</h3>
                <span className="text-sm text-[#29294b]">{member.position[language]}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8">
            {executiveBoardExtended.map((member, index) => (
              <div 
                key={index} 
                className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 11) * 100}ms` }}
              >
                <div className="relative rounded-lg overflow-hidden mb-4" style={{ width: '100%', height: '250px' }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="font-bold text-[#29294b] mb-1">{member.name}</h3>
                <span className="text-sm text-[#29294b]">{member.position[language]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
