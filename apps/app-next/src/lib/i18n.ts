import type { I18n } from '@lingui/core'
import type { Locale } from '@repo/i18n/locales'
import type { NextRequest } from 'next/server'
import { setupI18n as createI18n, i18n as i18nGlobal } from '@lingui/core'
import { setI18n } from '@lingui/react/server'
import { defaultLocale, locales, localeSchema } from '@repo/i18n/locales'
import { setupI18nInstance } from '@repo/i18n/server'
import Negotiator from 'negotiator'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function hintRequestLocale({ acceptLanguage }: { acceptLanguage: string | undefined }): Locale {
  const languages = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  }).languages([...locales])

  if (languages.length === 0) {
    return defaultLocale
  }

  return localeSchema.catch(defaultLocale).parse(languages[0])
}

const i18nCookieName = 'APP_LOCALE'

// See:
// - https://nextjs.org/docs/app/building-your-application/routing/internationalization
// - https://github.com/lingui/js-lingui/blob/d36c323c2151f91b05305809bc9a6d291528aed2/examples/nextjs-swc/src/middleware.ts
//
// The proxy has no access to `cookies()` from `next/headers`: read cookies from the request and write them on the
// response that is returned.
export function i18nMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const currLocale = locales.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)

  if (currLocale) {
    const response = NextResponse.next()
    response.cookies.set(i18nCookieName, currLocale)

    return response
  }

  // Redirect if there is no locale
  const fromCookie = localeSchema.safeParse(request.cookies.get(i18nCookieName)?.value).data
  const fromHeader = hintRequestLocale({
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  })
  const locale = fromCookie ?? fromHeader

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  const response = NextResponse.redirect(url)
  response.cookies.set(i18nCookieName, locale)

  return response
}

export async function setupI18n(localeString: string): Promise<{ i18n: I18n, locale: Locale }> {
  const { i18n, locale } = await setupI18nInstance(i18nGlobal, localeString)
  setI18n(i18n)

  return { i18n, locale }
}

// Server actions have no route params and run concurrently: build a private instance from the locale cookie that the
// proxy sets on every localized page visit, instead of activating a locale on the global instance.
export async function getRequestI18n(): Promise<I18n> {
  const cookieStore = await cookies()
  const { i18n } = await setupI18nInstance(createI18n(), cookieStore.get(i18nCookieName)?.value ?? defaultLocale)

  return i18n
}
