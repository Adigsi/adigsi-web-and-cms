'use client'

import { useState, useEffect } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Minus, Undo, Redo,
  Palette, Highlighter, RemoveFormatting,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TipTapLink from '@tiptap/extension-link'
import TipTapImage from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'

const TIPTAP_EXTENSIONS = [
  StarterKit,
  Underline,
  TipTapLink.configure({
    openOnClick: false,
    HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
  }),
  TipTapImage.configure({
    HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' },
  }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  HorizontalRule,
  Subscript,
  Superscript,
]

const COLORS = [
  '#000000', '#374151', '#EF4444', '#F97316', '#F59E0B',
  '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
]

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)

  if (!editor) return null

  const ToolbarButton = ({
    onClick, isActive, icon: Icon, title,
  }: { onClick: () => void; isActive?: boolean; icon: React.ElementType; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-muted transition-colors ${
        isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  const Divider = () => <div className="w-px h-6 bg-border" />

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="border border-border rounded-t-lg p-2 bg-muted/30">
      <div className="flex flex-wrap gap-1 items-center">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} title="Undo" />
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} title="Redo" />
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} title="Strikethrough" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} icon={SubscriptIcon} title="Subscript" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} icon={SuperscriptIcon} title="Superscript" />
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Heading 1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Heading 2" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Heading 3" />
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} title="Justify" />
        <Divider />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color"
            className="p-2 rounded hover:bg-muted transition-colors text-foreground"
          >
            <Palette className="h-4 w-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full mt-1 p-2 bg-background border border-border rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-5 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => { editor.chain().focus().setColor(color).run(); setShowColorPicker(false) }}
                    className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button type="button" onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false) }} className="w-full mt-2 text-xs py-1 px-2 bg-muted rounded hover:bg-muted/70">Reset</button>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            title="Highlight"
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('highlight') ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
          >
            <Highlighter className="h-4 w-4" />
          </button>
          {showHighlightPicker && (
            <div className="absolute top-full mt-1 p-2 bg-background border border-border rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-5 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => { editor.chain().focus().toggleHighlight({ color }).run(); setShowHighlightPicker(false) }}
                    className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button type="button" onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightPicker(false) }} className="w-full mt-2 text-xs py-1 px-2 bg-muted rounded hover:bg-muted/70">Remove</button>
            </div>
          )}
        </div>
        <Divider />
        <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} icon={LinkIcon} title="Add/Edit Link" />
        <ToolbarButton onClick={addImage} icon={ImageIcon} title="Insert Image" />
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={Minus} title="Horizontal Rule" />
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Blockquote" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} title="Code Block" />
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} icon={RemoveFormatting} title="Clear Formatting" />
      </div>
    </div>
  )
}

export default function CMSPrivacyPolicyPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    bannerTitleEn: 'Privacy Policy',
    bannerTitleId: 'Kebijakan Privasi',
    contentEn: '',
    contentId: '',
  })

  // Separate state for fetched content so sync effects have a stable dependency
  const [fetchedContent, setFetchedContent] = useState<{ en: string; id: string } | null>(null)

  const editorEn = useEditor({
    extensions: TIPTAP_EXTENSIONS,
    content: '',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, contentEn: editor.getHTML() }))
    },
  })

  const editorId = useEditor({
    extensions: TIPTAP_EXTENSIONS,
    content: '',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, contentId: editor.getHTML() }))
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cms/privacy-policy')
        if (response.ok) {
          const data = await response.json()
          setFormData({
            bannerTitleEn: data.bannerTitleEn || 'Privacy Policy',
            bannerTitleId: data.bannerTitleId || 'Kebijakan Privasi',
            contentEn: data.contentEn || '',
            contentId: data.contentId || '',
          })
          setFetchedContent({ en: data.contentEn || '', id: data.contentId || '' })
        }
      } catch (error) {
        console.error('Error fetching privacy-policy data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Sync editor content once both the editor instance and fetched data are ready
  useEffect(() => {
    if (editorEn && fetchedContent !== null) {
      editorEn.commands.setContent(fetchedContent.en)
    }
  }, [editorEn, fetchedContent])

  useEffect(() => {
    if (editorId && fetchedContent !== null) {
      editorId.commands.setContent(fetchedContent.id)
    }
  }, [editorId, fetchedContent])

  const handleSave = async () => {
    if (!formData.bannerTitleEn.trim() || !formData.bannerTitleId.trim()) {
      toast({ title: 'Error', description: 'Banner title in both languages is required.', variant: 'destructive' })
      return
    }
    setIsSaving(true)
    try {
      const response = await fetch('/api/cms/privacy-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerTitleEn: formData.bannerTitleEn,
          bannerTitleId: formData.bannerTitleId,
          contentEn: editorEn?.getHTML() || '',
          contentId: editorId?.getHTML() || '',
        }),
      })
      if (response.ok) {
        toast({ title: 'Saved', description: 'Privacy Policy updated successfully.' })
      } else {
        throw new Error('Failed to save')
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 mt-4 flex flex-col h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t({ en: 'Privacy Policy', id: 'Kebijakan Privasi' })}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t({ en: 'Manage the Privacy Policy page content', id: 'Kelola konten halaman Kebijakan Privasi' })}
        </p>
      </div>

      {isLoading ? (
        <Card className="p-6 flex-1">
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-48" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="en" className='flex-1'>
          <TabsList className="mb-4">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="id">Indonesia</TabsTrigger>
          </TabsList>

          {/* English Tab */}
          <TabsContent value="en">
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bannerTitleEn">
                  {t({ en: 'Page Title (English)', id: 'Judul Halaman (Inggris)' })}
                </Label>
                <Input
                  id="bannerTitleEn"
                  value={formData.bannerTitleEn}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bannerTitleEn: e.target.value }))}
                  placeholder="Privacy Policy"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  {t({ en: 'Page Content (English)', id: 'Konten Halaman (Inggris)' })}
                </Label>
                <div className="border border-border rounded-lg overflow-hidden">
                  <MenuBar editor={editorEn} />
                  <EditorContent
                    editor={editorEn}
                    className="min-h-100 p-4 prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-100"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Indonesian Tab */}
          <TabsContent value="id">
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bannerTitleId">
                  {t({ en: 'Banner Title (Indonesian)', id: 'Judul Banner (Indonesia)' })}
                </Label>
                <Input
                  id="bannerTitleId"
                  value={formData.bannerTitleId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bannerTitleId: e.target.value }))}
                  placeholder="Kebijakan Privasi"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  {t({ en: 'Page Content (Indonesian)', id: 'Konten Halaman (Indonesia)' })}
                </Label>
                <div className="border border-border rounded-lg overflow-hidden">
                  <MenuBar editor={editorId} />
                  <EditorContent
                    editor={editorId}
                    className="min-h-100 p-4 prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-100"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Sticky Save Bar */}
      <div className="sticky bottom-0 z-10 mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.06)] flex items-center gap-3">
        <Button onClick={handleSave} disabled={isSaving || isLoading} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving
            ? t({ en: 'Saving...', id: 'Menyimpan...' })
            : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
        </Button>
      </div>
    </div>
  )
}
