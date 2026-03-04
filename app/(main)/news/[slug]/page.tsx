'use client'

import Image from 'next/image'
import { notFound } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { NewsCard, type NewsData } from '@/components/news-card'

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { language } = useLanguage()
  const [article, setArticle] = useState<NewsData | null>(null)
  const [relatedNews, setRelatedNews] = useState<NewsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newsSlug, setNewsSlug] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)
  const articleRef = useRef<HTMLElement>(null)
  const relatedRef = useRef<HTMLElement>(null)
  const [relatedVisible, setRelatedVisible] = useState(false)

  useEffect(() => {
    params.then(({ slug }) => setNewsSlug(slug))
  }, [params])

  useEffect(() => {
    if (!newsSlug) return
    const fetchNewsDetail = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/cms/news/news?page=1')
        const data = await response.json()
        if (data.success) {
          const publishedNews = data.data.filter((item: NewsData) => item.published)
          const currentNews = publishedNews.find((item: NewsData) => item.slug === newsSlug)
          if (!currentNews) notFound()
          setArticle(currentNews)
          const related = publishedNews
            .filter((item: NewsData) => item._id !== currentNews._id)
            .slice(0, 3)
          setRelatedNews(related)
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNewsDetail()
  }, [newsSlug])

  // Article section observer
  useEffect(() => {
    if (isLoading || !articleRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.05 }
    )
    observer.observe(articleRef.current)
    return () => observer.disconnect()
  }, [isLoading])

  // Related section observer
  useEffect(() => {
    if (!relatedRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRelatedVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(relatedRef.current)
    return () => observer.disconnect()
  }, [relatedNews])

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-background">
        {/* Dot-grid */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-32 mt-12">
          {/* Skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-5 bg-muted rounded w-24 mx-auto" />
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-80 bg-muted rounded-xl w-full mt-8" />
            <div className="space-y-3 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-4 bg-muted rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) notFound()

  const title = language === 'en' ? article.titleEn : article.titleId
  const category = language === 'en' ? article.categoryEn : article.categoryId
  const content = language === 'en' ? article.contentEn : article.contentId

  return (
    <div className="relative min-h-screen bg-background">
      {/* Dot-grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.1] dark:opacity-[0.2]"
        style={{ backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
      />

      {/* Ambient glows */}
      <div className="pointer-events-none fixed top-0 right-0 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-96 h-96 rounded-full bg-accent/4 dark:bg-accent/8 blur-[120px]" />

      {/* ── Article Section ── */}
      <section ref={articleRef} className="relative pt-28 pb-16">
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col items-center">

          {/* Header */}
          <div className={`flex flex-col items-center text-center mb-10 transition-all duration-700 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-15'}`}>

            {/* Category badge */}
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                {category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-3xl">
              {title}
            </h1>

            {/* Gradient underline */}
            <div className="mt-4 h-px w-24 bg-linear-to-r from-primary to-accent" />
          </div>

          {/* Featured Image */}
          <div
            className={`relative w-full max-w-4xl overflow-hidden rounded-xl border border-border mb-10 transition-all duration-700 delay-150 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-15'}`}
            style={{ height: '420px' }}
          >
            {/* Corner brackets */}
            {/* <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-accent/50 z-10" />
            <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary/40 z-10" />
            <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/40 z-10" />
            <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-accent/50 z-10" /> */}

            {/* Top scan-line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent z-10" />

            <Image
              src={article.image || '/placeholder.svg'}
              alt={title}
              fill
              className="object-cover"
              priority
            />

            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-background/30 via-transparent to-transparent" />
          </div>

          {/* Article body */}
          <div
            className={`relative transition-all duration-700 delay-300 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-15'}`}
          >
            {/* Card frame */}
            <div className="relative rounded-xl border border-border bg-card px-6 py-8 md:px-10 md:py-10 shadow-sm">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
              {/* Left bracket */}
              <span className="absolute top-4 left-4 w-4 h-4 border-t border-l border-primary/20" />

              <div
                className="article-content prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Related News ── */}
      {relatedNews.length > 0 && (
        <section
          ref={relatedRef}
          className="relative py-16 border-t border-border bg-secondary/40 dark:bg-secondary/20"
        >
          {/* Line-grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.12]"
            style={{
              backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            {/* Section header */}
            <div className={`mb-8 transition-all duration-700 ${relatedVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  {language === 'en' ? 'Read Also' : 'Baca Juga'}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {language === 'en' ? 'Related Articles' : 'Artikel Terkait'}
              </h2>
              <div className="mt-2 h-px w-12 bg-linear-to-r from-primary to-accent" />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((news, index) => (
                <NewsCard
                  key={news._id}
                  article={news}
                  index={index}
                  animClass={relatedVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-[60px]'}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
