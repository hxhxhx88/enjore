'use server'

import type { VerificationPayload } from '@repo/lib/schemas/verification-payload'
import type { FormTypeEmail } from './form-email'
import { msg } from '@lingui/core/macro'
import { emailUserSignIn } from '@repo/email/templates/user-sign-in'
import { z } from 'zod'
import { generateVerificationCode, hashSecret } from '@/lib/crypto'
import { connectDatabase } from '@/lib/db'
import { env } from '@/lib/env'
import { getRequestI18n } from '@/lib/i18n'
import { verificationTtlMinutes } from '@/lib/verification'

type Input = FormTypeEmail

interface OutputOk {
  type: 'ok'
  // Identifies the pending code in the verify step.
  publicCode: string
}

interface OutputBad {
  type: 'bad'
  message: string
}

type Output = OutputOk | OutputBad

// The input arrives from the network, so it is validated again on the server.
const inputSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
})

// The fixed development code applies to every email, or only to the listed testers when the list is set.
function devCodeFor(email: string): string | undefined {
  const devCode = env.DEV_VERIFICATION_PRIVATE_CODE
  if (devCode === undefined) {
    return undefined
  }

  const testers = env.DEV_TESTER_EMAILS?.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== '') ?? []
  if (testers.length > 0 && !testers.includes(email)) {
    return undefined
  }

  return devCode
}

export async function actionSendCode(input: Input): Promise<Output> {
  const i18n = await getRequestI18n()

  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return { type: 'bad', message: i18n._(msg`Email is invalid`) }
  }
  const { email } = parsed.data

  const devCode = devCodeFor(email)
  const code = devCode ?? generateVerificationCode()
  const expiresAt = new Date(Date.now() + verificationTtlMinutes * 60 * 1000)

  const payload: VerificationPayload = { type: 'sign-in', email }

  const db = await connectDatabase()
  const { id: publicCode } = await db.verification.create({
    data: { codeHash: hashSecret(code), payloadJson: JSON.stringify(payload), expiresAt },
    select: { id: true },
  })

  if (devCode === undefined) {
    // Loaded on demand, so development with the fixed code needs no email configuration.
    const { sendEmail } = await import('@repo/email/lib/send')

    await sendEmail({
      fromName: 'Enjore',
      to: email,
      subject: i18n._(msg`${code} is your sign-in code`),
      element: emailUserSignIn({
        code,
        messages: {
          header: i18n._(msg`Your sign-in code`),
          footer: i18n._(msg`This code will only be valid for the next ${verificationTtlMinutes} minutes.`),
        },
      }),
    })
  }

  return { type: 'ok', publicCode }
}
