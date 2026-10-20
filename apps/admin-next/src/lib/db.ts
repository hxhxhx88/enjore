import type { PrismaClient } from '@repo/db'
import { newDatabase } from '@repo/db'
import { databaseCookieName, parseAllowedHosts, resolveDatabaseUrl } from '@repo/lib/database-switch'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { env } from './env'

// Every database access goes through this function, so the database can be selected per request. By default it is the
// configured one and no cookie is read. With `DEV_ALLOW_DATABASE_SWITCH` on, a request may select another database
// through a cookie, limited to the hosts in `DEV_DATABASE_SWITCH_HOSTS`.
// See `docs/implementation/0002-database-switch.md`.
export async function connectDatabase(): Promise<PrismaClient> {
  if (!env.DEV_ALLOW_DATABASE_SWITCH) {
    return newDatabase(env.DATABASE_URL)
  }

  const cookieStore = await cookies()

  return newDatabase(resolveDatabaseUrl({
    requestedUrl: cookieStore.get(databaseCookieName)?.value,
    defaultUrl: env.DATABASE_URL,
    allowedHosts: parseAllowedHosts(env.DEV_DATABASE_SWITCH_HOSTS),
  }))
}

export function parseDatabaseError(e: unknown): { message: string } | undefined {
  const schemaCause = z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('UniqueConstraintViolation'),
      constraint: z.object({
        fields: z.array(z.string()),
      }),
    }),
  ])

  const schemaError = z.object({
    meta: z.object({
      modelName: z.enum(['User']),
      driverAdapterError: z.object({
        cause: schemaCause,
      }),
    }),
  })

  const parsed = schemaError.safeParse(e)

  if (!parsed.success) {
    return undefined
  }

  // The schemas above only accept a unique violation on the `User` model; widen them to report other cases.
  const { fields } = parsed.data.meta.driverAdapterError.cause.constraint
  if (fields.length === 1 && fields[0] === 'email') {
    return { message: 'User email already in use.' }
  }

  return undefined
}
