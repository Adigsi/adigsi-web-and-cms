'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  House,
  Info,
  Newspaper,
  UserPlus,
  Users,
} from 'lucide-react'

import { CMSLogoutButton } from '@/components/cms-logout-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const cmsNavigation = [
  { label: 'Home', href: '/cms/dashboard', icon: House },
  { label: 'About', href: '/cms/about', icon: Info },
  { label: 'Members', href: '/cms/members', icon: Users },
  { label: 'Register', href: '/cms/register', icon: UserPlus },
  { label: 'Events', href: '/cms/events', icon: CalendarDays },
  { label: 'News', href: '/cms/news', icon: Newspaper },
]

export function CMSLayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  const isActiveMenu = (href: string) => {
    if (href === '/cms/dashboard' && pathname === '/cms') {
      return true
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-screen-2xl">
        <aside
          className={cn(
            'hidden border-r border-border bg-card/70 transition-all duration-300 md:flex md:flex-col md:backdrop-blur',
            isSidebarCollapsed ? 'w-20' : 'w-72',
          )}
        >
          <div
            className={cn(
              'border-b border-border',
              isSidebarCollapsed ? 'p-2.5' : 'p-4',
            )}
          >
            <div
              className={cn(
                'flex items-center gap-2',
                isSidebarCollapsed ? 'justify-center' : 'justify-between',
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
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? (
                  <ChevronsRight className="size-4" />
                ) : (
                  <ChevronsLeft className="size-4" />
                )}
              </Button>
            </div>

            {/* {!isSidebarCollapsed ? (
              <p className="mt-2 text-xs text-muted-foreground">Content Management</p>
            ) : null} */}
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {cmsNavigation.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex rounded-lg py-2.5 text-sm transition-colors',
                  isActiveMenu(href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  isSidebarCollapsed
                    ? 'items-center justify-center px-2'
                    : 'items-center gap-3 px-3',
                )}
                title={isSidebarCollapsed ? label : undefined}
              >
                <Icon className="size-4 shrink-0" />
                {!isSidebarCollapsed ? <span>{label}</span> : null}
              </Link>
            ))}
          </nav>

          <div className="space-y-2 border-t border-border p-4">
            <Button
              variant="ghost"
              className={cn(
                'w-full text-muted-foreground hover:text-foreground',
                isSidebarCollapsed ? 'px-0' : 'justify-start',
              )}
            >
              <Users className="size-4" />
              {!isSidebarCollapsed ? <span>Profile</span> : null}
            </Button>

            <div className="flex justify-center">
              <CMSLogoutButton />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 py-5 sm:px-6 md:px-8 md:py-8">
            <nav className="mb-4 flex gap-2 overflow-x-auto border-b border-border pb-4 md:hidden">
              {cmsNavigation.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors',
                    isActiveMenu(href)
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
