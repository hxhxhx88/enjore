import { placeSchema } from '@repo/lib/schemas/google-places'
import { describe, expect, it } from 'vitest'
import { placeHongKong, placeJapan, placeMacau } from '@/lib/places/fixtures'
import { mapPlaceFacts } from '@/lib/places/map-facts'

describe('mapPlaceFacts', () => {
  it('maps a Hong Kong place with its neighborhood and a period closing after midnight', () => {
    const facts = mapPlaceFacts(placeSchema.parse(placeHongKong))

    expect(facts).toEqual({
      placeId: 'ChIJ_hk_tim_ho_wan',
      displayName: 'Tim Ho Wan',
      region: 'hk',
      address: 'Shop 12A, Hong Kong Station, Central, Hong Kong',
      district: 'Central',
      coordinates: { latitude: 22.2849, longitude: 114.1582 },
      phone: '+852 2332 3078',
      website: 'https://www.timhowan.com/',
      openingHours: {
        periods: [
          { openDay: 1, openTime: '09:00', closeDay: 1, closeTime: '21:00' },
          { openDay: 5, openTime: '18:00', closeDay: 6, closeTime: '02:00' },
        ],
      },
      businessStatus: 'open',
    })
  })

  it('falls back to the sublocality for the district and spreads "always open" over the week', () => {
    const facts = mapPlaceFacts(placeSchema.parse(placeMacau))

    expect(facts.region).toBe('mo')
    expect(facts.district).toBe('Cotai')
    expect(facts.website).toBeNull()
    expect(facts.openingHours?.periods).toHaveLength(7)
    expect(facts.openingHours?.periods[0]).toEqual({ openDay: 0, openTime: '00:00', closeDay: 1, closeTime: '00:00' })
    expect(facts.openingHours?.periods[6]).toEqual({ openDay: 6, openTime: '00:00', closeDay: 0, closeTime: '00:00' })
  })

  it('takes the coarsest sublocality of a Japanese address and maps a temporary closure', () => {
    const facts = mapPlaceFacts(placeSchema.parse(placeJapan))

    expect(facts.region).toBe('jp')
    expect(facts.district).toBe('Ginza')
    expect(facts.businessStatus).toBe('temporarily-closed')
    expect(facts.openingHours?.periods).toEqual([
      { openDay: 2, openTime: '11:30', closeDay: 2, closeTime: '14:00' },
      { openDay: 2, openTime: '17:00', closeDay: 2, closeTime: '20:30' },
    ])
  })

  it('leaves unknown values null', () => {
    const facts = mapPlaceFacts(placeSchema.parse({ id: 'x', businessStatus: 'FUTURE_OPENING', regularOpeningHours: { periods: [] } }))

    expect(facts).toEqual({
      placeId: 'x',
      displayName: null,
      region: null,
      address: null,
      district: null,
      coordinates: null,
      phone: null,
      website: null,
      openingHours: null,
      businessStatus: null,
    })
  })
})
