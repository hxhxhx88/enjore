import type { I18n, Messages } from '@lingui/core'
import type { Locale } from './locales'
import { defaultLocale, localeSchema } from './locales'

export async function setupI18nInstance(i18n: I18n, localeString: string): Promise<{ i18n: I18n, locale: Locale }> {
  const locale = localeSchema.catch(defaultLocale).parse(localeString)

  // eslint-disable-next-line ts/consistent-type-assertions
  const { messages } = (await import(`../locales/${locale}/messages.po`)) as {
    messages: Messages
  }

  i18n.load(locale, messages)
  i18n.activate(locale)

  return { i18n, locale }
}
