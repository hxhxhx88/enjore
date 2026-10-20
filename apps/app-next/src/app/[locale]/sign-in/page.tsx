import type { Metadata } from 'next'
import type { JSX } from 'react'
import { msg } from '@lingui/core/macro'
import { redirect } from 'next/navigation'
import { SignIn } from '@/components/sign-in'
import { setupI18n } from '@/lib/i18n'
import { routes } from '@/lib/routes'
import { getSession } from '@/lib/session'

export async function generateMetadata({ params }: Pick<PageProps<'/[locale]/sign-in'>, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const { i18n } = await setupI18n(locale)

  return { title: i18n._(msg`Sign in`) }
}

export default async function Page({ params }: PageProps<'/[locale]/sign-in'>): Promise<JSX.Element> {
  const { locale: localeString } = await params
  const { locale } = await setupI18n(localeString)

  if (await getSession()) {
    redirect(routes.account(locale))
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignIn />
    </div>
  )
}
