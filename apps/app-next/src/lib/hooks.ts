import type { Locale } from '@repo/i18n/locales'
import { useLingui } from '@lingui/react'
import { defaultLocale, localeSchema } from '@repo/i18n/locales'

// The locale of the current `[locale]` segment, as activated by the i18n provider.
export function useLocale(): Locale {
  const { i18n } = useLingui()

  return localeSchema.catch(defaultLocale).parse(i18n.locale)
}
