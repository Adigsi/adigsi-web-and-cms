'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export function WelcomeSection() {
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
    <section ref={sectionRef} className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-[131px] py-20 w-full">
      <div className={`flex flex-col items-center justify-center text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
          Welcome to Adigsi
        </h2>
        <h1 className="text-[#29294b] text-2xl md:text-[28px] font-bold">
          Indonesian Digitalization and Cybersecurity Association
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
        {/* Card 1 - Firlie H. Ganinduto */}
        <div className={`bg-white shadow-sm max-w-[500px] w-full flex flex-col justify-between border border-gray-200 rounded-2xl p-6 transition-all duration-1000 hover:shadow-md ${isVisible ? 'animate-fade-in-up animate-delay-100' : 'opacity-0'}`}>
          <p className="italic text-base leading-[25.6px] text-[#333333] mb-8">
            &quot;Sebagai perwakilan dunia usaha nasional, kebutuhan yang tinggi
            untuk keamanan siber sangat dibutuhkan agar tidak menganggu
            business process. Maka ADIGSI hadir untuk memperkuat keamanan
            siber nasional demi melindungi berbagai kepentingan industri&quot;
          </p>
          <div className="flex items-center">
            <Image
              alt="Firlie H. Ganinduto"
              src="/images/firlie.png"
              width={48}
              height={48}
              className="rounded-full object-cover mr-3"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base text-black">
                Firlie H. Ganinduto
              </span>
              <span className="text-[13.6px] text-[#555555]">
                Ketua Umum ADIGSI
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 - Slamet Aji Pamungkas */}
        <div className={`bg-white shadow-sm max-w-[500px] w-full flex flex-col justify-between border border-gray-200 rounded-2xl p-6 transition-all duration-1000 hover:shadow-md ${isVisible ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'}`}>
          <p className="italic text-base leading-[25.6px] text-[#333333] mb-8">
            Sinergi antara pemerintah, pelaku usaha, dan sektor swasta sangat
            diperlukan untuk memperkuat ekosistem keamanan siber kita. ADIKSI
            diharapkan menjadi platform penting untuk berbagi pengetahuan,
            memperkuat koordinasi antara sektor industri dan pemerintah, serta
            meningkatkan respons terhadap ancaman siber yang semakin canggih
          </p>
          <div className="flex items-center">
            <Image
              alt="Slamet Aji Pamungkas"
              src="/images/slamet.png"
              width={48}
              height={48}
              className="rounded-full object-cover mr-3"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base text-black">
                Slamet Aji Pamungkas
              </span>
              <span className="text-[13.6px] text-[#555555]">
                Ketua Dewan Pengawas ADIGSI
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
