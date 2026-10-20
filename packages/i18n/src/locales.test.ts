import { describe, expect, it } from 'vitest'
import { defaultLocale, localeNativeNames, locales, localeSchema } from './locales'

describe('locales', () => {
  it('includes the default locale', () => {
    expect(locales).toContain(defaultLocale)
  })

  it('has a native name for every locale', () => {
    for (const locale of locales) {
      expect(localeNativeNames[locale]).toBeTruthy()
    }
  })

  it('parses supported locales and rejects others', () => {
    expect(localeSchema.parse('zh-cn')).toBe('zh-cn')
    expect(localeSchema.safeParse('fr-fr').success).toBe(false)
    expect(localeSchema.catch(defaultLocale).parse('fr-fr')).toBe(defaultLocale)
  })
})
