import { describe, expect, it } from 'vitest'
import { factInputOf, factKeys, factValueSchema, formatCoordinates, readFacts } from '@/lib/facts'

const row = {
  address: 'Shop 12A, Hong Kong Station, Central, Hong Kong',
  addressOrigin: 'google-places',
  district: null,
  districtOrigin: 'manual',
  latitude: 22.2849,
  longitude: 114.1582,
  coordinatesOrigin: 'google-places',
  phone: '+852 2332 3078',
  phoneOrigin: 'manual',
  website: null,
  websiteOrigin: 'google-places',
  openingHours: { periods: [{ openDay: 1, openTime: '09:00', closeDay: 1, closeTime: '21:00' }] },
  openingHoursOrigin: 'google-places',
  businessStatus: 'open',
  businessStatusOrigin: 'agent',
}

describe('readFacts', () => {
  it('parses the columns into typed facts with their origins', () => {
    const facts = readFacts(row)

    expect(facts.address).toEqual({ value: row.address, origin: 'google-places' })
    expect(facts.district).toEqual({ value: null, origin: 'manual' })
    expect(facts.coordinates).toEqual({ value: { latitude: 22.2849, longitude: 114.1582 }, origin: 'google-places' })
    expect(facts.openingHours.value).toEqual(row.openingHours)
    expect(facts.businessStatus).toEqual({ value: 'open', origin: 'agent' })
  })

  it('treats a lone latitude or longitude as no coordinates', () => {
    expect(readFacts({ ...row, longitude: null }).coordinates.value).toBeNull()
  })

  it('rejects an unknown origin or status', () => {
    expect(() => readFacts({ ...row, phoneOrigin: 'elsewhere' })).toThrow()
    expect(() => readFacts({ ...row, businessStatus: 'OPERATIONAL' })).toThrow()
  })
})

describe('factInputOf', () => {
  it('turns every fact back into a write input', () => {
    const facts = readFacts(row)
    expect(factKeys.map(key => factInputOf(facts, key))).toEqual([
      { fact: 'address', value: row.address },
      { fact: 'district', value: null },
      { fact: 'coordinates', value: { latitude: 22.2849, longitude: 114.1582 } },
      { fact: 'phone', value: row.phone },
      { fact: 'website', value: null },
      { fact: 'openingHours', value: row.openingHours },
      { fact: 'businessStatus', value: 'open' },
    ])
  })
})

describe('factValueSchema', () => {
  it('validates each fact by its own rule', () => {
    expect(factValueSchema.safeParse({ fact: 'website', value: 'not a url' }).success).toBe(false)
    expect(factValueSchema.safeParse({ fact: 'website', value: 'https://www.timhowan.com/' }).success).toBe(true)
    expect(factValueSchema.safeParse({ fact: 'coordinates', value: { latitude: 91, longitude: 0 } }).success).toBe(false)
    expect(factValueSchema.safeParse({ fact: 'businessStatus', value: 'closed' }).success).toBe(false)
    expect(factValueSchema.safeParse({ fact: 'address', value: '  ' }).success).toBe(false)
  })
})

describe('formatCoordinates', () => {
  it('shows five decimals', () => {
    expect(formatCoordinates({ latitude: 22.2849, longitude: 114.1582 })).toBe('22.28490, 114.15820')
  })
})
