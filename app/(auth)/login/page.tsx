'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, LockKeyhole, Mail, Moon, Sun } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

// Flag components (inline SVG)
function FlagEN() {
  return (
    <svg width="18" height="12" viewBox="0 0 60 30" className="rounded-sm">
      <clipPath id="t"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z" /></clipPath>
      <path d="M0,0v30h60v-30z" fill="#00247d" />
      <path d="M0,0l60,30m0-30l-60,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0l60,30m0-30l-60,30" clipPath="url(#t)" stroke="#cf142b" strokeWidth="4" />
      <path d="M30,0v30m-30-15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0v30m-30-15h60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  )
}
function FlagID() {
  return (
    <svg width="18" height="12" viewBox="0 0 3 2" className="rounded-sm">
      <rect width="3" height="1" fill="#CE1126" />
      <rect y="1" width="3" height="1" fill="#FFFFFF" />
    </svg>
  )
}

export default function CMSLoginPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const [email, setEmail] = useState('admin@adigsi.id')
  const [password, setPassword] = useState('admin12345')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleDarkMode = () => {
    const next = !isDarkMode
    setIsDarkMode(next)
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const content = {
    en: {
      loginFailed: 'Login failed. Please try again.',
      connectionError: 'Connection error occurred. Please try again.',
      leftBadge: 'ADIGSI CMS — Secure Admin Access',
      leftTitle: 'Manage website content faster.',
      leftDescription: 'One place to manage ADIGSI news, events, and membership information securely.',
      features: [
        'Manage articles and events from one dashboard',
        'Changes appear instantly on the main website',
        'Session login protected by httpOnly cookies',
      ],
      loginTitle: 'Sign in to CMS',
      loginDescription: 'Use your admin credentials to access the dashboard.',
      email: 'Email',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      processing: 'Authenticating...',
      loginButton: 'Sign in to Dashboard',
      adminOnly: 'This page is for ADIGSI administrators only.',
      backHome: 'Back to Home',
    },
    id: {
      loginFailed: 'Login gagal. Silakan coba lagi.',
      connectionError: 'Terjadi kesalahan koneksi. Silakan coba lagi.',
      leftBadge: 'ADIGSI CMS — Akses Admin Aman',
      leftTitle: 'Kelola konten website dengan lebih cepat.',
      leftDescription: 'Satu tempat untuk mengatur berita, agenda, dan informasi keanggotaan ADIGSI secara aman.',
      features: [
        'Kelola artikel dan agenda dari satu dashboard',
        'Perubahan tampil langsung di website utama',
        'Session login terlindungi cookie httpOnly',
      ],
      loginTitle: 'Masuk ke CMS',
      loginDescription: 'Gunakan kredensial admin Anda untuk mengakses dashboard.',
      email: 'Email',
      password: 'Password',
      passwordPlaceholder: 'Masukkan password',
      processing: 'Mengautentikasi...',
      loginButton: 'Masuk ke Dashboard',
      adminOnly: 'Halaman ini hanya untuk administrator ADIGSI.',
      backHome: 'Kembali ke Beranda',
    },
  } as const

  const t = content[language]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await fetch('/api/cms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null
        setErrorMessage(data?.message ?? t.loginFailed)
        return
      }
      try {
        const profileResponse = await fetch('/api/cms/user/profile', { credentials: 'include' })
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setLanguage(profileData.user?.language === 'id' ? 'id' : 'en')
        }
      } catch {}
      router.push('/cms/dashboard')
      router.refresh()
    } catch {
      setErrorMessage(t.connectionError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-background overflow-hidden flex flex-col">

      {/* ── Dot-grid bg ── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{ backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
      />

      {/* ── Ambient glow ── */}
      <div className="pointer-events-none fixed top-0 left-0 w-125 h-125 rounded-full bg-primary/8 dark:bg-primary/12 blur-[140px] -translate-x-1/2 -translate-y-1/2" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-96 h-96 rounded-full bg-accent/6 dark:bg-accent/10 blur-[120px] translate-x-1/3 translate-y-1/3" />

      {/* ── Top bar ── */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.backHome}
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-xs">
              {language === 'en' ? <FlagEN /> : <FlagID />}
              <span className="text-xs font-medium">{language.toUpperCase()}</span>
            </button>
            <div className="absolute top-full right-0 mt-2 w-32 p-2 bg-popover/95 backdrop-blur-md shadow-lg rounded-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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

          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="px-3 py-2.5 rounded-lg gradient-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm"
            aria-label="Toggle dark mode"
          >
            {mounted && isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-10">
        <div
          className={`w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl transition-all duration-700 ${mounted ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}
        >

          {/* ── Left panel ── */}
          <div className="relative hidden lg:flex flex-col justify-between p-10 bg-primary/5 dark:bg-primary/8 border-r border-border overflow-hidden">
            {/* Line-grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
              style={{
                backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
            {/* Corner brackets */}
            <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary/40" />
            <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary/40" />
            <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary/40" />
            <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary/40" />

            {/* Top */}
            <div className="relative space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                  {t.leftBadge}
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-foreground leading-snug tracking-tight mb-3">
                  {t.leftTitle}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.leftDescription}
                </p>
              </div>

              {/* Feature list */}
              <ul className="space-y-3 mt-2">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terminal block */}
            <div className="relative rounded-xl border border-border bg-card/60 overflow-hidden">
              <div className="h-px w-full bg-linear-to-r from-transparent via-primary/40 to-transparent" />
              <div className="px-5 py-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-[10px] font-mono text-muted-foreground">adigsi.network — cms</span>
                </div>
                <p className="text-[11px] font-mono text-primary/60 leading-relaxed">
                  <span className="text-primary/40">$</span> adigsi --module cms<br />
                  <span className="text-primary/40">$</span> auth --mode secure<br />
                  <span className="text-primary/40">$</span> status: <span className="text-green-400/80">ready</span><br />
                  <span className="text-primary/40">$</span> <span className="animate-pulse">_</span>
                </p>
              </div>
              <div className="h-px w-full bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            </div>
          </div>

          {/* ── Right panel: form ── */}
          <div className="relative flex flex-col justify-center px-8 py-10 md:px-12">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

            {/* Logo */}
            <Link href="/" className="inline-block mb-8">
              <Image
                alt="ADIGSI"
                src="/images/design-mode/logo-adigsi.png"
                width={120}
                height={42}
                priority
              />
            </Link>

            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-6 rounded-full bg-primary" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary/70">
                  {language === 'en' ? 'Authentication' : 'Autentikasi'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1.5">
                {t.loginTitle}
              </h1>
              <p className="text-sm text-muted-foreground">{t.loginDescription}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@adigsi.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  {t.password}
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Error */}
              {errorMessage && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg border border-destructive/30 bg-destructive/10">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
                  <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold tracking-wide overflow-hidden transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {/* Shimmer */}
                {!isLoading && (
                  <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                )}
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {t.processing}
                  </>
                ) : t.loginButton}
              </button>
            </form>

            {/* Footer note */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <p className="text-[10px] font-mono text-muted-foreground text-center">{t.adminOnly}</p>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
          </div>
        </div>
      </div>
    </main>
  )
}

