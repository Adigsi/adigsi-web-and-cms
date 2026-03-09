'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CarousellTab } from './_tabs/carousell-tab'
import { BannerTab } from './_tabs/banner-tab'
import { WelcomeTab } from './_tabs/welcome-tab'
import { ReportTab } from './_tabs/report-tab'
import { FooterTab } from './_tabs/footer-tab'
import { FloatingTab } from './_tabs/floating-tab'

export default function CMSHomePage() {
  const { t } = useLanguage()
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(new Set(['carousell']))

  const handleTabChange = (value: string) => {
    setMountedTabs((prev) => new Set([...prev, value]))
  }

  return (
    <Tabs defaultValue="carousell" onValueChange={handleTabChange} className="h-full">
      <div className="sticky top-16 md:top-0 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 pt-4 pb-3 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'Home Page Management', id: 'Manajemen Halaman Home' })}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t({ en: 'Manage content sections for the Home page', id: 'Kelola konten section untuk halaman Home' })}
        </p>
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-primary/10 p-1 rounded-md mt-3">
          <TabsTrigger value="carousell">{t({ en: 'Carousell', id: 'Carousell' })}</TabsTrigger>
          <TabsTrigger value="banner">{t({ en: 'Hero Banner', id: 'Banner Hero' })}</TabsTrigger>
          <TabsTrigger value="welcome">{t({ en: 'Welcome', id: 'Welcome' })}</TabsTrigger>
          <TabsTrigger value="report">{t({ en: 'Report', id: 'Laporan' })}</TabsTrigger>
          <TabsTrigger value="footer">{t({ en: 'Footer', id: 'Footer' })}</TabsTrigger>
          <TabsTrigger value="floating">{t({ en: 'Floating Buttons', id: 'Tombol Melayang' })}</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="carousell">
        {mountedTabs.has('carousell') && <CarousellTab />}
      </TabsContent>
      <TabsContent value="banner">
        {mountedTabs.has('banner') && <BannerTab />}
      </TabsContent>
      <TabsContent value="welcome">
        {mountedTabs.has('welcome') && <WelcomeTab />}
      </TabsContent>
      <TabsContent value="report">
        {mountedTabs.has('report') && <ReportTab />}
      </TabsContent>
      <TabsContent value="footer">
        {mountedTabs.has('footer') && <FooterTab />}
      </TabsContent>
      <TabsContent value="floating">
        {mountedTabs.has('floating') && <FloatingTab />}
      </TabsContent>
    </Tabs>
  )
}

