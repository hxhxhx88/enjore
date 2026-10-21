import { z } from 'zod'

// The locale of stored data, such as a restaurant's canonical name or a translation row: a lowercase BCP 47 tag like
// `zh-hk` or `en-us`. The UI locales in packages/i18n/src/locales.ts are a subset; data may carry locales the UI does
// not have yet, so this schema stays open. It lives here because packages/lib cannot import packages/i18n.
export const localeTagSchema = z.string().regex(/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/)

export type LocaleTag = z.infer<typeof localeTagSchema>
