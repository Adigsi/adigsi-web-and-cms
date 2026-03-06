'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MessageSquare,
  Circle,
  CheckCircle2,
  AlertCircle,
  Archive,
  Clock,
} from 'lucide-react'

interface Message {
  _id: string
  fullname: string
  email: string
  company: string
  position: string
  message: string
  isRead: boolean
  status: 'new' | 'need_to_answer' | 'answered' | 'archived'
  createdAt: string
  updatedAt: string
}

type StatusFilter = 'all' | 'unread' | 'new' | 'need_to_answer' | 'answered' | 'archived'

const STATUS_CONFIG = {
  new: {
    label: { en: 'New', id: 'Baru' },
    icon: Circle,
    className: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  },
  need_to_answer: {
    label: { en: 'Need to Answer', id: 'Perlu Dijawab' },
    icon: AlertCircle,
    className: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  },
  answered: {
    label: { en: 'Answered', id: 'Sudah Dijawab' },
    icon: CheckCircle2,
    className: 'text-green-500 bg-green-500/10 border-green-500/30',
  },
  archived: {
    label: { en: 'Archived', id: 'Diarsipkan' },
    icon: Archive,
    className: 'text-muted-foreground bg-muted border-border',
  },
}

const TABS: { key: StatusFilter; labelEn: string; labelId: string }[] = [
  { key: 'all', labelEn: 'All', labelId: 'Semua' },
  { key: 'unread', labelEn: 'Unread', labelId: 'Belum Dibaca' },
  { key: 'new', labelEn: 'New', labelId: 'Baru' },
  { key: 'need_to_answer', labelEn: 'Need to Answer', labelId: 'Perlu Dijawab' },
  { key: 'answered', labelEn: 'Answered', labelId: 'Sudah Dijawab' },
  { key: 'archived', labelEn: 'Archived', labelId: 'Diarsipkan' },
]

function formatDate(dateStr: string, lang: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CMSInboxPage() {
  const { t, language } = useLanguage()
  const { toast } = useToast()

  const [messages, setMessages] = useState<Message[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<StatusFilter>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const fetchMessages = useCallback(async (tab: StatusFilter, p: number, silent = false) => {
    if (!silent) setIsLoading(true)
    else setIsRefreshing(true)

    const params = new URLSearchParams({ page: String(p), limit: '20' })
    if (tab === 'unread') params.set('isRead', 'false')
    else if (tab !== 'all') params.set('status', tab)

    try {
      const res = await fetch(`/api/cms/messages?${params}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), description: t({ en: 'Failed to load messages', id: 'Gagal memuat pesan' }), variant: 'destructive' })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [t, toast])

  useEffect(() => {
    fetchMessages(activeTab, page)
  }, [fetchMessages, activeTab, page])

  const handleTabChange = (tab: StatusFilter) => {
    setActiveTab(tab)
    setPage(1)
    setSelectedMessage(null)
  }

  const handleSelectMessage = async (msg: Message) => {
    setSelectedMessage(msg)
    setConfirmDelete(false)
    // Mark as read if not already
    if (!msg.isRead) {
      try {
        await fetch(`/api/cms/messages/${msg._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        })
        setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, isRead: true } : m))
        setSelectedMessage((prev) => prev ? { ...prev, isRead: true } : prev)
        // Notify sidebar to refresh the unread badge immediately
        window.dispatchEvent(new CustomEvent('cms:unread-changed'))
      } catch {
        // silently fail
      }
    }
  }

  const handleUpdateStatus = async (status: Message['status']) => {
    if (!selectedMessage) return
    setIsUpdatingStatus(true)
    try {
      const res = await fetch(`/api/cms/messages/${selectedMessage._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setMessages((prev) => prev.map((m) => m._id === selectedMessage._id ? { ...m, status } : m))
        setSelectedMessage((prev) => prev ? { ...prev, status } : prev)
        toast({ title: t({ en: 'Status updated', id: 'Status diperbarui' }) })
      }
    } catch {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), variant: 'destructive' })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedMessage) return
    setIsDeleting(true)
    setConfirmDelete(false)
    try {
      const res = await fetch(`/api/cms/messages/${selectedMessage._id}`, { method: 'DELETE' })
      if (res.ok) {
        // Also notify badge if the deleted message was unread
        if (!selectedMessage.isRead) window.dispatchEvent(new CustomEvent('cms:unread-changed'))
        setMessages((prev) => prev.filter((m) => m._id !== selectedMessage._id))
        setTotal((prev) => prev - 1)
        setSelectedMessage(null)
        toast({ title: t({ en: 'Message deleted', id: 'Pesan dihapus' }) })
      }
    } catch {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), variant: 'destructive' })
    } finally {
      setIsDeleting(false)
    }
  }

  const StatusBadge = ({ status }: { status: Message['status'] }) => {
    const cfg = STATUS_CONFIG[status]
    const Icon = cfg.icon
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.className}`}>
        <Icon className="w-3 h-3" />
        {t(cfg.label)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Inbox className="w-6 h-6" />
            {t({ en: 'Inbox', id: 'Kotak Masuk' })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({ en: 'Messages from the contact form', id: 'Pesan dari formulir kontak' })}
            {total > 0 && (
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {total} {t({ en: 'total', id: 'total' })}
              </span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMessages(activeTab, page, true)}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t({ en: 'Refresh', id: 'Segarkan' })}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {language === 'en' ? tab.labelEn : tab.labelId}
          </button>
        ))}
      </div>

      {/* Master-detail layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 min-h-125">
        {/* Left: Message List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              {t({ en: 'Loading...', id: 'Memuat...' })}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium">{t({ en: 'No messages', id: 'Tidak ada pesan' })}</p>
              <p className="text-xs mt-1">{t({ en: 'Your inbox is empty', id: 'Kotak masuk Anda kosong' })}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg._id}
                onClick={() => handleSelectMessage(msg)}
                className={`w-full text-left rounded-lg border p-3 transition-all duration-150 hover:shadow-md ${
                  selectedMessage?._id === msg._id
                    ? 'border-primary bg-primary/5'
                    : msg.isRead
                    ? 'border-border bg-card hover:border-primary/30'
                    : 'border-accent/40 bg-accent/5 hover:border-accent'
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Unread indicator */}
                  <div className="mt-1 shrink-0">
                    {msg.isRead ? (
                      <MailOpen className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Mail className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm truncate ${msg.isRead ? 'text-foreground' : 'font-bold text-foreground'}`}>
                        {msg.fullname}
                      </span>
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1">{msg.email} · {msg.company}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{msg.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <StatusBadge status={msg.status} />
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(msg.createdAt, language)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {t({ en: `Page ${page} of ${totalPages}`, id: `Halaman ${page} dari ${totalPages}` })}
              </span>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Message Detail */}
        {selectedMessage ? (
          <Card className="p-6">
            {/* Detail header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedMessage.fullname}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {selectedMessage.email} · {selectedMessage.company} · {selectedMessage.position}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(selectedMessage.createdAt, language)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {confirmDelete ? (
                  <>
                    <span className="text-xs text-muted-foreground">{t({ en: 'Are you sure?', id: 'Yakin hapus?' })}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="gap-1.5 h-7 px-2.5 text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                      {isDeleting ? t({ en: 'Deleting...', id: 'Menghapus...' }) : t({ en: 'Yes, delete', id: 'Ya, hapus' })}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isDeleting}
                      className="h-7 px-2.5 text-xs"
                    >
                      {t({ en: 'Cancel', id: 'Batal' })}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDelete(true)}
                    className="gap-1.5 shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t({ en: 'Delete', id: 'Hapus' })}
                  </Button>
                )}
              </div>
            </div>

            {/* Message body */}
            <div className="bg-muted/30 border border-border rounded-xl p-4 mb-6">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            {/* Status update */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t({ en: 'Update Status', id: 'Perbarui Status' })}
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_CONFIG) as Message['status'][]).map((status) => {
                  const cfg = STATUS_CONFIG[status]
                  const Icon = cfg.icon
                  const isActive = selectedMessage.status === status
                  return (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(status)}
                      disabled={isUpdatingStatus || isActive}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150
                        ${isActive ? cfg.className + ' opacity-100' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}
                        disabled:cursor-not-allowed`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t(cfg.label)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Reply shortcut */}
            <div className="mt-6 pt-4 border-t border-border">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Message from ADIGSI`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Mail className="w-4 h-4" />
                {t({ en: 'Reply via Email', id: 'Balas via Email' })}
              </a>
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">{t({ en: 'Select a message', id: 'Pilih pesan' })}</p>
            <p className="text-xs mt-1">{t({ en: 'Click a message on the left to view details', id: 'Klik pesan di kiri untuk melihat detail' })}</p>
          </Card>
        )}
      </div>
    </div>
  )
}
