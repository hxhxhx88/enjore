import { describe, expect, it } from 'vitest'
import { addressTokens, normalizeName } from '@/lib/resolver/normalize'

describe('normalizeName', () => {
  it('lowercases and strips punctuation and spaces', () => {
    expect(normalizeName('Tim Ho Wan (Central)')).toBe('timhowancentral')
    expect(normalizeName('Asia\'s 50 Best')).toBe('asias50best')
  })

  it('folds compatibility forms and keeps CJK characters', () => {
    expect(normalizeName('ＴＩＭ　ＨＯ　ＷＡＮ')).toBe('timhowan')
    expect(normalizeName('添好運（中環）')).toBe('添好運中環')
  })
})

describe('addressTokens', () => {
  it('drops the territory name and splits Latin words', () => {
    expect(addressTokens('Shop 12A, Hong Kong Station, Central, Hong Kong')).toEqual(['shop', '12a', 'station', 'central'])
    expect(addressTokens('HongKong Station')).toEqual(['station'])
  })

  it('turns a run of Chinese characters into bigrams', () => {
    expect(addressTokens('香港中環皇后大道中1號')).toEqual(['中環', '環皇', '皇后', '后大', '大道', '道中', '1', '號'])
  })

  it('keeps a lone CJK character as one token', () => {
    expect(addressTokens('中 1')).toEqual(['中', '1'])
  })
})
