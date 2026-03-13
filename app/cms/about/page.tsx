'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'
import { useFileUpload } from '@/hooks/use-file-upload'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Logo {
  alt: string
  imageUrl: string
}

interface Category {
  titleEn: string
  titleId: string
  homeLimit: number
  logos: Logo[]
}

interface PartnersData {
  categories: Category[]
}

export default function CMSAboutPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { upload } = useFileUpload()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [draggedItem, setDraggedItem] = useState<{ groupIndex: number; memberIndex: number } | null>(null)
  const [draggedLogo, setDraggedLogo] = useState<{ categoryIndex: number; logoIndex: number } | null>(null)

  // Create file upload callbacks for different sections
  const uploadFileOrg = useCallback(async (file: File) => {
    const result = await upload(file)
    return result?.url || ''
  }, [upload])

  const uploadFilePartners = useCallback(async (file: File) => {
    const result = await upload(file)
    return result?.url || ''
  }, [upload])

  // Banner section state
  const [bannerData, setBannerData] = useState({
    titleEn: 'About ADIGSI',
    titleId: 'Tentang ADIGSI',
  })

  // Organization Structure section state
  const [orgData, setOrgData] = useState({
    groups: [
      {
        titleEn: 'Supervisory Board',
        titleId: 'Dewan Pengawas',
        members: [
          {
            name: '',
            positionEn: '',
            positionId: '',
            imageUrl: ''
          }
        ]
      }
    ]
  })

  // About ADIGSI section state
  const [aboutData, setAboutData] = useState({
    titleEn: 'Indonesian Association for Digitalization and Cybersecurity',
    titleId: 'Asosiasi Indonesia untuk Digitalisasi dan Keamanan Siber',
    descriptionEn: '',
    descriptionId: '',
    visionEn: '',
    visionId: '',
    missions: [{ en: '', id: '' }]
  })

  // Partners section state
  const [partnersData, setPartnersData] = useState<PartnersData>({
    categories: [
      {
        titleEn: 'Government Organizations',
        titleId: 'Organisasi Pemerintah',
        homeLimit: 0,
        logos: []
      },
      {
        titleEn: 'International Institutions',
        titleId: 'Institusi Internasional',
        homeLimit: 0,
        logos: []
      },
      {
        titleEn: 'Associations',
        titleId: 'Asosiasi',
        homeLimit: 0,
        logos: []
      },
      {
        titleEn: 'Companies',
        titleId: 'Perusahaan',
        homeLimit: 0,
        logos: []
      }
    ]
  })

  // Fetch banner, organization, about, and partners data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, orgRes, aboutRes, partnersRes] = await Promise.all([
          fetch('/api/cms/about/banner'),
          fetch('/api/cms/about/organization'),
          fetch('/api/cms/about/about'),
          fetch('/api/cms/about/partners')
        ])

        if (bannerRes.ok) {
          const data = await bannerRes.json()
          setBannerData({
            titleEn: data.titleEn || '',
            titleId: data.titleId || '',
          })
        }

        if (orgRes.ok) {
          const data = await orgRes.json()
          if (data.groups && data.groups.length > 0) {
            setOrgData({ groups: data.groups })
          }
        }

        if (aboutRes.ok) {
          const data = await aboutRes.json()
          if (data.titleEn) {
            setAboutData({
              titleEn: data.titleEn,
              titleId: data.titleId,
              descriptionEn: data.descriptionEn,
              descriptionId: data.descriptionId,
              visionEn: data.visionEn,
              visionId: data.visionId,
              missions: data.missions || [{ en: '', id: '' }]
            })
          }
        }

        if (partnersRes.ok) {
          const data = await partnersRes.json()
          if (data.categories && data.categories.length > 0) {
            setPartnersData({
              categories: data.categories.map((cat: Category) => ({
                ...cat,
                homeLimit: cat.homeLimit ?? 0,
              }))
            })
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = async (section: string) => {
    setIsSaving(section)

    try {
      if (section === 'banner') {
        const response = await fetch('/api/cms/about/banner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save banner')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Banner saved successfully', id: 'Banner berhasil disimpan' }),
        })
      } else if (section === 'organization') {
        const response = await fetch('/api/cms/about/organization', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orgData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save organization')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Organization data saved successfully', id: 'Data organisasi berhasil disimpan' }),
        })
      } else if (section === 'about') {
        const response = await fetch('/api/cms/about/about', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(aboutData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save about data')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'About data saved successfully', id: 'Data tentang ADIGSI berhasil disimpan' }),
        })
      } else if (section === 'partners') {
        const response = await fetch('/api/cms/about/partners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(partnersData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save partners')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Partners data saved successfully', id: 'Data mitra berhasil disimpan' }),
        })
      }
    } catch (error) {
      console.error(`Error saving ${section}:`, error)
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to save changes', id: 'Gagal menyimpan perubahan' }),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(null)
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t({ en: 'About Page Management', id: 'Manajemen Halaman About' })}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t({ en: 'Manage content sections for the About page', id: 'Kelola konten section untuk halaman About' })}
            </p>
          </div>
          <Card className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              {t({ en: 'Loading...', id: 'Memuat...' })}
            </div>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="banner" className="h-full">
          {/* Sticky header */}
          <div className="sticky top-16 md:top-0 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 pt-4 pb-3 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
            <h1 className="text-2xl font-bold text-foreground">{t({ en: 'About Page Management', id: 'Manajemen Halaman About' })}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t({ en: 'Manage content sections for the About page', id: 'Kelola konten section untuk halaman About' })}
            </p>
            <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-primary/10 p-1 rounded-md mt-3">
              <TabsTrigger value="banner">{t({ en: 'Page Title', id: 'Judul Halaman' })}</TabsTrigger>
              <TabsTrigger value="about">{t({ en: 'About ADIGSI', id: 'Tentang ADIGSI' })}</TabsTrigger>
              <TabsTrigger value="organization">{t({ en: 'Organization Structure', id: 'Struktur Organisasi' })}</TabsTrigger>
              <TabsTrigger value="partners">{t({ en: 'Partners', id: 'Mitra' })}</TabsTrigger>
            </TabsList>
          </div>

          {/* Banner Tab */}
          <TabsContent value="banner">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <Card className="p-6 flex-1">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="banner-title-en">{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
                      <Input
                        id="banner-title-en"
                        value={bannerData.titleEn}
                        onChange={(e) => setBannerData({ ...bannerData, titleEn: e.target.value })}
                        placeholder={t({ en: 'Enter banner title in English', id: 'Masukkan judul banner dalam English' })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="banner-title-id">{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })}</Label>
                      <Input
                        id="banner-title-id"
                        value={bannerData.titleId}
                        onChange={(e) => setBannerData({ ...bannerData, titleId: e.target.value })}
                        placeholder={t({ en: 'Enter banner title in Indonesian', id: 'Masukkan judul banner dalam Indonesia' })}
                      />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="sticky bottom-0 z-10 mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.06)] flex items-center gap-3">
                <Button onClick={() => handleSave('banner')} disabled={isSaving === 'banner'}>
                  {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* About ADIGSI Tab */}
          <TabsContent value="about">
            <div className="flex flex-col h-full">
              <Card className="p-6 flex-1">
                <div className="space-y-6">
                  {/* Title Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="about-title-en">{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
                      <Input
                        id="about-title-en"
                        value={aboutData.titleEn}
                        onChange={(e) => setAboutData({ ...aboutData, titleEn: e.target.value })}
                        placeholder="Indonesian Association for Digitalization and Cybersecurity"
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-title-id">{t({ en: 'Title (Indonesian)', id: 'Judul (Indonesia)' })}</Label>
                      <Input
                        id="about-title-id"
                        value={aboutData.titleId}
                        onChange={(e) => setAboutData({ ...aboutData, titleId: e.target.value })}
                        placeholder="Asosiasi Indonesia untuk Digitalisasi dan Keamanan Siber"
                      />
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">{t({ en: 'Description', id: 'Deskripsi' })}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="about-desc-en">{t({ en: 'Description (English)', id: 'Deskripsi (English)' })}</Label>
                        <Textarea
                          id="about-desc-en"
                          value={aboutData.descriptionEn}
                          onChange={(e) => setAboutData({ ...aboutData, descriptionEn: e.target.value })}
                          placeholder="Enter description in English"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="about-desc-id">{t({ en: 'Description (Indonesian)', id: 'Deskripsi (Indonesia)' })}</Label>
                        <Textarea
                          id="about-desc-id"
                          value={aboutData.descriptionId}
                          onChange={(e) => setAboutData({ ...aboutData, descriptionId: e.target.value })}
                          placeholder="Masukkan deskripsi dalam bahasa Indonesia"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vision Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">{t({ en: 'Vision', id: 'Visi' })}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="about-vision-en">{t({ en: 'Vision (English)', id: 'Visi (English)' })}</Label>
                        <Textarea
                          id="about-vision-en"
                          value={aboutData.visionEn}
                          onChange={(e) => setAboutData({ ...aboutData, visionEn: e.target.value })}
                          placeholder="Enter vision in English"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="about-vision-id">{t({ en: 'Vision (Indonesian)', id: 'Visi (Indonesia)' })}</Label>
                        <Textarea
                          id="about-vision-id"
                          value={aboutData.visionId}
                          onChange={(e) => setAboutData({ ...aboutData, visionId: e.target.value })}
                          placeholder="Masukkan visi dalam bahasa Indonesia"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Missions Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">{t({ en: 'Missions', id: 'Misi' })}</h3>
                    <div className="space-y-3">
                      {aboutData.missions.map((mission, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">{t({ en: 'EN', id: 'EN' })}</Label>
                              <Input
                                value={mission.en}
                                onChange={(e) => {
                                  const newMissions = [...aboutData.missions]
                                  newMissions[index].en = e.target.value
                                  setAboutData({ ...aboutData, missions: newMissions })
                                }}
                                placeholder="Enter mission in English"
                                className="text-xs h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">{t({ en: 'ID', id: 'ID' })}</Label>
                              <Input
                                value={mission.id}
                                onChange={(e) => {
                                  const newMissions = [...aboutData.missions]
                                  newMissions[index].id = e.target.value
                                  setAboutData({ ...aboutData, missions: newMissions })
                                }}
                                placeholder="Masukkan misi dalam bahasa Indonesia"
                                className="text-xs h-8"
                              />
                            </div>
                          </div>
                          {aboutData.missions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 mt-6"
                              onClick={() => {
                                setAboutData({
                                  ...aboutData,
                                  missions: aboutData.missions.filter((_, i) => i !== index)
                                })
                              }}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              <div className="sticky bottom-0 z-10 mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.06)] flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAboutData({
                      ...aboutData,
                      missions: [...aboutData.missions, { en: '', id: '' }]
                    })
                  }}
                >
                  {t({ en: '+ Add Mission', id: '+ Tambah Misi' })}
                </Button>
                <Button onClick={() => handleSave('about')} disabled={isSaving === 'about'}>
                  {isSaving === 'about' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Organization Structure Tab */}
          <TabsContent value="organization">
            <div className="flex flex-col h-full">
              <Card className="p-6 flex-1">
                <div className="space-y-6">
                  {orgData.groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-semibold text-foreground">
                          {t({ en: `Group ${groupIndex + 1}`, id: `Grup ${groupIndex + 1}` })}
                        </h3>
                        {orgData.groups.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newGroups = orgData.groups.filter((_, i) => i !== groupIndex)
                              setOrgData({ ...orgData, groups: newGroups })
                            }}
                          >
                            {t({ en: 'Remove Group', id: 'Hapus Grup' })}
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t({ en: 'Group Title (English)', id: 'Judul Grup (English)' })}</Label>
                          <Input
                            value={group.titleEn}
                            onChange={(e) => {
                              const newGroups = [...orgData.groups]
                              newGroups[groupIndex].titleEn = e.target.value
                              setOrgData({ ...orgData, groups: newGroups })
                            }}
                            placeholder="e.g., Supervisory Board"
                          />
                        </div>
                        <div>
                          <Label>{t({ en: 'Group Title (Indonesian)', id: 'Judul Grup (Indonesia)' })}</Label>
                          <Input
                            value={group.titleId}
                            onChange={(e) => {
                              const newGroups = [...orgData.groups]
                              newGroups[groupIndex].titleId = e.target.value
                              setOrgData({ ...orgData, groups: newGroups })
                            }}
                            placeholder="misal, Dewan Pengawas"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 mt-4">
                        <Label className="text-sm font-semibold">{t({ en: 'Members', id: 'Anggota' })}</Label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.members.map((member, memberIndex) => (
                            <div
                              key={memberIndex}
                              draggable
                              onDragStart={() => setDraggedItem({ groupIndex, memberIndex })}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => {
                                if (draggedItem && draggedItem.groupIndex === groupIndex && draggedItem.memberIndex !== memberIndex) {
                                  const newGroups = [...orgData.groups]
                                  const [draggedMember] = newGroups[groupIndex].members.splice(draggedItem.memberIndex, 1)
                                  newGroups[groupIndex].members.splice(memberIndex, 0, draggedMember)
                                  setOrgData({ ...orgData, groups: newGroups })
                                  setDraggedItem(null)
                                }
                              }}
                              className={`border rounded-lg p-4 space-y-3 cursor-grab active:cursor-grabbing transition-opacity ${draggedItem?.groupIndex === groupIndex && draggedItem?.memberIndex === memberIndex
                                  ? 'border-dashed border-primary bg-primary/5 opacity-50'
                                  : 'border-dashed border-border'
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {t({ en: `Member ${memberIndex + 1}`, id: `Anggota ${memberIndex + 1}` })}
                                </span>
                                {group.members.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      const newGroups = [...orgData.groups]
                                      newGroups[groupIndex].members = newGroups[groupIndex].members.filter((_, i) => i !== memberIndex)
                                      setOrgData({ ...orgData, groups: newGroups })
                                    }}
                                  >
                                    ×
                                  </Button>
                                )}
                              </div>

                              <div>
                                <Label className="text-xs">{t({ en: 'Photo', id: 'Foto' })}</Label>
                                <div className="mt-1.5 border-2 border-dashed border-border rounded p-3">
                                  {member.imageUrl && (
                                    <div className="mb-2">
                                      <img src={member.imageUrl} alt={member.name} className="h-20 w-20 mx-auto rounded object-cover object-top" />
                                    </div>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        try {
                                          const url = await uploadFileOrg(file)
                                          const newGroups = [...orgData.groups]
                                          newGroups[groupIndex].members[memberIndex].imageUrl = url
                                          setOrgData({ ...orgData, groups: newGroups })
                                        } catch (error) {
                                          toast({
                                            title: t({ en: 'Error', id: 'Kesalahan' }),
                                            description: error instanceof Error ? error.message : t({ en: 'Failed to upload image', id: 'Gagal mengupload gambar' }),
                                            variant: 'destructive',
                                          })
                                        }
                                      }
                                    }}
                                    className="hidden"
                                    id={`member-image-${groupIndex}-${memberIndex}`}
                                  />
                                  <label htmlFor={`member-image-${groupIndex}-${memberIndex}`} className="cursor-pointer block text-center">
                                    <div className="text-xs text-muted-foreground">
                                      {t({ en: 'Upload', id: 'Upload' })}
                                    </div>
                                  </label>
                                </div>
                              </div>

                              <div>
                                <Label className="text-xs">{t({ en: 'Name', id: 'Nama' })}</Label>
                                <Input
                                  size={32}
                                  value={member.name}
                                  onChange={(e) => {
                                    const newGroups = [...orgData.groups]
                                    newGroups[groupIndex].members[memberIndex].name = e.target.value
                                    setOrgData({ ...orgData, groups: newGroups })
                                  }}
                                  placeholder={t({ en: 'Name', id: 'Nama' })}
                                  className="text-xs h-8"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">{t({ en: 'Position (EN)', id: 'Jabatan (EN)' })}</Label>
                                <Input
                                  value={member.positionEn}
                                  onChange={(e) => {
                                    const newGroups = [...orgData.groups]
                                    newGroups[groupIndex].members[memberIndex].positionEn = e.target.value
                                    setOrgData({ ...orgData, groups: newGroups })
                                  }}
                                  placeholder="Chairman"
                                  className="text-xs h-8"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">{t({ en: 'Position (ID)', id: 'Jabatan (ID)' })}</Label>
                                <Input
                                  value={member.positionId}
                                  onChange={(e) => {
                                    const newGroups = [...orgData.groups]
                                    newGroups[groupIndex].members[memberIndex].positionId = e.target.value
                                    setOrgData({ ...orgData, groups: newGroups })
                                  }}
                                  placeholder="Ketua"
                                  className="text-xs h-8"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newGroups = [...orgData.groups]
                            newGroups[groupIndex].members.push({
                              name: '',
                              positionEn: '',
                              positionId: '',
                              imageUrl: ''
                            })
                            setOrgData({ ...orgData, groups: newGroups })
                          }}
                        >
                          {t({ en: '+ Add Member', id: '+ Tambah Anggota' })}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="sticky bottom-0 z-10 mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.06)] flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOrgData({
                      ...orgData,
                      groups: [
                        ...orgData.groups,
                        {
                          titleEn: '',
                          titleId: '',
                          members: [
                            {
                              name: '',
                              positionEn: '',
                              positionId: '',
                              imageUrl: ''
                            }
                          ]
                        }
                      ]
                    })
                  }}
                >
                  {t({ en: '+ Add New Group', id: '+ Tambah Grup Baru' })}
                </Button>
                <Button onClick={() => handleSave('organization')} disabled={isSaving === 'organization'}>
                  {isSaving === 'organization' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <div className="flex flex-col h-full">
              <Card className="p-6 flex-1">
                <div className="space-y-6">
                  {partnersData.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="border-b pb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">{t({ en: 'Category', id: 'Kategori' })} {categoryIndex + 1}</h3>
                        {partnersData.categories.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newCategories = partnersData.categories.filter((_, i) => i !== categoryIndex)
                              setPartnersData({ ...partnersData, categories: newCategories })
                            }}
                          >
                            {t({ en: 'Remove Category', id: 'Hapus Kategori' })}
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">{t({ en: 'Category Name (English)', id: 'Nama Kategori (English)' })}</Label>
                          <Input
                            value={category.titleEn}
                            onChange={(e) => {
                              const newCategories = [...partnersData.categories]
                              newCategories[categoryIndex].titleEn = e.target.value
                              setPartnersData({ ...partnersData, categories: newCategories })
                            }}
                            placeholder="e.g., Government Organizations"
                            className="text-xs h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">{t({ en: 'Category Name (Indonesian)', id: 'Nama Kategori (Indonesia)' })}</Label>
                          <Input
                            value={category.titleId}
                            onChange={(e) => {
                              const newCategories = [...partnersData.categories]
                              newCategories[categoryIndex].titleId = e.target.value
                              setPartnersData({ ...partnersData, categories: newCategories })
                            }}
                            placeholder="misal, Organisasi Pemerintah"
                            className="text-xs h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">{t({ en: 'Home Page Limit', id: 'Batas di Halaman Home' })}</Label>
                          <Input
                            type="number"
                            min={0}
                            value={category.homeLimit}
                            onChange={(e) => {
                              const newCategories = [...partnersData.categories]
                              newCategories[categoryIndex].homeLimit = Math.max(0, parseInt(e.target.value) || 0)
                              setPartnersData({ ...partnersData, categories: newCategories })
                            }}
                            className="text-xs h-8 mt-1"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {t({ en: '0 = show all on home page', id: '0 = tampilkan semua di halaman home' })}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">{t({ en: 'Logos', id: 'Logo' })}</h4>

                        {category.logos.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {category.logos.map((logo, logoIndex) => (
                              <div
                                key={logoIndex}
                                draggable
                                onDragStart={() => setDraggedLogo({ categoryIndex, logoIndex })}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => {
                                  if (draggedLogo && draggedLogo.categoryIndex === categoryIndex && draggedLogo.logoIndex !== logoIndex) {
                                    const newCategories = [...partnersData.categories]
                                    const [draggedLogoItem] = newCategories[categoryIndex].logos.splice(draggedLogo.logoIndex, 1)
                                    newCategories[categoryIndex].logos.splice(logoIndex, 0, draggedLogoItem)
                                    setPartnersData({ ...partnersData, categories: newCategories })
                                    setDraggedLogo(null)
                                  }
                                }}
                                className={`border rounded-lg p-3 space-y-2 flex flex-col cursor-grab active:cursor-grabbing transition-opacity ${draggedLogo?.categoryIndex === categoryIndex && draggedLogo?.logoIndex === logoIndex
                                    ? 'border-dashed border-primary bg-primary/5 opacity-50'
                                    : 'border-dashed border-border'
                                  }`}
                              >
                                {logo.imageUrl && (
                                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded h-20">
                                    <img src={logo.imageUrl} alt={logo.alt} className="h-16 w-auto object-contain" />
                                  </div>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      try {
                                        const url = await uploadFilePartners(file)
                                        const newCategories = [...partnersData.categories]
                                        newCategories[categoryIndex].logos[logoIndex].imageUrl = url
                                        // Auto-generate alt text from filename without extension
                                        const filename = file.name.split('.')[0].replace(/[-_]/g, ' ')
                                        newCategories[categoryIndex].logos[logoIndex].alt = filename
                                        setPartnersData({ ...partnersData, categories: newCategories })
                                      } catch (error) {
                                        toast({
                                          title: t({ en: 'Error', id: 'Kesalahan' }),
                                          description: error instanceof Error ? error.message : t({ en: 'Failed to upload image', id: 'Gagal mengupload gambar' }),
                                          variant: 'destructive',
                                        })
                                      }
                                    }
                                  }}
                                  className="hidden"
                                  id={`logo-upload-${categoryIndex}-${logoIndex}`}
                                />
                                <label htmlFor={`logo-upload-${categoryIndex}-${logoIndex}`} className="cursor-pointer">
                                  <div className="text-xs text-center text-muted-foreground hover:text-foreground transition-colors">
                                    {logo.imageUrl ? t({ en: 'Change', id: 'Ubah' }) : t({ en: 'Upload', id: 'Upload' })}
                                  </div>
                                </label>
                                {category.logos.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-full p-0 text-xs"
                                    onClick={() => {
                                      const newCategories = [...partnersData.categories]
                                      newCategories[categoryIndex].logos = newCategories[categoryIndex].logos.filter((_, i) => i !== logoIndex)
                                      setPartnersData({ ...partnersData, categories: newCategories })
                                    }}
                                  >
                                    {t({ en: 'Remove', id: 'Hapus' })}
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            const newCategories = [...partnersData.categories]
                            newCategories[categoryIndex].logos.push({
                              alt: '',
                              imageUrl: ''
                            })
                            setPartnersData({ ...partnersData, categories: newCategories })
                          }}
                        >
                          {t({ en: '+ Add Logo', id: '+ Tambah Logo' })}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="sticky bottom-0 z-10 mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.06)] flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPartnersData({
                      ...partnersData,
                      categories: [
                        ...partnersData.categories,
                        {
                          titleEn: '',
                          titleId: '',
                          homeLimit: 0,
                          logos: []
                        }
                      ]
                    })
                  }}
                >
                  {t({ en: '+ Add New Category', id: '+ Tambah Kategori Baru' })}
                </Button>
                <Button onClick={() => handleSave('partners')} disabled={isSaving === 'partners'}>
                  {isSaving === 'partners' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}
