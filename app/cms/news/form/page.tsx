'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFileUpload } from '@/hooks/use-file-upload'
import { 
  ArrowLeft, Save, Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Minus, Undo, Redo,
  Palette, Highlighter, RemoveFormatting, Type, 
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/components/ui/use-toast'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'

const MenuBar = ({ editor }: { editor: any }) => {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    icon: Icon, 
    title 
  }: { 
    onClick: () => void
    isActive?: boolean
    icon: any
    title: string 
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-muted transition-colors ${
        isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'
      }`}
      type="button"
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
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const colors = [
    '#000000', '#374151', '#EF4444', '#F97316', '#F59E0B', 
    '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'
  ]

  return (
    <div className="border border-border rounded-t-lg p-2 bg-muted/30">
      <div className="flex flex-wrap gap-1 items-center">
        {/* History */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().undo().run()} 
          icon={Undo} 
          title="Undo (Ctrl+Z)"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().redo().run()} 
          icon={Redo} 
          title="Redo (Ctrl+Y)"
        />
        
        <Divider />
        
        {/* Text Formatting */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')} 
          icon={Bold} 
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')} 
          icon={Italic} 
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          isActive={editor.isActive('underline')} 
          icon={UnderlineIcon} 
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          isActive={editor.isActive('strike')} 
          icon={Strikethrough} 
          title="Strikethrough"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleSubscript().run()} 
          isActive={editor.isActive('subscript')} 
          icon={SubscriptIcon} 
          title="Subscript"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleSuperscript().run()} 
          isActive={editor.isActive('superscript')} 
          icon={SuperscriptIcon} 
          title="Superscript"
        />
        
        <Divider />
        
        {/* Headings */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          isActive={editor.isActive('heading', { level: 1 })} 
          icon={Heading1} 
          title="Heading 1"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })} 
          icon={Heading2} 
          title="Heading 2"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive('heading', { level: 3 })} 
          icon={Heading3} 
          title="Heading 3"
        />
        
        <Divider />
        
        {/* Lists */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')} 
          icon={List} 
          title="Bullet List"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')} 
          icon={ListOrdered} 
          title="Numbered List"
        />
        
        <Divider />
        
        {/* Alignment */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('left').run()} 
          isActive={editor.isActive({ textAlign: 'left' })} 
          icon={AlignLeft} 
          title="Align Left"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('center').run()} 
          isActive={editor.isActive({ textAlign: 'center' })} 
          icon={AlignCenter} 
          title="Align Center"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('right').run()} 
          isActive={editor.isActive({ textAlign: 'right' })} 
          icon={AlignRight} 
          title="Align Right"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
          isActive={editor.isActive({ textAlign: 'justify' })} 
          icon={AlignJustify} 
          title="Justify"
        />
        
        <Divider />
        
        {/* Colors */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color"
            className="p-2 rounded hover:bg-muted transition-colors text-foreground"
            type="button"
          >
            <Palette className="h-4 w-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full mt-1 p-2 bg-background border border-border rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run()
                      setShowColorPicker(false)
                    }}
                    className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                    type="button"
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  editor.chain().focus().unsetColor().run()
                  setShowColorPicker(false)
                }}
                className="w-full mt-2 text-xs py-1 px-2 bg-muted rounded hover:bg-muted/70"
                type="button"
              >
                Reset
              </button>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            title="Highlight"
            className={`p-2 rounded hover:bg-muted transition-colors ${
              editor.isActive('highlight') ? 'bg-primary text-primary-foreground' : 'text-foreground'
            }`}
            type="button"
          >
            <Highlighter className="h-4 w-4" />
          </button>
          {showHighlightPicker && (
            <div className="absolute top-full mt-1 p-2 bg-background border border-border rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color }).run()
                      setShowHighlightPicker(false)
                    }}
                    className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                    type="button"
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run()
                  setShowHighlightPicker(false)
                }}
                className="w-full mt-2 text-xs py-1 px-2 bg-muted rounded hover:bg-muted/70"
                type="button"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        
        <Divider />
        
        {/* Insert */}
        <ToolbarButton 
          onClick={addLink} 
          isActive={editor.isActive('link')} 
          icon={LinkIcon} 
          title="Add/Edit Link"
        />
        <ToolbarButton 
          onClick={addImage} 
          icon={ImageIcon} 
          title="Insert Image"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().setHorizontalRule().run()} 
          icon={Minus} 
          title="Horizontal Rule"
        />
        
        <Divider />
        
        {/* Blocks */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')} 
          icon={Quote} 
          title="Blockquote"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
          isActive={editor.isActive('codeBlock')} 
          icon={Code} 
          title="Code Block"
        />
        
        <Divider />
        
        {/* Clear Formatting */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} 
          icon={RemoveFormatting} 
          title="Clear Formatting"
        />
      </div>
    </div>
  )
}

interface NewsData {
  _id?: string
  slug?: string
  titleEn: string
  titleId: string
  categoryEn: string
  categoryId: string
  contentEn: string
  contentId: string
  image: string
  published: boolean
  publishedDate?: string
  createdAt?: string
}

function NewsFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newsCategories, setNewsCategories] = useState<{ _id: string; nameEn: string; nameId: string; active: boolean }[]>([])

  const [formData, setFormData] = useState<NewsData>({
    titleEn: '',
    titleId: '',
    categoryEn: '',
    categoryId: '',
    contentEn: '',
    contentId: '',
    image: '',
    published: true,
    publishedDate: '',
  })

  const editorEn = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      HorizontalRule,
      Subscript,
      Superscript,
    ],
    content: formData.contentEn,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, contentEn: editor.getHTML() })
    },
  })

  const editorId = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      HorizontalRule,
      Subscript,
      Superscript,
    ],
    content: formData.contentId,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, contentId: editor.getHTML() })
    },
  })

  useEffect(() => {
    if (editorEn && formData.contentEn !== editorEn.getHTML()) {
      editorEn.commands.setContent(formData.contentEn)
    }
  }, [formData.contentEn, editorEn])

  useEffect(() => {
    if (editorId && formData.contentId !== editorId.getHTML()) {
      editorId.commands.setContent(formData.contentId)
    }
  }, [formData.contentId, editorId])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/cms/news/categories?active=true')
        if (response.ok) {
          const data = await response.json()
          setNewsCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const id = searchParams.get('id')
    
    if (id) {
      // Fetch news data for editing
      const fetchNews = async () => {
        try {
          const response = await fetch('/api/cms/news/news?page=1')
          const data = await response.json()
          
          if (data.success) {
            const news = data.data.find((item: NewsData) => item._id === id)
            if (news) {
              setFormData(news)
            }
          }
        } catch (error) {
          console.error('Error fetching news:', error)
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchNews()
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  const handleSave = async () => {
    if (!formData.titleEn || !formData.titleId || !formData.categoryEn || !formData.categoryId || 
        !formData.contentEn || !formData.contentId || !formData.image) {
      toast({
        title: 'Error',
        description: t({ en: 'All required fields must be filled', id: 'Semua field wajib harus diisi' }),
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/cms/news/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save news')
      }

      toast({
        title: 'Success',
        description: formData._id
          ? t({ en: 'News updated successfully', id: 'Berita berhasil diperbarui' })
          : t({ en: 'News created successfully', id: 'Berita berhasil dibuat' }),
      })

      setTimeout(() => {
        router.push('/cms/news')
      }, 1500)
    } catch (error) {
      console.error('Error saving news:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : t({ en: 'Failed to save news', id: 'Gagal menyimpan berita' }),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="text-center py-12 text-muted-foreground">
          {t({ en: 'Loading...', id: 'Memuat...' })}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-5 mt-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/cms/news')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t({ en: 'Back to News', id: 'Kembali ke News' })}
        </Button>
        
        <h1 className="text-2xl font-bold text-foreground">
          {formData._id
            ? t({ en: 'Edit News', id: 'Edit Berita' })
            : t({ en: 'Add News', id: 'Tambah Berita' })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Fill in the details below to create or update news article', id: 'Isi detail di bawah untuk membuat atau memperbarui artikel berita' })}
        </p>
      </div>

      {/* Form */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Title Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              {t({ en: 'Title', id: 'Judul' })}
            </h3>
            
            <div>
              <Label htmlFor="title-en">{t({ en: 'Title (English)', id: 'Judul (English)' })} *</Label>
              <Input
                id="title-en"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder={t({ en: 'Enter title in English', id: 'Masukkan judul dalam English' })}
              />
            </div>

            <div>
              <Label htmlFor="title-id">{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })} *</Label>
              <Input
                id="title-id"
                value={formData.titleId}
                onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                placeholder={t({ en: 'Enter title in Indonesian', id: 'Masukkan judul dalam Indonesia' })}
              />
            </div>

            {formData.slug && formData._id && (
              <div>
                <Label>{t({ en: 'Slug (URL)', id: 'Slug (URL)' })}</Label>
                <Input
                  value={formData.slug}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t({ 
                    en: 'Slug is auto-generated from title and cannot be changed', 
                    id: 'Slug dibuat otomatis dari judul dan tidak dapat diubah' 
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Category Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              {t({ en: 'Category', id: 'Kategori' })}
            </h3>

            <div>
              <Label htmlFor="category">{t({ en: 'Category', id: 'Kategori' })} *</Label>
              {newsCategories.length > 0 ? (
                <select
                  id="category"
                  value={formData.categoryEn}
                  onChange={(e) => {
                    const selected = newsCategories.find((c) => c.nameEn === e.target.value)
                    if (selected) {
                      setFormData({ ...formData, categoryEn: selected.nameEn, categoryId: selected.nameId })
                    } else {
                      setFormData({ ...formData, categoryEn: '', categoryId: '' })
                    }
                  }}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">{t({ en: '-- Select Category --', id: '-- Pilih Kategori --' })}</option>
                  {newsCategories.map((cat) => (
                    <option key={cat._id} value={cat.nameEn}>{cat.nameEn} / {cat.nameId}</option>
                  ))}
                </select>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'No categories available. Add categories in the CMS News Categories section first.', id: 'Belum ada kategori. Tambahkan kategori di section Kategori Berita CMS terlebih dahulu.' })}
                </p>
              )}
              {formData.categoryEn && (
                <p className="mt-1 text-xs text-muted-foreground">
                  EN: {formData.categoryEn} · ID: {formData.categoryId}
                </p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              {t({ en: 'Content', id: 'Konten' })}
            </h3>
            
            <div>
              <Label htmlFor="content-en">{t({ en: 'Content (English)', id: 'Konten (English)' })} *</Label>
              <div className="mt-2">
                <MenuBar editor={editorEn} />
                <EditorContent 
                  editor={editorEn} 
                  className="prose prose-sm max-w-none p-4 min-h-64 border border-t-0 border-border rounded-b-lg bg-white focus-within:ring-2 focus-within:ring-ring"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content-id">{t({ en: 'Content (Bahasa Indonesia)', id: 'Konten (Bahasa Indonesia)' })} *</Label>
              <div className="mt-2">
                <MenuBar editor={editorId} />
                <EditorContent 
                  editor={editorId} 
                  className="prose prose-sm max-w-none p-4 min-h-64 border border-t-0 border-border rounded-b-lg bg-white focus-within:ring-2 focus-within:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              {t({ en: 'Featured Image', id: 'Gambar Utama' })}
            </h3>
            
            <NewsImageUpload 
              currentImage={formData.image}
              onImageUpload={(url) => setFormData({ ...formData, image: url })}
            />
          </div>

          {/* Publish Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              {t({ en: 'Publish Settings', id: 'Pengaturan Publikasi' })}
            </h3>

            <div>
              <Label htmlFor="published-date">{t({ en: 'Published Date', id: 'Tanggal Publikasi' })}</Label>
              <Input
                id="published-date"
                type="date"
                value={formData.publishedDate || ''}
                onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="published">{t({ en: 'Publish immediately', id: 'Terbitkan sekarang' })}</Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3 justify-end pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => router.push('/cms/news')}
            disabled={isSaving}
          >
            {t({ en: 'Cancel', id: 'Batal' })}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving 
              ? t({ en: 'Saving...', id: 'Menyimpan...' })
              : t({ en: 'Save News', id: 'Simpan Berita' })}
          </Button>
        </div>
      </Card>
    </div>
  )
}

interface NewsImageUploadProps {
  currentImage: string
  onImageUpload: (url: string) => void
}

function NewsImageUpload({ currentImage, onImageUpload }: NewsImageUploadProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { upload, status } = useFileUpload()
  const isUploading = status === 'uploading' || status === 'compressing'

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await upload(file)
      if (result?.url) {
        onImageUpload(result.url)
        toast({
          title: t({ en: 'Success', id: 'Berhasil' }),
          description: t({ en: 'Image uploaded successfully', id: 'Gambar berhasil diupload' }),
        })
      }
    } catch (error) {
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to upload image', id: 'Gagal mengupload gambar' }),
        variant: 'destructive',
      })
    }
  }, [upload, onImageUpload, t, toast])

  return (
    <div>
      <Label htmlFor="image">{t({ en: 'Image', id: 'Gambar' })} *</Label>
      <div className="mt-2">
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          {currentImage && (
            <div className="mb-4">
              <img src={currentImage} alt="Preview" className="h-48 w-auto mx-auto rounded object-cover" />
            </div>
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
            className="hidden"
          />
          <label htmlFor="image" className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="text-sm text-muted-foreground">
              {isUploading 
                ? t({ en: 'Uploading...', id: 'Mengupload...' })
                : t({ en: 'Click to upload image', id: 'Klik untuk upload gambar' })
              }
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t({ en: 'PNG, JPG, GIF up to 10MB', id: 'PNG, JPG, GIF hingga 10MB' })}
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default function NewsFormPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    }>
      <NewsFormContent />
    </Suspense>
  )
}
