import { describe, expect, it } from 'vitest'
import { localizePathname } from './pathname'

describe('localizePathname', () => {
  it('replaces an existing locale segment', () => {
    expect(localizePathname('/en-us', 'zh-cn')).toBe('/zh-cn')
    expect(localizePathname('/en-us/privacy-policy', 'zh-cn')).toBe('/zh-cn/privacy-policy')
  })

  it('prefixes paths without a locale', () => {
    expect(localizePathname('/', 'en-us')).toBe('/en-us')
    expect(localizePathname('/privacy-policy', 'en-us')).toBe('/en-us/privacy-policy')
  })

  it('keeps nested paths and the current locale intact', () => {
    expect(localizePathname('/zh-cn/a/b', 'zh-cn')).toBe('/zh-cn/a/b')
    expect(localizePathname('/zh-cn/a/b/', 'en-us')).toBe('/en-us/a/b')
  })
})
