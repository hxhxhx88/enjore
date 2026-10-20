import type { JSX, ReactNode } from 'react'
import { colors } from '@repo/email/lib/colors'
import { Body, Container, Head, Html, Preview } from 'react-email'
import { EmailLogo } from './email-logo'

interface EmailContainerProps {
  children: ReactNode
  preview: string
}

const fontFamily = [
  'ui-sans-serif',
  'system-ui',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji',
].join(', ')

export function EmailContainer({ children, preview }: EmailContainerProps): JSX.Element {
  return (
    <Html>
      <Head>
        <meta
          // The template uses the dark theme colors. Declaring the color scheme keeps clients from re-tinting it.
          // https://github.com/resend/react-email/issues/662#issuecomment-2424750387
          name="color-scheme"
          content="dark"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ background: colors.background, fontFamily }}>
        <Container style={{ padding: 16 }}>
          <EmailLogo size={64} />
          <div style={{ marginTop: 64 }}>{children}</div>
        </Container>
      </Body>
    </Html>
  )
}
