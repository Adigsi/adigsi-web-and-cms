'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Globe, Menu, X } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[99] bg-white border-b border-[#eeeeee]">
      <div className="w-full max-w-[1240px] mx-auto px-5 py-5">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-[#29294b]">
            <Image
              alt="logo"
              src="/images/design-mode/logo-adigsi.png"
              width={132}
              height={46}
              loading="eager"
              priority
              style={{ width: '132px', height: '46px' }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="font-medium text-[#29294b] hover:text-[#3350e6] transition-colors no-underline"
            >
              {t({ en: 'Home', id: 'Beranda' })}
            </Link>
            <Link
              href="/about"
              className="font-medium text-[#29294b] hover:text-[#3350e6] transition-colors no-underline"
            >
              {t({ en: 'About Us', id: 'Tentang Kami' })}
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCommunityDropdownOpen(true)}
              onMouseLeave={() => setCommunityDropdownOpen(false)}
            >
              <button
                onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)}
                className="font-medium text-[#29294b] hover:text-[#3350e6] transition-colors no-underline bg-transparent border-0 cursor-pointer flex items-center gap-1 py-2"
              >
                {t({ en: 'Community', id: 'Komunitas' })}
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
                <div className="absolute top-full left-0 pt-2 w-48 z-50">
                  <div className="bg-white shadow-lg rounded-lg border border-gray-200 py-2">
                    <Link
                      href="/members"
                      className="block px-4 py-2 text-[#29294b] hover:bg-gray-100 hover:text-[#3350e6] transition-colors no-underline"
                    >
                      {t({ en: 'Adigsi Members', id: 'Anggota Adigsi' })}
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 text-[#29294b] hover:bg-gray-100 hover:text-[#3350e6] transition-colors no-underline"
                    >
                      {t({ en: 'Register', id: 'Daftar' })}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/agenda"
              className="font-medium text-[#29294b] hover:text-[#3350e6] transition-colors no-underline"
            >
              {t({ en: 'Events', id: 'Agenda' })}
            </Link>
            <Link
              href="/news"
              className="font-medium text-[#29294b] hover:text-[#3350e6] transition-colors no-underline"
            >
              {t({ en: 'Latest News', id: 'Berita Terbaru' })}
            </Link>
          </div>

          {/* Right Side - Language & Contact */}
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex items-center gap-1 mr-5">
              <Globe className="w-4 h-4 text-[#333333]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-base font-medium bg-transparent text-[#333333] border-0 cursor-pointer focus:outline-none"
              >
                <option value="en">EN</option>
                <option value="id">ID</option>
              </select>
            </div>
            <Link
              href="mailto:info@adigsi.id"
              className="bg-[#3350e6] text-white font-medium text-sm flex items-center border-0 rounded-lg px-4 py-2 hover:bg-[#2a42c7] transition-colors no-underline"
            >
              {t({ en: 'Contact Us', id: 'Hubungi Kami' })}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#29294b]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 right-0 bottom-0 left-0 bg-white z-[999] flex-col justify-center items-center transition-opacity duration-[350ms] ease-in-out ${mobileMenuOpen
            ? 'flex opacity-100 pointer-events-auto'
            : 'hidden opacity-0 pointer-events-none'
          }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 bg-transparent text-[28px] z-[9999] cursor-pointer border-0 text-[#29294b]"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Language Selector in Mobile */}
        <div className="flex items-center gap-1 mr-5 mb-6">
          <Globe className="w-4 h-4 text-[#333333]" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-base font-medium bg-transparent text-[#333333] border-0 cursor-pointer focus:outline-none"
          >
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>
        </div>

        {/* Mobile Menu Links */}
        <Link
          href="/"
          className="text-[21px] font-bold text-black uppercase my-3 no-underline hover:text-[#3350e6] transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          {t({ en: 'Home', id: 'Beranda' })}
        </Link>
        <Link
          href="/about"
          className="text-[21px] font-bold text-black uppercase my-3 no-underline hover:text-[#3350e6] transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          {t({ en: 'About Us', id: 'Tentang Kami' })}
        </Link>
        <div className="flex flex-col my-3">
          <span className="text-[21px] font-bold text-black uppercase mb-2">
            {t({ en: 'Community', id: 'Komunitas' })}
          </span>
          <Link
            href="/members"
            className="text-base font-medium text-[#29294b] hover:text-[#3350e6] transition-colors no-underline ml-4 my-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t({ en: 'Adigsi Members', id: 'Anggota Adigsi' })}
          </Link>
          <Link
            href="/register"
            className="text-base font-medium text-[#29294b] hover:text-[#3350e6] transition-colors no-underline ml-4 my-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t({ en: 'Register', id: 'Daftar' })}
          </Link>
        </div>
        <Link
          href="/events"
          className="text-[21px] font-bold text-black uppercase my-3 no-underline hover:text-[#3350e6] transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          {t({ en: 'Events', id: 'Agenda' })}
        </Link>
        <Link
          href="/news"
          className="text-[21px] font-bold text-black uppercase my-3 no-underline hover:text-[#3350e6] transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          {t({ en: 'Latest News', id: 'Berita Terbaru' })}
        </Link>
      </div>
    </header>
  )
}
