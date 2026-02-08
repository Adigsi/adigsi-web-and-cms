import { RegisterBanner } from '@/components/register-banner'
import { MembershipCategorySection } from '@/components/membership-category-section'
import { JoinAdigsiSection } from '@/components/join-adigsi-section'

export const metadata = {
  title: 'Register - ADIGSI',
  description: 'Join ADIGSI and be part of Indonesia\'s leading cybersecurity and digital transformation network',
}

export default function RegisterPage() {
  return (
    <>
      <RegisterBanner />
      <MembershipCategorySection />
      <JoinAdigsiSection />
    </>
  )
}
