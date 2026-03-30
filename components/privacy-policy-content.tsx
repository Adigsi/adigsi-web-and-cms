'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

export function PrivacyPolicyContent() {
  const { language } = useLanguage()
  const [content, setContent] = useState({ contentEn: '', contentId: '' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/cms/privacy-policy')
        if (response.ok) {
          const data = await response.json()
          setContent({ contentEn: data.contentEn || '', contentId: data.contentId || '' })
        }
      } catch (error) {
        console.error('Error fetching privacy-policy content:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [])

  const html = language === 'en' ? content.contentEn : content.contentId

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded w-full" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!html) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <p className="text-muted-foreground text-center">
            {language === 'en'
              ? 'Content coming soon.'
              : 'Konten segera hadir.'}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div
          className="article-content text-foreground/90 leading-[1.85] text-[1.0625rem]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  )
}
