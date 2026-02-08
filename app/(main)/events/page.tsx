import { EventsBanner } from '@/components/events-banner'
import { EventsListSection } from '@/components/events-list-section'

export const metadata = {
  title: 'Events - ADIGSI',
  description: 'Explore upcoming cybersecurity events and activities organized by ADIGSI',
}

export default function EventsPage() {
  return (
    <>
      <EventsBanner />
      <EventsListSection />
    </>
  )
}
