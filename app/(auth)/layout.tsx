import React from "react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - ADIGSI CMS',
  description: 'Login to ADIGSI Content Management System',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
