import { describe, expect, it } from 'vitest'
import { factsLanguageCode, searchLanguageCode } from '@/lib/places/language'

describe('searchLanguageCode', () => {
  it('keeps the region for Chinese so the script is implied', () => {
    expect(searchLanguageCode('zh-hk')).toBe('zh-HK')
    expect(searchLanguageCode('zh-cn')).toBe('zh-CN')
    expect(searchLanguageCode('zh-tw')).toBe('zh-TW')
  })

  it('maps script subtags to a region Google accepts', () => {
    expect(searchLanguageCode('zh-hant')).toBe('zh-TW')
    expect(searchLanguageCode('zh-hans')).toBe('zh-CN')
  })

  it('drops the region for other languages', () => {
    expect(searchLanguageCode('en-us')).toBe('en')
    expect(searchLanguageCode('ja-jp')).toBe('ja')
    expect(searchLanguageCode('fr')).toBe('fr')
  })

  it('requests the facts in English', () => {
    expect(factsLanguageCode).toBe('en')
  })
})
