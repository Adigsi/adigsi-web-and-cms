import { MongoClient, ServerApiVersion } from 'mongodb'

const mongodbUri = process.env.MONGODB_URI

const mongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let cachedClient: MongoClient | null = null
let cachedClientPromise: Promise<MongoClient> | null = null

export async function getMongoClient() {
  if (!mongodbUri) {
    throw new Error('MONGODB_URI belum diset di environment variables.')
  }

  if (cachedClient) {
    return cachedClient
  }

  if (!cachedClientPromise) {
    const client = new MongoClient(mongodbUri, mongoClientOptions)
    cachedClientPromise = client.connect()
  }

  cachedClient = await cachedClientPromise
  return cachedClient
}

export async function getMongoDatabase() {
  const client = await getMongoClient()
  const databaseName = process.env.MONGODB_DB_NAME ?? 'adigsi_cms'
  return client.db(databaseName)
}
