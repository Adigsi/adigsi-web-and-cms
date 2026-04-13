'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Download,
  House,
  Info,
  Inbox,
  KeyRound,
  LogOut,
  Moon,
  Newspaper,
  Sun,
  User2,
  UserPlus,
  Users,
  Monitor,
  Group,
  ChartLine,
  Menu,
  X,
  Scale,
  ShieldCheck,
} from 'lucide-react'

import { CMSChangePasswordDialog } from '@/components/cms-change-password-dialog'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

import { Separator } from '@/components/ui/separator'

// Language Flag Components
const FlagEN = () => (
  <svg width="20" height="15" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="20" rx="2" fill="#012169" />
    <path d="M0 0L28 20M28 0L0 20" stroke="white" strokeWidth="4" />
    <path d="M0 0L28 20M28 0L0 20" stroke="#C8102E" strokeWidth="2.5" />
    <path d="M14 0V20M0 10H28" stroke="white" strokeWidth="6.67" />
    <path d="M14 0V20M0 10H28" stroke="#C8102E" strokeWidth="4" />
  </svg>
)

const FlagID = () => (
  <svg width="20" height="15" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="10" fill="#FF0000" />
    <rect y="10" width="28" height="10" fill="white" />
  </svg>
)

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
    title: 'Communication',
    titleTranslation: { en: 'Communication', id: 'Komunikasi' },
    items: [
      {
        label: 'Inbox',
        labelTranslation: { en: 'Inbox', id: 'Kotak Masuk' },
        href: '/cms/inbox',
        icon: Inbox,
      },
      {
        label: 'Registration Forms',
        labelTranslation: { en: 'Registration Forms', id: 'Formulir Pendaftaran' },
        href: '/cms/registration-forms',
        icon: ClipboardList,
      },
      {
        label: 'Download Records',
        labelTranslation: { en: 'Download Records', id: 'Riwayat Unduhan' },
        href: '/cms/downloads',
        icon: Download,
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
        label: 'Knowledge Hub',
        labelTranslation: { en: 'Knowledge Hub', id: 'Pusat Pengetahuan' },
        href: '/cms/knowledge-hub',
        icon: BookOpen,
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
  {
    title: 'Legal',
    titleTranslation: { en: 'Legal', id: 'Legal' },
    items: [
      {
        label: 'Terms & Conditions',
        labelTranslation: { en: 'Terms & Conditions', id: 'Syarat & Ketentuan' },
        href: '/cms/terms-conditions',
        icon: Scale,
      },
      {
        label: 'Privacy Policy',
        labelTranslation: { en: 'Privacy Policy', id: 'Kebijakan Privasi' },
        href: '/cms/privacy-policy',
        icon: ShieldCheck,
      },
    ],
  },
]

function getActiveSectionTitle(pathname: string): string | null {
  const path = pathname === '/cms' || pathname === '/cms/' ? '/cms/dashboard' : pathname
  for (const section of cmsNavigation) {
    for (const item of section.items) {
      if (item.href && (path === item.href || path.startsWith(`${item.href}/`))) {
        return section.title
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.href && (path === child.href || path.startsWith(`${child.href}/`))) {
            return section.title
          }
        }
      }
    }
  }
  return null
}

export function CMSLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Community'])
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const active = getActiveSectionTitle(pathname)
    return active ? [active] : [cmsNavigation[0].title]
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadRegFormsCount, setUnreadRegFormsCount] = useState(0)
  const [profileData, setProfileData] = useState<{ name: string | null; email: string } | null>(null)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const fetchUnreadCount = () => {
      fetch('/api/cms/messages/unread-count')
        .then((res) => res.ok ? res.json() : null)
        .then((data) => { if (data?.count != null) setUnreadCount(data.count) })
        .catch(() => {})
    }
    const fetchUnreadRegForms = () => {
      fetch('/api/cms/registration-forms/unread-count')
        .then((res) => res.ok ? res.json() : null)
        .then((data) => { if (data?.count != null) setUnreadRegFormsCount(data.count) })
        .catch(() => {})
    }
    fetchUnreadCount()
    fetchUnreadRegForms()
    const interval = setInterval(() => { fetchUnreadCount(); fetchUnreadRegForms() }, 60_000)
    // Also refresh immediately whenever a message is read/deleted
    window.addEventListener('cms:unread-changed', fetchUnreadCount)
    window.addEventListener('cms:reg-forms-unread-changed', fetchUnreadRegForms)
    return () => {
      clearInterval(interval)
      window.removeEventListener('cms:unread-changed', fetchUnreadCount)
      window.removeEventListener('cms:reg-forms-unread-changed', fetchUnreadRegForms)
    }
  }, [pathname])

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    fetch('/api/cms/user/profile')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.user) {
          setProfileData({ name: data.user.name ?? null, email: data.user.email })
        }
      })
      .catch(() => {})
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

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

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? [] : [title],
    )
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/cms/logout', { method: 'POST' })
    } finally {
      router.push('/login')
      router.refresh()
      setIsLoggingOut(false)
    }
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
    const isInbox = item.href === '/cms/inbox'
    const isRegForms = item.href === '/cms/registration-forms'
    const badge = isInbox && unreadCount > 0
      ? unreadCount
      : isRegForms && unreadRegFormsCount > 0
        ? unreadRegFormsCount
        : 0

    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={() => setIsSidebarOpen(false)}
        className={cn(
          'flex rounded-lg py-2.5 text-sm transition-colors relative',
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
        <div className="relative shrink-0">
          {Icon && <Icon className="size-4" />}
          {badge > 0 && isSidebarCollapsed && (
            <span className="absolute -top-1.5 -right-1.5 min-w-3.5 h-3.5 flex items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground px-0.5">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        {!isSidebarCollapsed ? (
          <>
            <span className="flex-1">{label}</span>
            {badge > 0 && (
              <span className="ml-auto min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground px-1">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </>
        ) : null}
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
              className="h-6 w-auto dark:brightness-0 dark:invert transition-all"
            />
          </div>
        </div>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/50 md:hidden z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <aside
          className={cn(
            'fixed left-0 top-0 h-screen border-r border-border bg-card transition-all duration-300 md:flex md:flex-col md:backdrop-blur z-40',
            'md:translate-x-0',
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
                    className="h-8 w-auto dark:brightness-0 dark:invert transition-all"
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
                  {isSidebarCollapsed ? (
                    <div className="space-y-1">
                      {section.items.map((item) => renderNavItem(item))}
                    </div>
                  ) : (
                    <Collapsible
                      open={expandedSections.includes(section.title)}
                      onOpenChange={() => toggleSection(section.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full cursor-pointer items-center justify-between px-3 pb-2 group"
                        >
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {section.titleTranslation ? t(section.titleTranslation) : section.title}
                          </span>
                          <ChevronDown
                            className={cn(
                              'size-3 text-muted-foreground/60 transition-transform duration-200',
                              expandedSections.includes(section.title) ? '' : '-rotate-90',
                            )}
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                        <div className="space-y-1 pb-1">
                          {section.items.map((item) => renderNavItem(item))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                  {index < cmsNavigation.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </nav>

          <div className="space-y-2 border-t border-border p-4">
            {/* Theme + Language side by side */}
            <div className={cn('flex gap-2', isSidebarCollapsed ? 'justify-center' : '')}>
              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                title={isSidebarCollapsed
                  ? (isDarkMode ? t({ en: 'Light Mode', id: 'Mode Terang' }) : t({ en: 'Dark Mode', id: 'Mode Gelap' }))
                  : undefined}
                className={cn(
                  'gradient-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 rounded-lg flex items-center gap-2',
                  isSidebarCollapsed ? 'justify-center w-10 h-10' : 'flex-1 px-3 py-2.5',
                )}
              >
                {isDarkMode ? <Sun className="size-4 shrink-0" /> : <Moon className="size-4 shrink-0" />}
                {!isSidebarCollapsed && (
                  <span className="text-sm font-semibold">
                    {isDarkMode
                      ? t({ en: 'Light Mode', id: 'Mode Terang' })
                      : t({ en: 'Dark Mode', id: 'Mode Gelap' })}
                  </span>
                )}
              </button>

              {/* Language selector */}
              <div className={cn('relative group', isSidebarCollapsed ? '' : 'flex-1')}>
                <button
                  className={cn(
                    'gradient-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 rounded-lg flex items-center gap-2',
                    isSidebarCollapsed ? 'justify-center w-10 h-10' : 'w-full px-3 py-2.5',
                  )}
                >
                  {language === 'en' ? <FlagEN /> : <FlagID />}
                  {!isSidebarCollapsed && (
                    <span className="text-sm font-medium">{language.toUpperCase()}</span>
                  )}
                </button>
                <div className={cn(
                  'absolute z-50 p-2 bg-popover/95 backdrop-blur-md shadow-lg rounded-xl border border-border',
                  'opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200',
                  isSidebarCollapsed
                    ? 'bottom-0 left-full ml-2 w-32'
                    : 'bottom-full mb-2 left-0 right-0',
                )}>
                  <button
                    onClick={() => setLanguage('en')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg"
                  >
                    <FlagEN />
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => setLanguage('id')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg"
                  >
                    <FlagID />
                    <span>Indonesia</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile popover */}
            <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'rounded-lg text-sm transition-colors flex items-center gap-2',
                    'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    isSidebarCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'w-full px-3 py-2.5',
                  )}
                  title={isSidebarCollapsed ? t({ en: 'Profile', id: 'Profil' }) : undefined}
                >
                  <User2 className="size-4 shrink-0" />
                  {!isSidebarCollapsed && (
                    <span>{t({ en: 'Profile', id: 'Profil' })}</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-64 p-0">
                {/* Profile header */}
                <div className="flex items-center gap-3 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {profileData?.name
                      ? profileData.name.charAt(0).toUpperCase()
                      : profileData?.email?.charAt(0).toUpperCase() ?? 'A'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {profileData?.name ?? 'Admin'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {profileData?.email ?? ''}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="p-2 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false)
                      setIsChangePasswordOpen(true)
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <KeyRound className="size-4 shrink-0 text-muted-foreground" />
                    {t({ en: 'Change Password', id: 'Ganti Password' })}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="size-4 shrink-0" />
                    {isLoggingOut
                      ? t({ en: 'Logging out...', id: 'Sedang keluar...' })
                      : t({ en: 'Logout', id: 'Keluar' })}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </aside>

        <div className={cn(
          'flex min-w-0 flex-1 flex-col transition-all duration-300',
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        )}>
          <main className="flex-1 px-4 sm:px-6 md:px-8">
            {children}
          </main>
        </div>
      </div>

      <CMSChangePasswordDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </div>
  )
}
