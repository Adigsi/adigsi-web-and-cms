import React from "react"
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
