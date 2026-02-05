import { AboutBanner } from '@/components/about-banner'
import { OrganizationStructureSection } from '@/components/organization-structure-section'
import { AboutAdigsiSection } from '@/components/about-adigsi-section'

export const metadata = {
  title: 'Tentang Kami - ADIGSI',
  description: 'Learn more about Indonesian Association for Digitalization and Cybersecurity (ADIGSI)',
}

export default function AboutPage() {
  return (
    <>
      <OrganizationStructureSection />
      <AboutBanner />
      <AboutAdigsiSection />
    </>
  )
}
