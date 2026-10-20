'use server'

import type { FormTypeCode } from './form-code'
import { msg } from '@lingui/core/macro'
import { verificationPayloadSchemaSignIn } from '@repo/lib/schemas/verification-payload'
import { z } from 'zod'
import { secretMatches } from '@/lib/crypto'
import { connectDatabase } from '@/lib/db'
import { getRequestI18n } from '@/lib/i18n'
import { createSession, setSessionCookie } from '@/lib/session'
import { codeLength, maxVerificationAttempts } from '@/lib/verification'

interface Input extends FormTypeCode {
  publicCode: string
}

interface OutputOk {
  type: 'ok'
}

interface OutputBad {
  type: 'bad'
  message: string
}

type Output = OutputOk | OutputBad

// The input arrives from the network, so it is validated again on the server.
const inputSchema = z.object({
  publicCode: z.string().min(1),
  code: z.string().length(codeLength).regex(/^\d+$/),
})

export async function actionVerifyCode(input: Input): Promise<Output> {
  const i18n = await getRequestI18n()
  const incorrect: OutputBad = { type: 'bad', message: i18n._(msg`The code is incorrect or expired.`) }

  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return incorrect
  }
  const { publicCode, code } = parsed.data

  const db = await connectDatabase()
  const verification = await db.verification.findUnique({
    where: { id: publicCode },
    select: { codeHash: true, payloadJson: true, expiresAt: true },
  })
  if (!verification || verification.expiresAt < new Date()) {
    return incorrect
  }

  // A code of another verification type is not a sign-in code.
  const payload = verificationPayloadSchemaSignIn.safeParse(JSON.parse(verification.payloadJson))
  if (!payload.success) {
    return incorrect
  }
  const { email } = payload.data

  if (!secretMatches(code, verification.codeHash)) {
    // Count the failure; the code is discarded after too many attempts, so it cannot be guessed.
    const { attempts } = await db.verification.update({
      where: { id: publicCode },
      data: { attempts: { increment: 1 } },
      select: { attempts: true },
    })
    if (attempts >= maxVerificationAttempts) {
      await db.verification.deleteMany({ where: { id: publicCode } })

      return { type: 'bad', message: i18n._(msg`Too many attempts. Request a new code.`) }
    }

    return incorrect
  }

  // Single use: nothing is deleted when a concurrent request already consumed the code.
  const { count } = await db.verification.deleteMany({ where: { id: publicCode } })
  if (count === 0) {
    return incorrect
  }

  const { id: userId } = await db.user.upsert({
    where: { email },
    update: {},
    create: { email },
    select: { id: true },
  })

  const { token, expiresAt } = await createSession(userId)
  await setSessionCookie(token, expiresAt)

  return { type: 'ok' }
}
