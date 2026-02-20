'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  Globe,
  House,
  Info,
  Newspaper,
  UserPlus,
  Users,
  User,
  Monitor,
  Group,
  ChartLine,
  Menu,
  X,
} from 'lucide-react'

import { CMSLogoutButton } from '@/components/cms-logout-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

import { Separator } from '@/components/ui/separator'

type NavigationItem = {
  label: string
  labelTranslation?: { en: string; id: string }
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavigationItem[]
}

interface NavigationSection {
  title: string
  titleTranslation?: { en: string; id: string }
  items: NavigationItem[]
}

const cmsNavigation: NavigationSection[] = [
  {
    title: 'Analytics',
    titleTranslation: { en: 'Analytics', id: 'Analitik' },
    items: [
      {
        label: 'Dashboard',
        labelTranslation: { en: 'Dashboard', id: 'Dashboard' },
        href: '/cms/dashboard',
        icon: Monitor,
      },
      {
        label: "Visitor Analytics",
        labelTranslation: { en: 'Visitor Analytics', id: 'Analitik Pengunjung' },
        href: '/cms/analytics',
        icon: ChartLine,
      },
    ],
  },
  {
    title: 'Content Management',
    titleTranslation: { en: 'Content Management', id: 'Manajemen Konten' },
    items: [
      {
        label: 'Home',
        labelTranslation: { en: 'Home', id: 'Beranda' },
        href: '/cms/home',
        icon: House,
      },
      {
        label: 'About Us',
        labelTranslation: { en: 'About Us', id: 'Tentang Kami' },
        href: '/cms/about',
        icon: Info,
      },
      {
        label: 'Community',
        labelTranslation: { en: 'Community', id: 'Komunitas' },
        icon: Group,
        children: [
          {
            label: 'Adigsi Members',
            labelTranslation: { en: 'Adigsi Members', id: 'Anggota Adigsi' },
            href: '/cms/members',
            icon: Users,
          },
          {
            label: 'Register',
            labelTranslation: { en: 'Register', id: 'Daftar' },
            href: '/cms/register',
            icon: UserPlus,
          },
        ],
      },
      {
        label: 'Events',
        labelTranslation: { en: 'Events', id: 'Agenda' },
        href: '/cms/events',
        icon: CalendarDays,
      },
      {
        label: 'Latest News',
        labelTranslation: { en: 'Latest News', id: 'Berita Terbaru' },
        href: '/cms/news',
        icon: Newspaper,
      },
    ],
  },
]

export function CMSLayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Community'])
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const languageSelectRef = React.useRef<HTMLSelectElement>(null)

  const isActiveMenu = (href?: string) => {
    if (!href) return false

    if (href === '/cms/dashboard' && pathname === '/cms') {
      return true
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    )
  }

  const renderNavItem = (item: NavigationItem, isChild = false) => {
    const label = item.labelTranslation ? t(item.labelTranslation) : item.label

    if (item.children && item.children.length > 0) {
      const isExpanded = expandedGroups.includes(item.label)
      const Icon = item.icon

      return (
        <div key={item.label} className="relative z-10">
          <button
            onClick={() => toggleGroup(item.label)}
            type="button"
            className={cn(
              'flex w-full rounded-lg py-2.5 text-sm transition-colors cursor-pointer relative z-10',
              isChild
                ? 'pl-8'
                : isSidebarCollapsed
                  ? 'items-center justify-center px-2.5 min-h-10 w-10 h-10 mx-auto'
                  : 'items-center gap-3 px-3',
              'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            title={isSidebarCollapsed ? item.labelTranslation ? t(item.labelTranslation) : item.label : undefined}
          >
            {Icon && <Icon className="size-4 shrink-0" />}
            {!isSidebarCollapsed ? (
              <>
                <span className="flex-1 text-left">{label}</span>
                <svg
                  className={cn(
                    'size-4 transition-transform',
                    isExpanded ? 'rotate-180' : '',
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </>
            ) : null}
          </button>
          {isExpanded && (
            <div className="space-y-1">
              {item.children.map((child) => renderNavItem(child, true))}
            </div>
          )}
        </div>
      )
    }

    if (!item.href) return null

    const Icon = item.icon
    const isActive = isActiveMenu(item.href)

    return (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          'flex rounded-lg py-2.5 text-sm transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          isChild
            ? isSidebarCollapsed
              ? 'items-center justify-center px-2 ml-1'
              : 'pl-8'
            : isSidebarCollapsed
              ? 'items-center justify-center px-2'
              : 'items-center gap-3 px-3',
        )}
        title={isSidebarCollapsed ? label : undefined}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        {!isSidebarCollapsed ? <span>{label}</span> : null}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-screen-2xl relative">
        {/* Mobile topbar */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center px-4 md:hidden z-40">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
          <div className="ml-4">
            <Image
              alt="ADIGSI"
              src="/images/design-mode/logo-adigsi.png"
              width={112}
              height={32}
              priority
              className="h-6 w-auto"
            />
          </div>
        </div>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <aside
          className={cn(
            'fixed left-0 top-0 h-screen border-r border-border bg-card/70 transition-all duration-300 md:flex md:flex-col md:backdrop-blur z-40',
            'md:translate-x-0 bg-white',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            'w-72',
            isSidebarCollapsed && 'md:w-20',
          )}
        >
          <div
            className={cn(
              'border-b border-border',
              'p-4',
              isSidebarCollapsed && 'md:p-2.5',
            )}
          >
            <div
              className={cn(
                'flex items-center gap-2',
                'justify-between',
                isSidebarCollapsed && 'md:justify-center',
              )}
            >
              {!isSidebarCollapsed ? (
                <Link href="/cms/dashboard" className="inline-flex min-w-0 items-center">
                  <Image
                    alt="ADIGSI"
                    src="/images/design-mode/logo-adigsi.png"
                    width={112}
                    height={32}
                    priority
                    className="h-8 w-auto"
                  />
                </Link>
              ) : null}

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="hidden md:inline-flex"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? (
                  <ChevronsRight className="size-4" />
                ) : (
                  <ChevronsLeft className="size-4" />
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {cmsNavigation.map((section, index) => (
                <div key={section.title}>
                  {!isSidebarCollapsed && (<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-3">
                    {section.titleTranslation ? t(section.titleTranslation) : section.title}
                  </div>)}
                  <div className="space-y-1">
                    {section.items.map((item) => renderNavItem(item))}
                  </div>
                  {index < cmsNavigation.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </nav>

          <div className="space-y-2 border-t border-border p-4">
            {/* <Button
              variant="ghost"
              className={cn(
                'w-full text-muted-foreground hover:text-foreground',
                isSidebarCollapsed ? 'px-0' : 'justify-start',
              )}
            >
              <User className="size-4" />
              {!isSidebarCollapsed ? <span>Profile</span> : null}
            </Button> */}

            <div
              className={cn(
                'flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer relative z-10',
                isSidebarCollapsed ? 'justify-center min-h-10 w-10 h-10 mx-auto' : 'justify-start',
              )}
              onClick={() => {
                if (languageSelectRef.current) {
                  languageSelectRef.current.click()
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isSidebarCollapsed && languageSelectRef.current) {
                  languageSelectRef.current.click()
                }
              }}
            >
              <Globe className="size-4 shrink-0" />
              <select
                ref={languageSelectRef}
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}
                className={cn(
                  'border-0 bg-transparent focus:outline-none cursor-pointer appearance-none',
                  isSidebarCollapsed ? 'absolute inset-0 opacity-0 cursor-pointer' : 'ml-1 flex-1 text-foreground',
                )}
              >
                <option value="en">EN</option>
                <option value="id">ID</option>
              </select>
            </div>

            <div className="flex justify-center">
              <CMSLogoutButton />
            </div>
          </div>
        </aside>

        <div className={cn(
          'flex min-w-0 flex-1 flex-col transition-all duration-300',
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        )}>
          <main className="flex-1 px-4 py-5 sm:px-6 md:px-8 md:py-8 pt-20">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
