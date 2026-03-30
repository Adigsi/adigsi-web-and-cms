import { TermsConditionsBanner } from '@/components/terms-conditions-banner'
import { TermsConditionsContent } from '@/components/terms-conditions-content'

export const metadata = {
  title: 'Terms & Conditions - ADIGSI',
  description: 'Terms and Conditions for using ADIGSI services and website.',
}

export default function TermsConditionsPage() {
  return (
    <>
      <TermsConditionsBanner />
      <TermsConditionsContent />
    </>
  )
}
