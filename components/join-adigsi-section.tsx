'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

export function JoinAdigsiSection() {
  const { t } = useLanguage()

  return (
    <section className="w-full bg-[#f5f6f7] py-20">
      <div className="max-w-[1240px] mx-auto px-5 text-center">
        <h1 className="text-[#29294b] text-[28px] font-normal leading-normal mb-4">
          {t({
            en: 'Join ADIGSI and be part of Indonesia\'s leading cybersecurity and digital transformation network!',
            id: 'Bergabunglah dengan ADIGSI dan jadilah bagian dari jaringan keamanan siber dan transformasi digital terkemuka di Indonesia!'
          })}
        </h1>
        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLScG1BWquhT9vpcgMfHeJy0ummlZOQXhUAxtYXxSmkNTdUDr6g/viewform?pli=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#3350e6] text-white font-semibold rounded-[10px] px-6 py-4 mt-4 hover:bg-[#2a42c7] transition-colors no-underline"
        >
          {t({ en: 'Join Now', id: 'Bergabung Sekarang' })}
        </Link>
      </div>
    </section>
  )
}
