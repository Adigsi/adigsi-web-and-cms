'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/contexts/language-context'

export default function CMSLoginPage() {
  const router = useRouter()
  const { setLanguage } = useLanguage()
  const [email, setEmail] = useState('admin@adigsi.id')
  const [password, setPassword] = useState('admin12345')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/cms/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string
        } | null
        setErrorMessage(data?.message ?? 'Login gagal. Silakan coba lagi.')
        return
      }

      // Fetch user profile to get language preference
      try {
        const profileResponse = await fetch('/api/cms/user/profile', {
          credentials: 'include',
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          const userLanguage = profileData.user?.language === 'id' ? 'id' : 'en'
          setLanguage(userLanguage)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Continue with redirect even if profile fetch fails
      }

      router.push('/cms/dashboard')
      router.refresh()
    } catch {
      setErrorMessage('Terjadi kesalahan koneksi. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-muted/30">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 md:px-6">
        <Card className="w-full overflow-hidden border-border/70 bg-background/95 shadow-xl backdrop-blur">
          <div className="grid md:grid-cols-2">
            <div className="hidden bg-primary/5 p-8 md:flex md:flex-col md:justify-between lg:p-10">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit">
                  <ShieldCheck className="size-3.5" />
                  ADIGSI CMS
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Kelola konten website dengan lebih cepat.
                  </h1>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    Satu tempat untuk mengatur berita, agenda, dan informasi
                    keanggotaan ADIGSI secara aman.
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ShieldCheck className="size-4 text-primary" />
                  Akses aman untuk admin
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Kelola artikel dan agenda dari satu dashboard</li>
                  <li>• Perubahan tampil langsung di website utama</li>
                  <li>• Session login terlindungi cookie httpOnly</li>
                </ul>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <CardHeader className="space-y-5 px-0 pt-0 text-left">
                <Link href="/" className="w-fit">
                  <Image
                    alt="ADIGSI"
                    src="/images/design-mode/logo-adigsi.png"
                    width={132}
                    height={46}
                    priority
                  />
                </Link>

                <div className="space-y-1.5">
                  <CardTitle className="text-2xl">Masuk ke CMS</CardTitle>
                  <CardDescription>
                    Gunakan akun admin untuk mengelola konten ADIGSI.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@adigsi.id"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        autoComplete="email"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {errorMessage ? (
                    <Alert variant="destructive" className="py-2.5">
                      <AlertCircle />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  ) : null}

                  <Button type="submit" className="h-10 w-full" disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Halaman ini hanya untuk administrator ADIGSI.
                  </p>
                </form>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
