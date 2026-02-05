import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

export function NewsSection() {
  const newsItems = [
    {
      image: '/images/news-1.jpg',
      title: 'ADIGSI Cybersecurity Summit 2025',
      date: 'January 15, 2025',
      excerpt: 'Join us for the biggest cybersecurity conference in Indonesia, featuring industry leaders and experts.',
      link: '#'
    },
    {
      image: '/images/news-2.jpg',
      title: 'New Partnership with Government Agencies',
      date: 'January 10, 2025',
      excerpt: 'ADIGSI strengthens collaboration with key government institutions to enhance national cyber resilience.',
      link: '#'
    },
    {
      image: '/images/news-3.jpg',
      title: 'Digital Transformation Training Program',
      date: 'January 5, 2025',
      excerpt: 'Launching comprehensive training programs to upskill cybersecurity professionals across Indonesia.',
      link: '#'
    }
  ]

  return (
    <section id="news" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              NEWS & ARTICLES
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">Latest News from ADIGSI</h2>
          </div>
          <Button variant="outline" className="hidden md:flex bg-transparent">
            See All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.excerpt}
                </p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button variant="link" className="p-0" asChild>
                  <Link href={item.link}>
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline">
            See All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
