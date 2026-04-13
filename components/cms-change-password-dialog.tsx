'use client'

import { useState } from 'react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'

interface CMSChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CMSChangePasswordDialog({ open, onOpenChange }: CMSChangePasswordDialogProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowCurrent(false)
    setShowNew(false)
    setShowConfirm(false)
    setError(null)
  }

  const handleOpenChange = (value: boolean) => {
    if (!isLoading) {
      resetForm()
      onOpenChange(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 8) {
      setError(t({ en: 'New password must be at least 8 characters.', id: 'Password baru minimal 8 karakter.' }))
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t({ en: 'New passwords do not match.', id: 'Password baru tidak cocok.' }))
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/cms/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.message ?? t({ en: 'Failed to change password.', id: 'Gagal mengganti password.' }))
        return
      }

      toast({
        title: t({ en: 'Password changed', id: 'Password berhasil diubah' }),
        description: t({ en: 'Your password has been updated successfully.', id: 'Password Anda berhasil diperbarui.' }),
      })
      handleOpenChange(false)
    } catch {
      setError(t({ en: 'An unexpected error occurred.', id: 'Terjadi kesalahan yang tidak terduga.' }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="size-5 text-primary" />
            <DialogTitle>
              {t({ en: 'Change Password', id: 'Ganti Password' })}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t({
              en: 'Enter your current password and choose a new one.',
              id: 'Masukkan password saat ini dan pilih yang baru.',
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current password */}
          <div className="space-y-1.5">
            <Label htmlFor="current-password">
              {t({ en: 'Current Password', id: 'Password Saat Ini' })}
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showCurrent ? t({ en: 'Hide password', id: 'Sembunyikan password' }) : t({ en: 'Show password', id: 'Tampilkan password' })}
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <Label htmlFor="new-password">
              {t({ en: 'New Password', id: 'Password Baru' })}
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showNew ? t({ en: 'Hide password', id: 'Sembunyikan password' }) : t({ en: 'Show password', id: 'Tampilkan password' })}
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t({ en: 'Minimum 8 characters', id: 'Minimal 8 karakter' })}
            </p>
          </div>

          {/* Confirm new password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">
              {t({ en: 'Confirm New Password', id: 'Konfirmasi Password Baru' })}
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirm ? t({ en: 'Hide password', id: 'Sembunyikan password' }) : t({ en: 'Show password', id: 'Tampilkan password' })}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              {t({ en: 'Cancel', id: 'Batal' })}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? t({ en: 'Saving...', id: 'Menyimpan...' })
                : t({ en: 'Save', id: 'Simpan' })}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
