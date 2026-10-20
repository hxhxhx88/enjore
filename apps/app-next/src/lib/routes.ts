import type { Locale } from '@repo/i18n/locales'
import type { Route } from 'next'

// Literal types keep these compatible with Next.js typed routes.
export const routes = {
  home: (locale: Locale): Route<`/${Locale}`> => `/${locale}`,
  signIn: (locale: Locale): Route<`/${Locale}/sign-in`> => `/${locale}/sign-in`,
  account: (locale: Locale): Route<`/${Locale}/account`> => `/${locale}/account`,
} as const
