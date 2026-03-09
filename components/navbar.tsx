'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface MenuItem {
  href?: string
  label: { en: string; id: string }
  submenu?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    href: '/',
    label: { en: 'Home', id: 'Beranda' },
  },
  {
    href: '/about',
    label: { en: 'About Us', id: 'Tentang Kami' },
  },
  {
    label: { en: 'Community', id: 'Komunitas' },
    submenu: [
      {
        href: '/members',
        label: { en: 'Adigsi Members', id: 'Anggota Adigsi' },
      },
      {
        href: '/register',
        label: { en: 'Register', id: 'Daftar' },
      },
    ],
  },
  {
    href: '/knowledge-hub',
    label: { en: 'Knowledge Hub', id: 'Pusat Pengetahuan' },
  },
  {
    href: '/events',
    label: { en: 'Events', id: 'Agenda' },
  },
  {
    href: '/news',
    label: { en: 'Latest News', id: 'Berita Terbaru' },
  },
]

// Language Flag Components
const FlagEN = () => (
  <svg width="20" height="15" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="20" rx="2" fill="#012169"/>
    <path d="M0 0L28 20M28 0L0 20" stroke="white" strokeWidth="4"/>
    <path d="M0 0L28 20M28 0L0 20" stroke="#C8102E" strokeWidth="2.5"/>
    <path d="M14 0V20M0 10H28" stroke="white" strokeWidth="6.67"/>
    <path d="M14 0V20M0 10H28" stroke="#C8102E" strokeWidth="4"/>
  </svg>
)

const FlagID = () => (
  <svg width="20" height="15" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="10" fill="#FF0000"/>
    <rect y="10" width="28" height="10" fill="white"/>
  </svg>
)

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check initial dark mode preference
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-99 transition-all duration-300 ${
        isScrolled
          ? 'bg-card dark:bg-card shadow-md border-b border-border'
          : 'bg-card/95 sm:bg-card/0 border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-310 mx-auto px-5 py-3">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              alt="logo"
              src="/images/design-mode/logo-adigsi.png"
              width={132}
              height={46}
              loading="eager"
              priority
              style={{ width: '132px', height: 'auto' }}
              className="dark:brightness-0 dark:invert transition-all"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.submenu ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setCommunityDropdownOpen(true)}
                    onMouseLeave={() => setCommunityDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 bg-transparent border-0 cursor-pointer flex items-center gap-1.5 py-2"
                    >
                      {t(item.label)}
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        className={`transition-transform duration-200 ${communityDropdownOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {communityDropdownOpen && (
                      <div className="absolute top-full left-0 pt-3 w-48 z-50">
                        <div className="bg-popover/95 backdrop-blur-md shadow-lg rounded-xl border border-border py-2">
                          {item.submenu.map((subitem, subindex) => (
                            <Link
                              key={subindex}
                              href={subitem.href || '#'}
                              className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 no-underline rounded-lg mx-1"
                            >
                              {t(subitem.label)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 no-underline"
                  >
                    {t(item.label)}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Dark Mode, Language & Contact */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="px-3 py-2.5 rounded-lg gradient-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Selector with Flags */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-xs">
                {language === 'en' ? <FlagEN /> : <FlagID />}
                <span className="text-xs font-medium">{language.toUpperCase()}</span>
              </button>
              <div className="absolute top-full right-0 mt-2 w-32 p-2 bg-popover/95 backdrop-blur-md shadow-lg rounded-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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

            {/* Contact Button */}
            {/* <Link
              href="mailto:info@adigsi.id"
              className="text-xs font-semibold bg-secondary text-secondary-foreground flex items-center border-0 rounded-lg px-4 py-2 hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all duration-200 no-underline"
            >
              {t({ en: 'Contact Us', id: 'Hubungi Kami' })}
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground p-2 hover:bg-secondary rounded-lg transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`bg-card dark:bg-accent-foreground fixed top-0 right-0 bottom-0 left-0 z-999 flex-col justify-start items-center transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'flex opacity-100 pointer-events-auto'
            : 'hidden opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-linear-to-br from-primary-800 via-primary-700 to-primary-900 opacity-98" />
        
        <div className="relative w-full h-full overflow-y-auto">
          {/* Close Button */}
          <div className="w-full flex justify-between items-center px-5 py-4 border-b dark:border-white/10">
            <Image
              alt="logo"
              src="/images/design-mode/logo-adigsi.png"
              width={100}
              height={35}
              style={{ width: '100px', height: 'auto', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }}
            />
            <button
              className="bg-transparent cursor-pointer border-0 dark:text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Dark Mode & Language in Mobile */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b dark:border-white/10">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm backdrop-blur-sm"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`p-2.5 rounded-lg transition-all duration-200 font-semibold ${
                  language === 'en' ? 'gradient-primary text-white shadow-lg scale-110' : 'bg-primary/20 dark:bg-white/15 hover:bg-white/25 hover:scale-105 text-white border border-white/30 backdrop-blur-sm'
                }`}
              >
                <FlagEN />
              </button>
              <button
                onClick={() => setLanguage('id')}
                className={`p-2.5 rounded-lg transition-all duration-200 font-semibold ${
                  language === 'id' ? 'gradient-primary text-white shadow-lg scale-110' : 'bg-primary/20 dark:bg-white/15 hover:bg-white/25 hover:scale-105 text-white border border-white/30 backdrop-blur-sm'
                }`}
              >
                <FlagID />
              </button>
            </div>
          </div>

          {/* Mobile Menu Links */}
          <div className="py-4">
            {menuItems.map((item, index) => (
              <div key={index} className="w-full">
                {item.submenu ? (
                  <div className="w-full px-5 my-3">
                    <span className="text-base font-bold dark:text-white uppercase block mb-3">
                      {t(item.label)}
                    </span>
                    {item.submenu.map((subitem, subindex) => (
                      <Link
                        key={subindex}
                        href={subitem.href || '#'}
                        className="text-sm font-medium dark:text-white/80 hover:text-accent transition-colors duration-200 no-underline block my-2 pl-4 py-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(subitem.label)}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="text-base font-bold dark:text-white uppercase my-3 no-underline hover:text-accent transition-colors duration-200 px-5 py-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.label)}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Contact Button */}
          {/* <div className="px-5 pb-8">
            <Link
              href="mailto:info@adigsi.id"
              className="text-sm font-semibold gradient-primary text-white flex items-center justify-center border-0 rounded-lg px-6 py-3 hover:opacity-90 hover:shadow-lg transition-all duration-200 no-underline w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t({ en: 'Contact Us', id: 'Hubungi Kami' })}
            </Link>
          </div> */}
        </div>
      </div>
    </header>
  )
}
