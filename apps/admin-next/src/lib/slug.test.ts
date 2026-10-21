import { describe, expect, it } from 'vitest'
import { firstLatinName, slugify } from '@/lib/slug'

describe('slugify', () => {
  it('lowercases and hyphenates Latin names', () => {
    expect(slugify('MICHELIN Guide')).toBe('michelin-guide')
    expect(slugify('Noma — Copenhagen (2.0)')).toBe('noma-copenhagen-2-0')
    expect(slugify('  Ta Vie 旅 ')).toBe('ta-vie')
  })

  it('drops apostrophes instead of splitting on them', () => {
    expect(slugify('Asia\'s 50 Best Restaurants')).toBe('asias-50-best-restaurants')
    expect(slugify('L’Atelier de Joël Robuchon')).toBe('latelier-de-joel-robuchon')
  })

  it('reduces accented and special Latin letters', () => {
    expect(slugify('Frantzén')).toBe('frantzen')
    expect(slugify('Kjøbenhavn Straße')).toBe('kjobenhavn-strasse')
    expect(slugify('Œuf à la Łódź')).toBe('oeuf-a-la-lodz')
  })

  it('returns an empty slug for names without Latin letters', () => {
    expect(slugify('黑珍珠餐厅指南')).toBe('')
    expect(slugify('')).toBe('')
    expect(slugify('---')).toBe('')
  })
})

describe('firstLatinName', () => {
  it('picks the first name written in Latin script', () => {
    expect(firstLatinName(['龍景軒', 'Lung King Heen'])).toBe('Lung King Heen')
    expect(firstLatinName(['Amber', '琥珀'])).toBe('Amber')
  })

  it('ignores digits and returns undefined without a Latin name', () => {
    expect(firstLatinName(['2046', 'Amber'])).toBe('Amber')
    expect(firstLatinName(['黑珍珠餐厅指南'])).toBeUndefined()
    expect(firstLatinName([])).toBeUndefined()
  })
})
