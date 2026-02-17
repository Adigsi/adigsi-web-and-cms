import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import type { ObjectId } from 'mongodb'

import { getMongoDatabase } from '@/lib/mongodb'

type CmsUserDocument = {
  _id: ObjectId
  email: string
  emailLower?: string
  password?: string
  passwordHash?: string
  name?: string
  role?: string
  isActive?: boolean
}

export type CmsAuthenticatedUser = {
  id: string
  email: string
  name: string | null
  role: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function deriveScryptHash(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString('hex')
}

function verifyScryptPassword(password: string, storedHash: string) {
  const [prefix, salt, hash] = storedHash.split('$')

  if (prefix !== 'scrypt' || !salt || !hash) {
    return false
  }

  const computedHash = deriveScryptHash(password, salt)

  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'))
}

export function hashCmsPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = deriveScryptHash(password, salt)
  return `scrypt$${salt}$${hash}`
}

export function verifyCmsPassword(password: string, user: CmsUserDocument) {
  if (user.passwordHash) {
    return verifyScryptPassword(password, user.passwordHash)
  }

  if (typeof user.password === 'string') {
    const storedPasswordHash = createHash('sha256').update(user.password).digest()
    const inputPasswordHash = createHash('sha256').update(password).digest()

    return timingSafeEqual(
      storedPasswordHash,
      inputPasswordHash,
    )
  }

  return false
}

export async function findCmsUserByEmail(email: string) {
  const database = await getMongoDatabase()
  const usersCollection = database.collection<CmsUserDocument>('cms_users')
  const emailLower = normalizeEmail(email)

  const user = await usersCollection.findOne({
    $or: [{ emailLower }, { email: emailLower }],
  })

  if (!user || user.isActive === false) {
    return null
  }

  return user
}

export async function authenticateCmsUser(email: string, password: string) {
  const user = await findCmsUserByEmail(email)

  if (!user || !verifyCmsPassword(password, user)) {
    return null
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? null,
    role: user.role ?? 'admin',
  } satisfies CmsAuthenticatedUser
}
