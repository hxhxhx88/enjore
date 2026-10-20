import type { Locale } from '@repo/i18n/locales'
import type { Metadata, Viewport } from 'next'
import type { JSX } from 'react'
import { i18n } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import { locales } from '@repo/i18n/locales'
import { colors } from '@repo/ui-config/colors'
import { Toaster } from '@repo/ui-web/primitives/toast'
import { ThemeProvider } from '@repo/ui-web/theme-provider'
import { Geist, Geist_Mono } from 'next/font/google'
import { ScriptTheme } from '@/components/script-theme'
import { env } from '@/lib/env'
import { setupI18n } from '@/lib/i18n'
import { I18nProvider } from '@/providers/i18n'
import { ReactQueryProvider } from '@/providers/react-query'

import '@/styles/base.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Every locale is prerendered; unknown locales are 404s instead of dynamic renders.
export function generateStaticParams(): Array<{ locale: Locale }> {
  return locales.map(locale => ({ locale }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Pick<LayoutProps<'/[locale]'>, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const { i18n } = await setupI18n(locale)

  return {
    metadataBase: new URL(env.APP_ORIGIN),
    title: { default: 'Starter Template', template: '%s · Starter Template' },
    description: i18n._(msg`A starter template for web applications.`),
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: colors.light.background },
    { media: '(prefers-color-scheme: dark)', color: colors.dark.background },
  ],
}

export default async function Layout({ children, params }: LayoutProps<'/[locale]'>): Promise<JSX.Element> {
  const { locale: localeString } = await params
  const { locale } = await setupI18n(localeString)

  return (
    // `suppressHydrationWarning`: the theme bootstrap script sets the color scheme class before hydration.
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ScriptTheme />
        <ThemeProvider>
          <I18nProvider locale={locale} messages={i18n.messages}>
            <ReactQueryProvider>
              {/* `isolate` keeps Base UI popups (portaled to the body) above the app content. */}
              <main className="isolate w-full">{children}</main>
            </ReactQueryProvider>
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
