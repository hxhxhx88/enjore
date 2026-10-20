'use server'

import { clearSessionCookie, deleteSession, getSession } from '@/lib/session'

// Revokes the session on the server, so the cookie value cannot be reused.
export async function actionSignOut(): Promise<void> {
  const session = await getSession()
  if (session) {
    await deleteSession(session.id)
  }

  await clearSessionCookie()
}
