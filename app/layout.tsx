import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { LanguageProvider } from '@/contexts/language-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

export const metadata: Metadata = {
  title: 'ADIGSI - Indonesian Association for Digitalization and Cybersecurity',
  description: 'Becoming a key pillar in building and strengthening a resilient, innovative, and sustainable cybersecurity ecosystem in Indonesia.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        {umamiWebsiteId ? (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        ) : null}
        <Analytics />
      </body>
    </html>
  )
}
