import type { JSX } from 'react'
import { CodeDisplay } from '@repo/email/components/code-display'
import { EmailContainer } from '@repo/email/components/email-container'
import { colors } from '@repo/email/lib/colors'
import { Heading, Section, Text } from 'react-email'

interface Props {
  code: string
  messages: {
    header: string
    footer: string
  }
}

export default function emailUserSignIn({ code, messages }: Props): JSX.Element {
  const { header, footer } = messages

  return (
    <EmailContainer preview={header}>
      <Heading style={{ color: colors.foreground, fontSize: '24px', fontWeight: '400' }}>{header}</Heading>
      <Section style={{ marginTop: 24 }}>
        <CodeDisplay code={code} />
      </Section>
      <Text style={{ color: colors.mutedForeground, marginTop: 8 }}>{footer}</Text>
    </EmailContainer>
  )
}

emailUserSignIn.PreviewProps = {
  code: '123456',
  messages: {
    header: 'Your sign-in code',
    footer: 'This code will only be valid for the next 24 hours.',
  },
} satisfies Props

export { emailUserSignIn }
