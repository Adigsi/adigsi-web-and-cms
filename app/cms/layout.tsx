import React from 'react'
import type { Metadata } from 'next'
import { CMSLayoutShell } from '@/components/cms-layout-shell'

export const metadata: Metadata = {
  title: 'CMS - ADIGSI',
  description: 'Content Management System for ADIGSI',
}

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CMSLayoutShell>{children}</CMSLayoutShell>
}
