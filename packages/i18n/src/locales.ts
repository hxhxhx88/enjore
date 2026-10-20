import { z } from 'zod'

export const locales = ['en-us', 'zh-cn'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = locales[0]

export const localeSchema = z.enum(locales)

export const localeNativeNames: Record<Locale, string> = {
  'en-us': 'English (US)',
  'zh-cn': '简体中文',
} as const
