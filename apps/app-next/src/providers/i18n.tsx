'use client'

import type { Messages } from '@lingui/core'
import type { Locale } from '@repo/i18n/locales'
import type { JSX, ReactNode } from 'react'
import { setupI18n } from '@lingui/core'
import { I18nProvider as Provider } from '@lingui/react'
import { useMemo } from 'react'

interface I18nClientProviderProps {
  locale: Locale
  messages: Messages
  children: ReactNode
}

export function I18nProvider({ locale, messages, children }: I18nClientProviderProps): JSX.Element {
  const i18n = useMemo(() => {
    return setupI18n({ locale, messages: { [locale]: messages } })
  }, [locale, messages])

  return <Provider i18n={i18n}>{children}</Provider>
}
