import { MembersBanner } from '@/components/members-banner'
import { MemberCategoriesSection } from '@/components/member-categories-section'
import { DigitalMemberCategoriesSection } from '@/components/digital-member-categories-section'

export const metadata = {
  title: 'ADIGSI Members - ADIGSI',
  description: 'Explore ADIGSI cybersecurity community members across various security domains',
}

export default function MembersPage() {
  return (
    <>
      <MembersBanner />
      <MemberCategoriesSection />
      <DigitalMemberCategoriesSection />
    </>
  )
}
