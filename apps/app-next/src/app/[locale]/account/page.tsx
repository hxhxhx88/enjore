import type { Metadata } from 'next'
import type { JSX } from 'react'
import { msg } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Button } from '@repo/ui-web/primitives/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { setupI18n } from '@/lib/i18n'
import { routes } from '@/lib/routes'
import { getSession } from '@/lib/session'
import { ButtonSignOut } from './button-sign-out'

export async function generateMetadata({ params }: Pick<PageProps<'/[locale]/account'>, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const { i18n } = await setupI18n(locale)

  // A private page is never indexed.
  return { title: i18n._(msg`Account`), robots: { index: false, follow: false } }
}

export default async function Page({ params }: PageProps<'/[locale]/account'>): Promise<JSX.Element> {
  const { locale: localeString } = await params
  const { locale } = await setupI18n(localeString)

  const session = await getSession()
  if (!session) {
    redirect(routes.signIn(locale))
  }
  const { email } = session.user

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-medium">
        <Trans>Account</Trans>
      </h1>
      <p className="text-muted-foreground">
        <Trans>Signed in as {email}</Trans>
      </p>
      <div className="flex gap-2">
        <Button variant="outline" nativeButton={false} render={<Link href={routes.home(locale)} />}>
          <Trans>Back to home</Trans>
        </Button>
        <ButtonSignOut />
      </div>
    </div>
  )
}
