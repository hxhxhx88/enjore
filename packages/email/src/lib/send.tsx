import type { JSX } from 'react'
import { env } from '@repo/email/lib/env'
import * as postmark from 'postmark'
import { render, toPlainText } from 'react-email'

export interface SendEmailInput {
  fromName: string
  to: string
  subject: string
  // A rendered template from `@repo/email/templates/*`.
  element: JSX.Element
}

// Renders a template and delivers it through Postmark from the configured sender address.
export async function sendEmail({ fromName, to, subject, element }: SendEmailInput): Promise<void> {
  const client = new postmark.ServerClient(env.POSTMARK_API_KEY)
  const html = await render(element)

  await client.sendEmail({
    From: `${fromName} <${env.EMAIL_SENDER}>`,
    To: to,
    Subject: subject,
    HtmlBody: html,
    // A plain-text alternative improves deliverability and accessibility.
    TextBody: toPlainText(html),
    MessageStream: env.POSTMARK_MESSAGE_STREAM,
  })
}
