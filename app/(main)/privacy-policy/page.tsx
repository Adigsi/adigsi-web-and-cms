import { PrivacyPolicyBanner } from '@/components/privacy-policy-banner'
import { PrivacyPolicyContent } from '@/components/privacy-policy-content'

export const metadata = {
  title: 'Privacy Policy - ADIGSI',
  description: 'Privacy Policy describing how ADIGSI collects, uses, and protects your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PrivacyPolicyBanner />
      <PrivacyPolicyContent />
    </>
  )
}
