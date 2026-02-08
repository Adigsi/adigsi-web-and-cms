import { NewsBanner } from '@/components/news-banner'
import { NewsListSection } from '@/components/news-list-section'

export const metadata = {
  title: 'Latest News - ADIGSI',
  description: 'Stay updated with the latest news and updates from ADIGSI',
}

export default function NewsPage() {
  return (
    <>
      <NewsBanner />
      <NewsListSection />
    </>
  )
}
