'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import type { NewsData } from '@/components/news-card'
import { ImagePreviewModal } from '@/components/image-preview-modal'

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
  const [readingProgress, setReadingProgress] = useState(0)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    params.then(({ slug }) => setNewsSlug(slug))
  }, [params])

  useEffect(() => {
    if (!newsSlug) return
    const fetchNewsDetail = async () => {
      setIsLoading(true)
      try {
        // Fetch the article directly by slug (works regardless of pagination)
        const response = await fetch(`/api/cms/news/news?slug=${encodeURIComponent(newsSlug)}`)
        const data = await response.json()
        if (data.success && data.data && data.data.published) {
          setArticle(data.data)
          // Fetch a few recent articles for the related section
          const relatedRes = await fetch('/api/cms/news/news?page=1&published=true')
          const relatedData = await relatedRes.json()
          if (relatedData.success) {
            const related = (relatedData.data as NewsData[])
              .filter((item) => item._id !== data.data._id)
              .slice(0, 3)
            setRelatedNews(related)
          }
        } else {
          notFound()
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

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(100, Math.max(0, ((vh - top) / (height + vh)) * 100))
      setReadingProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-background">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-32 mt-12">
          <div className="animate-pulse space-y-6">
            <div className="h-5 bg-muted rounded w-24 mx-auto" />
            <div className="h-8 bg-muted rounded-xl w-3/4 mx-auto" />
            <div className="h-px bg-muted rounded w-full mt-4" />
            <div className="flex gap-4 justify-center">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-4 bg-muted rounded w-16" />
              <div className="h-4 bg-muted rounded w-24" />
            </div>
            <div className="h-80 bg-muted rounded-xl w-full mt-8" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 mt-8">
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`h-4 bg-muted rounded ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded-xl" />
                <div className="h-24 bg-muted rounded-xl" />
              </div>
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

  // Computed metadata
  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))
  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
    : ''

  return (
    <div className="relative min-h-screen bg-background">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-100 h-1 bg-border">
        <div
          className="h-full bg-linear-to-r from-primary to-accent transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Dot-grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.1] dark:opacity-[0.2]"
        style={{ backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
      />

      {/* Ambient glows */}
      <div className="pointer-events-none fixed top-0 right-0 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-96 h-96 rounded-full bg-accent/4 dark:bg-accent/8 blur-[120px]" />

      {/* ── Article Section ── */}
      <section ref={articleRef} className="relative pt-28 pb-20">
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

          {/* ─ Editorial Header ─ */}
          <header className={`mb-10 transition-all duration-700 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-15'}`}>

            {/* Back link */}
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'en' ? 'Back to News' : 'Kembali ke Berita'}
            </Link>

            {/* Category + meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{category}</span>
              </div>
              {formattedDate && (
                <span className="text-xs font-mono text-muted-foreground">{formattedDate}</span>
              )}
              <span className="hidden sm:block text-border">|</span>
              <span className="text-xs font-mono text-muted-foreground">
                {readTime} {language === 'en' ? 'min read' : 'menit baca'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              {title}
            </h1>

            {/* Ruled divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <div className="h-px w-8 bg-primary" />
            </div>
          </header>

          {/* ─ Featured Image ─ */}
          <div className={`group relative w-full overflow-hidden rounded-xl border border-border mb-10 transition-all duration-700 delay-150 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-15'}`}
            style={{ height: '420px' }}
          >
            <Image
              src={article.image || '/placeholder.svg'}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
            {/* Scan-line overlay */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)' }}
            />
            {/* Preview button */}
            <button
              onClick={() => setPreviewImage({ src: article.image || '/placeholder.svg', alt: title })}
              aria-label="Preview image"
              className="cursor-pointer absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            >
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest bg-card/90 border border-primary/40 text-primary backdrop-blur-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Preview
              </span>
            </button>
            {/* Corner brackets */}
            <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/60 z-10" />
            <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary/60 z-10" />
            <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/60 z-10" />
            <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary/60 z-10" />
            {/* Bottom gradient caption bar */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/60 to-transparent flex items-end px-5 pb-3 z-10">
              <span className="text-[11px] font-mono text-white/70 uppercase tracking-widest">{category} — ADIGSI</span>
            </div>
          </div>

          {/* ─ Article Grid: Content + Sidebar ─ */}
          <div className={`grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 transition-all duration-700 delay-300 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-15'}`}>

            {/* ── Main Article Body ── */}
            <article className="min-w-0">
              {/* Top left rule accent */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary/70">
                  {language === 'en' ? 'Article' : 'Artikel'}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Article content */}
              <div
                className="article-content text-foreground/90 leading-[1.85] text-[1.0625rem]"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* End mark */}
              <div className="mt-10 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <div className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-primary/40" />
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span className="w-1 h-1 rounded-full bg-primary/40" />
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Tags / footer row */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mr-1">
                  {language === 'en' ? 'Category:' : 'Kategori:'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-secondary/50 text-[11px] font-mono text-foreground/70">
                  {category}
                </span>
              </div>
            </article>

            {/* ── Sidebar ── */}
            <aside className="lg:sticky lg:top-24 self-start space-y-4">

              {/* Related Articles */}
              {relatedNews.length > 0 && (
                <div className="relative rounded-xl border border-border bg-card overflow-hidden">
                  {/* Top accent bar */}
                  <div className="h-px w-full bg-linear-to-r from-transparent via-primary/50 to-transparent" />
                  <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-primary/30" />

                  <div className="px-5 pt-5 pb-3">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary/70">
                        {language === 'en' ? 'Related Articles' : 'Artikel Terkait'}
                      </p>
                    </div>

                    {/* Compact article list */}
                    <div className="space-y-0">
                      {relatedNews.map((news, index) => {
                        const newsTitle = language === 'en' ? news.titleEn : news.titleId
                        const newsCategory = language === 'en' ? news.categoryEn : news.categoryId
                        return (
                          <Link
                            key={news._id}
                            href={`/news/${news.slug}`}
                            className="group flex gap-3 py-3.5 border-b border-border last:border-b-0 hover:bg-primary/5 -mx-5 px-5 transition-colors duration-200"
                          >
                            {/* Thumbnail */}
                            <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted">
                              <Image
                                src={news.image || '/placeholder.svg'}
                                alt={newsTitle}
                                fill
                                className="object-cover"
                              />
                              {/* Scan-line */}
                              <div className="absolute inset-0 pointer-events-none"
                                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)' }}
                              />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col justify-center gap-1 min-w-0">
                              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-primary/70">
                                {newsCategory}
                              </span>
                              <p className="text-xs font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors duration-200">
                                {newsTitle}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />
                </div>
              )}

              {/* Back to news */}
              <Link
                href="/news"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-border bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {language === 'en' ? 'All Articles' : 'Semua Artikel'}
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* Article body prose styles */}
      <style>{`
        .article-content p {
          margin-bottom: 1.5em;
        }
        .article-content p:first-of-type::first-letter {
          float: left;
          font-size: 3.5em;
          line-height: 0.85;
          margin-right: 0.12em;
          margin-top: 0.05em;
          font-weight: 800;
          color: var(--color-primary);
          font-family: serif;
        }
        .article-content h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 2em 0 0.75em;
          padding-left: 0.85em;
          border-left: 3px solid var(--color-primary);
          letter-spacing: -0.01em;
        }
        .article-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-foreground);
          margin: 1.75em 0 0.6em;
          padding-left: 0.85em;
          border-left: 2px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
        }
        .article-content blockquote {
          position: relative;
          margin: 2em 0;
          padding: 1.25em 1.5em 1.25em 1.75em;
          border-left: 3px solid var(--color-primary);
          background: color-mix(in srgb, var(--color-primary) 5%, transparent);
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic;
          color: color-mix(in srgb, var(--color-foreground) 80%, transparent);
        }
        .article-content blockquote::before {
          content: '"';
          position: absolute;
          top: -0.2em;
          left: 0.5em;
          font-size: 3em;
          color: var(--color-primary);
          opacity: 0.25;
          font-family: serif;
          line-height: 1;
        }
        .article-content ul {
          margin: 1.25em 0 1.5em;
          padding-left: 1.5em;
          list-style: none;
        }
        .article-content ul li {
          position: relative;
          padding-left: 1.25em;
          margin-bottom: 0.6em;
        }
        .article-content ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.6em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-primary);
        }
        .article-content ol {
          margin: 1.25em 0 1.5em;
          padding-left: 1.75em;
          counter-reset: list;
          list-style: none;
        }
        .article-content ol li {
          position: relative;
          padding-left: 0.5em;
          margin-bottom: 0.6em;
          counter-increment: list;
        }
        .article-content ol li::before {
          content: counter(list) ".";
          position: absolute;
          left: -1.5em;
          color: var(--color-primary);
          font-weight: 700;
          font-family: monospace;
          font-size: 0.85em;
        }
        .article-content a {
          color: var(--color-primary);
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 500;
        }
        .article-content a:hover {
          opacity: 0.8;
        }
        .article-content code {
          font-family: monospace;
          font-size: 0.875em;
          background: color-mix(in srgb, var(--color-primary) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
          padding: 0.15em 0.45em;
          border-radius: 0.3em;
          color: var(--color-primary);
        }
        .article-content pre {
          margin: 1.5em 0;
          padding: 1.25em 1.5em;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.875em;
          line-height: 1.6;
        }
        .article-content pre code {
          background: none;
          border: none;
          padding: 0;
        }
        .article-content hr {
          margin: 2em 0;
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent);
        }
        .article-content strong {
          font-weight: 700;
          color: var(--color-foreground);
        }
        .article-content img {
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          max-width: 100%;
          height: auto;
          margin: 1.5em 0;
        }
      `}</style>

      <ImagePreviewModal previewImage={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  )
}
