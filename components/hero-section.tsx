'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

export function HeroSection() {
  const { t } = useLanguage()
  return (
    <div
      className="relative flex items-center justify-center min-h-[1110px] w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/images/image-hero-banner.webp")',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      
      <section className="relative z-10 max-w-[1240px] px-4 md:px-8 lg:px-[131px] py-20">
        <div className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-12">
          <h1 className="text-[#FFB703] uppercase text-xl md:text-2xl font-semibold mb-4">
            {t({ en: 'WELCOME TO ADIGSI', id: 'SELAMAT DATANG DI ADIGSI' })}
          </h1>
          
          <h2 className="text-5xl md:text-7xl lg:text-[88px] text-white font-bold mb-4 leading-tight">
            {t({ 
              en: "Safeguarding Indonesia's Digital Future", 
              id: 'Mengamankan Masa Depan Digital Indonesia' 
            })}
          </h2>
          
          <p className="text-white text-base md:text-lg leading-[27px] max-w-[75%] mx-auto mb-8">
            {t({ 
              en: 'Becoming a key pillar in building and strengthening a resilient, innovative, and sustainable cybersecurity ecosystem in Indonesia.',
              id: 'Menjadi pilar utama dalam membangun dan memperkuat ekosistem keamanan siber yang tangguh, inovatif, dan berkelanjutan di Indonesia.'
            })}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 items-center mt-8">
            <Link
              href="/about"
              className="bg-[#3350E6] border border-[#29294b] rounded-[10px] px-6 py-4 no-underline transition-all hover:bg-[#2a40c0]"
            >
              <span className="font-semibold text-white">
                {t({ en: 'About Us', id: 'Tentang Kami' })}
              </span>
            </Link>
            
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLScG1BWquhT9vpcgMfHeJy0ummlZOQXhUAxtYXxSmkNTdUDr6g/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#3350E6] rounded-[10px] px-6 py-4 no-underline transition-all hover:bg-[#3350E6]/10"
            >
              <span className="font-semibold text-white">
                {t({ en: 'Join Now', id: 'Bergabung Sekarang' })}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
