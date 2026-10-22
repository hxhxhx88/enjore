import { describe, expect, it } from 'vitest'
import { addressSimilarity, diceBigrams, nameSimilarity } from '@/lib/resolver/similarity'

describe('diceBigrams', () => {
  it('scores the same name 1 whatever its case and punctuation', () => {
    expect(diceBigrams('Tim Ho Wan', 'TIM HO WAN')).toBe(1)
    expect(diceBigrams('添好運', '添好運')).toBe(1)
  })

  it('scores a longer variant below the trust threshold', () => {
    expect(diceBigrams('Tim Ho Wan', 'Tim Ho Wan Central')).toBeCloseTo(0.667, 3)
    expect(diceBigrams('添好運', '添好運點心專門店')).toBeCloseTo(0.444, 3)
  })

  it('scores unrelated names near 0 and empty names 0', () => {
    expect(diceBigrams('Tim Ho Wan', 'Lung King Heen')).toBeLessThan(0.2)
    expect(diceBigrams('', '')).toBe(0)
    expect(diceBigrams('a', 'ab')).toBe(0)
  })
})

describe('nameSimilarity', () => {
  it('takes the best pair across both name lists', () => {
    expect(nameSimilarity(['添好運', 'Tim Ho Wan'], ['Tim Ho Wan (Central)', 'Dim Sum Specialists'])).toBeCloseTo(0.667, 3)
    expect(nameSimilarity(['添好運', 'Tim Ho Wan'], ['Dim Sum Specialists', '添好運'])).toBe(1)
    expect(nameSimilarity(['添好運'], ['Tim Ho Wan'])).toBe(0)
    expect(nameSimilarity([], ['Tim Ho Wan'])).toBe(0)
  })
})

describe('addressSimilarity', () => {
  it('ignores the territory, order and punctuation', () => {
    expect(addressSimilarity('Shop 12A, Hong Kong Station, Central, Hong Kong', 'Central, Hong Kong Station, Shop 12A')).toBe(1)
    expect(addressSimilarity(
      'Shop 12A, Hong Kong Station, Central, Hong Kong',
      'Shop 12A, Hong Kong Station, Podium Level 1, IFC Mall, Central',
    )).toBeCloseTo(0.615, 3)
  })

  it('compares Chinese addresses by character bigrams', () => {
    expect(addressSimilarity('香港中環皇后大道中1號', '中環皇后大道中1號')).toBe(1)
    expect(addressSimilarity('中環皇后大道中1號', '尖沙咀彌敦道20號')).toBeLessThan(0.2)
  })
})
