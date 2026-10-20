import { cookies } from 'next/headers'

import { cache } from 'react'
import { generateSessionToken, hashSecret } from '@/lib/crypto'
import { connectDatabase } from '@/lib/db'
import { env } from '@/lib/env'
import 'server-only'

const sessionCookieName = 'APP_SESSION'

export interface Session {
  id: string
  user: {
    id: string
    email: string
  }
}

// Creates the database row and returns the cookie token. Only the token's hash is stored.
export async function createSession(userId: string): Promise<{ token: string, expiresAt: Date }> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)

  const db = await connectDatabase()
  await db.session.create({
    data: { id: hashSecret(token), userId, expiresAt },
    select: { id: true },
  })

  return { token, expiresAt }
}

export async function deleteSession(sessionId: string): Promise<void> {
  const db = await connectDatabase()
  await db.session.deleteMany({ where: { id: sessionId } })
}

// Cookies can only be written from server actions and route handlers.
export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    // Plain HTTP is only used for local development.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.delete(sessionCookieName)
}

// Deduplicated per request: a layout, a page and its metadata may all ask for the session.
export const getSession = cache(async (): Promise<Session | undefined> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(sessionCookieName)?.value
  if (token === undefined || token === '') {
    return undefined
  }

  const db = await connectDatabase()
  const session = await db.session.findUnique({
    where: { id: hashSecret(token), expiresAt: { gt: new Date() } },
    select: { id: true, user: { select: { id: true, email: true } } },
  })

  return session ?? undefined
})
