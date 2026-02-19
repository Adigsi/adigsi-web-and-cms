'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

interface JoinSectionData {
  titleEn: string
  titleId: string
  buttonTextEn: string
  buttonTextId: string
  buttonUrl: string
}

export function JoinAdigsiSection() {
  const { language, t } = useLanguage()
  const [joinData, setJoinData] = useState<JoinSectionData>({
    titleEn: 'Join ADIGSI and be part of Indonesia\'s leading cybersecurity and digital transformation network!',
    titleId: 'Bergabunglah dengan ADIGSI dan jadilah bagian dari jaringan keamanan siber dan transformasi digital terkemuka di Indonesia!',
    buttonTextEn: 'Join Now',
    buttonTextId: 'Bergabung Sekarang',
    buttonUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScG1BWquhT9vpcgMfHeJy0ummlZOQXhUAxtYXxSmkNTdUDr6g/viewform?pli=1',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cms/register/join')
        if (response.ok) {
          const data = await response.json()
          setJoinData({
            titleEn: data.titleEn || joinData.titleEn,
            titleId: data.titleId || joinData.titleId,
            buttonTextEn: data.buttonTextEn || 'Join Now',
            buttonTextId: data.buttonTextId || 'Bergabung Sekarang',
            buttonUrl: data.buttonUrl || joinData.buttonUrl,
          })
        }
      } catch (error) {
        console.error('Error fetching join data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <section className="w-full bg-[#f5f6f7] py-20">
      <div className="max-w-310 mx-auto px-5 text-center">
        <h1 className="text-[#29294b] text-[28px] font-bold leading-normal mb-4 sm:mx-10">
          {language === 'en' ? joinData.titleEn : joinData.titleId}
        </h1>
        <Link
          href={joinData.buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#3350e6] text-white font-semibold rounded-[10px] px-6 py-4 mt-4 hover:bg-[#2a42c7] transition-colors no-underline"
        >
          {language === 'en' ? joinData.buttonTextEn : joinData.buttonTextId}
        </Link>
      </div>
    </section>
  )
}
