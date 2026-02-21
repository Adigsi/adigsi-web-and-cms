'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const slides = [
  {
    image: '/images/hero-background.webp',
    titleEn: 'Strengthening Indonesia Digital Security',
    titleId: 'Memperkuat Keamanan Digital Indonesia',
  },
  {
    image: '/images/cybersecurity-hero.jpg',
    titleEn: 'Building Collaboration Across the Industry',
    titleId: 'Membangun Kolaborasi Antar Industri',
  },
  {
    image: '/images/image-hero-banner.webp',
    titleEn: 'Driving Innovation for National Resilience',
    titleId: 'Mendorong Inovasi untuk Ketahanan Nasional',
  },
]

export function CarousellSection() {
  const { language } = useLanguage()

  return (
    <section className="w-full bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-32 py-6 md:py-8">
        <Carousel
          opts={{
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-55 md:h-75 lg:h-90 w-full overflow-hidden rounded-2xl">
                  <Image
                    src={slide.image}
                    alt={language === 'en' ? slide.titleEn : slide.titleId}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="absolute inset-0 flex items-end p-6 md:p-8">
                    <h2 className="text-white text-xl md:text-3xl font-bold max-w-3xl leading-tight">
                      {language === 'en' ? slide.titleEn : slide.titleId}
                    </h2>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-3 md:left-4 text-white border-white/40 bg-black/35 hover:bg-black/55" />
          <CarouselNext className="right-3 md:right-4 text-white border-white/40 bg-black/35 hover:bg-black/55" />
        </Carousel>
      </div>
    </section>
  )
}
