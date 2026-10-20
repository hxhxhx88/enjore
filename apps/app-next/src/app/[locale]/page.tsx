import type { JSX } from 'react'
import { msg } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Button } from '@repo/ui-web/primitives/button'
import { ThemeToggle } from '@repo/ui-web/theme-toggle'
import Link from 'next/link'
import { SwitcherLocale } from '@/components/switcher-locale'
import { setupI18n } from '@/lib/i18n'
import { routes } from '@/lib/routes'
import { getSession } from '@/lib/session'

export default async function Page({ params }: PageProps<'/[locale]'>): Promise<JSX.Element> {
  const { locale: localeString } = await params
  const { i18n, locale } = await setupI18n(localeString)
  const session = await getSession()

  return (
    <div className="flex h-screen w-screen items-center justify-center gap-4">
      {session
        ? (
            <Button nativeButton={false} render={<Link href={routes.account(locale)} />}>
              <Trans>Account</Trans>
            </Button>
          )
        : (
            <Button nativeButton={false} render={<Link href={routes.signIn(locale)} />}>
              <Trans>Sign in</Trans>
            </Button>
          )}
      <SwitcherLocale />
      <ThemeToggle
        labels={{
          light: i18n._(msg`Light`),
          dark: i18n._(msg`Dark`),
          system: i18n._(msg`System`),
          toggle: i18n._(msg`Toggle theme`),
        }}
      />
    </div>
  )
}
