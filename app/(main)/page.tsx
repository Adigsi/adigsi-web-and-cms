import { HeroSection } from '@/components/hero-section'
import { WelcomeSection } from '@/components/welcome-section'
import { LatestNewsSection } from '@/components/latest-news-section'
import { IndustryReportSection } from '@/components/industry-report-section'
import { AgendaSection } from '@/components/agenda-section'
import { AboutAdigsiSection, PartnersSection } from '@/components/about-adigsi-section'
import { CarousellSection } from '@/components/carousell-section'

export default function Home() {
  return (
    <>
      <CarousellSection />
      <HeroSection />
      <WelcomeSection />
      <LatestNewsSection />
      <IndustryReportSection />
      <AgendaSection />
      <AboutAdigsiSection />
      <PartnersSection />
    </>
  )
}
