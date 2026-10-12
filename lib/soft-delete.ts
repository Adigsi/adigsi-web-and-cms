import { randomBytes } from 'crypto'
import { ObjectId, type Collection, type Document, type Filter } from 'mongodb'
import type { NextRequest } from 'next/server'

import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'
import { verifyCmsSessionToken } from '@/lib/cms-session'
import { getMongoDatabase } from '@/lib/mongodb'

type CmsSession = {
  sub: string
  email: string
}

const DELETED_AT_TTL_INDEX = 'deletedAt_ttl'
const MAX_RETENTION_DAYS = 365

// Use $ne so documents created before soft delete existed (no isDeleted field) still match
export const notDeleted = { isDeleted: { $ne: true } }

export async function getCmsSessionFromRequest(request: NextRequest) {
  const sessionCookie = request.cookies.get(CMS_AUTH_COOKIE)?.value

  if (!sessionCookie) {
    return null
  }

  return verifyCmsSessionToken(sessionCookie).catch((error) => {
    console.error('[Soft Delete Session Verify Error]', error instanceof Error ? error.message : error)
    return null
  })
}

function getRetentionSeconds() {
  const days = parseInt(process.env.SOFT_DELETE_RETENTION_DAYS || String(MAX_RETENTION_DAYS), 10)
  const safeDays = Number.isNaN(days) ? MAX_RETENTION_DAYS : Math.min(Math.max(days, 1), MAX_RETENTION_DAYS)
  return safeDays * 86400
}

// Soft-deleted documents are purged permanently by MongoDB once deletedAt is older than the retention period.
// Active documents have no deletedAt field, so the TTL index never touches them.
async function ensureDeletedAtTtlIndex(collection: Collection) {
  const expireAfterSeconds = getRetentionSeconds()
  const indexes = await collection.indexes()
  const ttlIndex = indexes.find((idx) => idx.name === DELETED_AT_TTL_INDEX)

  if (!ttlIndex) {
    await collection.createIndex(
      { deletedAt: 1 },
      { expireAfterSeconds, name: DELETED_AT_TTL_INDEX }
    )
    return
  }

  if (ttlIndex.expireAfterSeconds !== expireAfterSeconds) {
    const db = await getMongoDatabase()
    await db.command({
      collMod: collection.collectionName,
      index: { name: DELETED_AT_TTL_INDEX, expireAfterSeconds },
    })
  }
}

export async function softDeleteOne(
  collection: Collection,
  filter: Filter<Document>,
  session: CmsSession,
  uniqueFields: string[] = [],
) {
  const doc = await collection.findOne({ ...filter, ...notDeleted })

  if (!doc) {
    return false
  }

  // Free up unique values so they can be reused, e.g. slug -> deleted-a1b2c3d4-slug
  const randomId = randomBytes(4).toString('hex')
  const renamedUniqueFields: Record<string, string> = {}

  for (const field of uniqueFields) {
    if (typeof doc[field] === 'string') {
      renamedUniqueFields[field] = `deleted-${randomId}-${doc[field]}`
    }
  }

  await collection.updateOne(
    { _id: doc._id },
    {
      $set: {
        ...renamedUniqueFields,
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: {
          id: new ObjectId(session.sub),
          email: session.email,
        },
      },
    }
  )

  try {
    await ensureDeletedAtTtlIndex(collection)
  } catch (error) {
    // The document is already soft-deleted; the index will be retried on the next delete
    console.error(`Error ensuring ${DELETED_AT_TTL_INDEX} index on ${collection.collectionName}:`, error)
  }

  return true
}
