import { NextResponse } from 'next/server'

import { hashCmsPassword } from '@/lib/cms-auth'
import { getMongoDatabase } from '@/lib/mongodb'

type SetupAdminBody = {
  setupSecret?: string
  email?: string
  password?: string
  name?: string
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SetupAdminBody | null

  const setupSecret =
    request.headers.get('x-setup-secret') ??
    (typeof body?.setupSecret === 'string' ? body.setupSecret : '')

  const expectedSetupSecret = process.env.CMS_SETUP_SECRET

  if (!expectedSetupSecret) {
    return NextResponse.json(
      { message: 'CMS_SETUP_SECRET belum diset di environment variables.' },
      { status: 500 },
    )
  }

  if (!setupSecret || setupSecret !== expectedSetupSecret) {
    return NextResponse.json(
      { message: 'Setup secret tidak valid.' },
      { status: 401 },
    )
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : 'Administrator'

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email dan password wajib diisi.' },
      { status: 400 },
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: 'Password minimal 8 karakter.' },
      { status: 400 },
    )
  }

  const emailLower = email.toLowerCase()

  try {
    const database = await getMongoDatabase()
    const usersCollection = database.collection('cms_users')

    await usersCollection.createIndex({ emailLower: 1 }, { unique: true })

    const totalUsers = await usersCollection.countDocuments()

    if (totalUsers > 0) {
      return NextResponse.json(
        { message: 'Setup admin sudah pernah dilakukan.' },
        { status: 409 },
      )
    }

    await usersCollection.insertOne({
      email,
      emailLower,
      passwordHash: hashCmsPassword(password),
      name,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      message: 'Admin pertama berhasil dibuat.',
      user: { email, name, role: 'admin' },
    })
  } catch (error) {
    const duplicateKeyError =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000

    if (duplicateKeyError) {
      return NextResponse.json(
        { message: 'Email admin sudah terdaftar.' },
        { status: 409 },
      )
    }

    return NextResponse.json(
      { message: 'Server gagal membuat admin.' },
      { status: 500 },
    )
  }
}
