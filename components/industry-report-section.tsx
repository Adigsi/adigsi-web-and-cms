'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export function IndustryReportSection() {
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
      className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-[131px] py-20 w-full"
    >
      <div className={`flex flex-col items-center justify-center text-center mb-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
          REPORT
        </h2>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-4 ${isVisible ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
        {/* Image Section */}
        <div className="flex justify-center lg:justify-start">
          <Image
            src="/images/design-mode/report.png"
            alt="Indonesia Cybersecurity Industry Report"
            width={522}
            height={600}
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col">
          <h2 className="text-[32px] font-bold text-[#1f2937] mb-4">
            Indonesia Cybersecurity Industry Report
          </h2>
          
          <p className="text-[#374151] text-base leading-[27.2px] mb-6">
            Kadin's Industry Report and Strategic Guide highlights the need for a strong cybersecurity framework to support Indonesia's digital economy. The report outlines six strategic pillars: cyber resilience, governance, talent development, public-private partnerships, global standards alignment, and industry growth.
          </p>
          
          <p className="text-[#374151] text-base leading-[27.2px] mb-6">
            Despite progress, cyber threats persist. Industry players play a key role in accelerating cybersecurity initiatives, ensuring national security and global competitiveness.
          </p>
          
          <button className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-lg px-6 py-3 shadow-[0_4px_10px_rgba(34,197,94,0.3)] transition-colors duration-300 w-fit">
            Download Here
          </button>
        </div>
      </div>
    </section>
  )
}
