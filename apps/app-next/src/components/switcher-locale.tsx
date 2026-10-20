'use client'

import type { JSX } from 'react'
import { useLingui } from '@lingui/react/macro'
import { localeNativeNames, locales } from '@repo/i18n/locales'
import { localizePathname } from '@repo/i18n/pathname'
import { Button } from '@repo/ui-web/primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui-web/primitives/dropdown-menu'
import { CheckIcon, LanguagesIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/lib/hooks'

// Switches the locale by navigating to the same path under another locale segment.
// The proxy stores the visited locale in the `APP_LOCALE` cookie, so the choice persists.
export function SwitcherLocale(): JSX.Element {
  const { t } = useLingui()
  const pathname = usePathname()
  const current = useLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" aria-label={t`Switch language`} />}>
        <LanguagesIcon />
        {localeNativeNames[current]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map(locale => (
          <DropdownMenuItem
            key={locale}
            render={<Link href={{ pathname: localizePathname(pathname, locale) }} hrefLang={locale} />}
          >
            {localeNativeNames[locale]}
            {locale === current && <CheckIcon className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
