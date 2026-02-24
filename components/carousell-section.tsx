'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface CarousellSlide {
  image: string
  link?: string
  published?: boolean
}

interface CarousellData {
  slides: CarousellSlide[]
}

const fallbackSlides: CarousellSlide[] = [
  {
    image: '/images/hero-background.webp',
    link: '',
    published: true,
  },
  {
    image: '/images/cybersecurity-hero.jpg',
    link: '',
    published: true,
  },
  {
    image: '/images/image-hero-banner.webp',
    link: '',
    published: true,
  },
]

export function CarousellSection() {
  const [carousellData, setCarousellData] = useState<CarousellData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  useEffect(() => {
    const fetchCarousellData = async () => {
      try {
        const response = await fetch('/api/cms/home/carousell')
        if (response.ok) {
          const data = await response.json()
          setCarousellData({
            slides: Array.isArray(data.slides) ? data.slides : [],
          })
          return
        }
      } catch (error) {
        console.error('Error fetching carousell data:', error)
      } finally {
        setIsLoading(false)
      }

      setCarousellData({ slides: fallbackSlides })
    }

    fetchCarousellData()
  }, [])

  const visibleSlides = (carousellData?.slides || []).filter(
    (slide) => slide.published && slide.image && slide.image.trim().length > 0
  )
  const slidesCount = visibleSlides.length

  useEffect(() => {
    if (!carouselApi || slidesCount < 2) return

    const intervalId = window.setInterval(() => {
      carouselApi.scrollNext()
    }, 5000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [carouselApi, slidesCount])

  if (isLoading || !carousellData || visibleSlides.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <Carousel
          opts={{
            loop: true,
          }}
          setApi={setCarouselApi}
          className="w-full"
        >
          <CarouselContent>
            {visibleSlides.map((slide, index) => {
              const link = slide.link?.trim()
              const isExternal = link ? /^https?:\/\//.test(link) : false
              const slideContent = (
                <div className="relative h-55 md:h-75 lg:h-90 w-full overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={slide.image}
                    alt="Carousel banner"
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              )

              return (
                <CarouselItem key={index}>
                  {link ? (
                    <Link
                      href={link}
                      className="block h-full w-full"
                      aria-label="Carousel banner link"
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                    >
                      {slideContent}
                    </Link>
                  ) : (
                    slideContent
                  )}
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="left-3 md:left-4 text-foreground border-border bg-card hover:bg-muted" />
          <CarouselNext className="right-3 md:right-4 text-foreground border-border bg-card hover:bg-muted" />
        </Carousel>
      </div>
    </div>
  )
}
