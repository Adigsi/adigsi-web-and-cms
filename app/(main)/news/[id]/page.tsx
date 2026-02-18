'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface NewsData {
  _id: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  contentEn: string
  contentId: string
  image: string
  readTimeEn: string
  readTimeId: string
  sourceUrl?: string
  published: boolean
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { language, t } = useLanguage()
  const [article, setArticle] = useState<NewsData | null>(null)
  const [relatedNews, setRelatedNews] = useState<NewsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newsId, setNewsId] = useState<string>('')

  useEffect(() => {
    params.then(({ id }) => {
      setNewsId(id)
    })
  }, [params])

  useEffect(() => {
    if (!newsId) return

    const fetchNewsDetail = async () => {
      setIsLoading(true)
      try {
        // Fetch all news to find the current one and get related
        const response = await fetch('/api/cms/news/news?page=1')
        const data = await response.json()

        if (data.success) {
          const publishedNews = data.data.filter((item: NewsData) => item.published)
          const currentNews = publishedNews.find((item: NewsData) => item._id === newsId)

          if (!currentNews) {
            notFound()
            return
          }

          setArticle(currentNews)
          
          // Get 3 related news (excluding current)
          const related = publishedNews
            .filter((item: NewsData) => item._id !== newsId)
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
  }, [newsId])

  if (isLoading) {
    return (
      <div className="max-w-[1240px] mx-auto px-5 py-20 mt-12 text-center">
        <p className="text-muted-foreground">
          {language === 'en' ? 'Loading...' : 'Memuat...'}
        </p>
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  return (
    <>
      {/* Article Content */}
      <section className="max-w-[1240px] mx-auto px-5 py-20 mt-12">
        <div className="flex flex-col items-center mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <div className="bg-white shadow-sm rounded-lg px-3 py-1">
              <span className="text-xs font-semibold text-[#29294b]">
                {language === 'en' ? article.categoryEn : article.categoryId}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#29294b] text-center mb-4 max-w-4xl">
            {language === 'en' ? article.titleEn : article.titleId}
          </h1>

          {/* Featured Image */}
          <div className="relative w-full max-w-[800px] h-[400px] my-4">
            <Image
              src={article.image}
              alt={language === 'en' ? article.titleEn : article.titleId}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-[#29294b]">
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {language === 'en' ? article.contentEn : article.contentId}
          </div>
        </div>

        {/* Source Link */}
        {article.sourceUrl && (
          <div className="mt-8">
            <p className="text-[#29294b] mb-2">
              {language === 'en' 
                ? 'For more details, please read at:' 
                : 'Untuk selengkapnya silahkan baca di:'}
            </p>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-secondary transition-colors break-all"
            >
              {article.sourceUrl}
            </a>
          </div>
        )}
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-5 pb-20">
          <h2 className="text-2xl font-bold text-[#29294b] mb-4">
            {language === 'en' ? 'Read Also' : 'Baca Juga'}
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {relatedNews.map((news) => (
              <Link
                key={news._id}
                href={`/news/${news._id}`}
                className="flex flex-col bg-white rounded-xl min-w-[300px] max-w-[300px] hover:shadow-lg transition-all duration-200 no-underline"
              >
                <div className="relative">
                  <div className="relative w-full h-[180px]">
                    <Image
                      src={news.image}
                      alt={language === 'en' ? news.titleEn : news.titleId}
                      fill
                      className="object-cover rounded-t-xl"
                    />
                  </div>
                  <div className="absolute bottom-3 left-6 bg-white shadow-sm rounded-lg px-2.5 py-1">
                    <span className="text-xs font-semibold text-[#29294b]">
                      {language === 'en' ? news.categoryEn : news.categoryId}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col p-4">
                  <h3 className="text-base font-bold text-black mb-4 line-clamp-2">
                    {language === 'en' ? news.titleEn : news.titleId}
                  </h3>
                  <div className="flex justify-between text-xs text-[#555]">
                    <span>{language === 'en' ? news.readTimeEn : news.readTimeId}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
