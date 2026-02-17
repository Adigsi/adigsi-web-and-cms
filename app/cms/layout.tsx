import React from "react"
import type { Metadata } from 'next'

import { CMSLogoutButton } from '@/components/cms-logout-button'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'CMS - ADIGSI',
  description: 'Content Management System for ADIGSI',
}

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* CMS Header/Sidebar dapat ditambahkan di sini */}
      <div className="flex">
        {/* Sidebar untuk CMS */}
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
          <div className="p-6">
            <h1 className="text-xl font-bold text-primary">ADIGSI CMS</h1>
          </div>
          <nav className="px-4">
            <ul className="space-y-2">
              <li>
                <a href="/cms/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/cms/news" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  News
                </a>
              </li>
              <li>
                <a href="/cms/events" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Events
                </a>
              </li>
              <li>
                <a href="/cms/partners" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Partners
                </a>
              </li>
              <li>
                <a href="/cms/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content Area */}
        <div className="ml-64 flex-1">
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">Content Management</h2>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                  Profile
                </Button>
                <CMSLogoutButton />
              </div>
            </div>
          </header>
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
