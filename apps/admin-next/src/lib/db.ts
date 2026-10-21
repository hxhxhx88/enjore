import type { PrismaClient } from '@repo/db'
import { newDatabase } from '@repo/db'
import { databaseCookieName, parseAllowedHosts, resolveDatabaseUrl } from '@repo/lib/database-switch'
import { cookies } from 'next/headers'
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
