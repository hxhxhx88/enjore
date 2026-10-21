import { describe, expect, it } from 'vitest'
import { toData, toFormValues } from '@/components/form-award/data'
import { defaultValues } from '@/components/form-award/schema'

describe('form-award data', () => {
  it('maps empty strings to null and the score switch to scoreMax', () => {
    expect(toData({ ...defaultValues, name: 'La Liste', slug: 'la-liste', hasScore: true, scoreMax: 100 })).toEqual({
      name: 'La Liste',
      nameLocale: 'en-us',
      shortName: null,
      slug: 'la-liste',
      website: null,
      hasTier: false,
      hasRank: false,
      hasLabel: false,
      scoreMax: 100,
      isActive: true,
    })
  })

  it('drops a maximum score when the score facet is off', () => {
    expect(toData({ ...defaultValues, name: 'X', slug: 'x', hasScore: false, scoreMax: 50 }).scoreMax).toBeNull()
  })

  it('round-trips an award through the form values', () => {
    const award = {
      name: 'MICHELIN Guide',
      nameLocale: 'en-us',
      shortName: 'MICHELIN',
      slug: 'michelin-guide',
      website: 'https://guide.michelin.com',
      hasTier: true,
      hasRank: false,
      hasLabel: false,
      scoreMax: null,
      isActive: false,
    }

    expect(toFormValues(award)).toEqual({ ...award, shortName: 'MICHELIN', website: 'https://guide.michelin.com', hasScore: false })
    expect(toData(toFormValues(award))).toEqual(award)
  })
})
