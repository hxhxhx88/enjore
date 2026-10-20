import type { Locale } from './locales'
import { localeSchema } from './locales'

// Returns `pathname` under `locale`, replacing an existing locale segment or prefixing one.
export function localizePathname(pathname: string, locale: Locale): string {
  const [, first = '', ...rest] = pathname.split('/')
  const hasLocale = localeSchema.safeParse(first).success
  const remainder = (hasLocale ? rest : [first, ...rest]).filter(segment => segment !== '').join('/')

  return remainder ? `/${locale}/${remainder}` : `/${locale}`
}
