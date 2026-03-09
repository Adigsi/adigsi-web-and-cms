import { KnowledgeHubBanner } from '@/components/knowledge-hub-banner'
import { KnowledgeHubListSection } from '@/components/knowledge-hub-list-section'

export const metadata = {
  title: 'Knowledge Hub - ADIGSI',
  description: 'Explore and download industry reports and publications from ADIGSI',
}

export default function KnowledgeHubPage() {
  return (
    <>
      <KnowledgeHubBanner />
      <KnowledgeHubListSection />
    </>
  )
}
