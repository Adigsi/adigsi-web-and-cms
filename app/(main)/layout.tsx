import React from "react"
import Script from 'next/script'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface MainLayoutProps {
  children: React.ReactNode
}

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      {umamiWebsiteId ? (
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id={umamiWebsiteId}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  )
}
