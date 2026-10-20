import type { PrismaClient } from '../generated/prisma/client'
import { createClient } from './lib/utils'

// eslint-disable-next-line ts/consistent-type-assertions
const global = globalThis as unknown as {
  prismaClients?: Map<string, PrismaClient>
}
const prismaClients = global.prismaClients ?? new Map<string, PrismaClient>()

if (process.env.NODE_ENV !== 'production') {
  global.prismaClients = prismaClients
}

export function newDatabase(connectionString: string): PrismaClient {
  // If we already have a client for this URL, return it
  const cached = prismaClients.get(connectionString)
  if (cached) {
    return cached
  }

  // Otherwise, create a new one, cache it, and return it
  const client = createClient(connectionString)
  prismaClients.set(connectionString, client)

  return client
}

export type Tx = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0]
export * from '../generated/prisma/client'
