import type { Facts } from '@/lib/facts'
import { describe, expect, it } from 'vitest'
import { toFactValue, toFormValues } from '@/components/form-fact/data'
import { formSchema } from '@/components/form-fact/schema'

const facts: Facts = {
  address: { value: 'Shop 12A, Hong Kong Station, Central, Hong Kong', origin: 'google-places' },
  district: { value: null, origin: 'manual' },
  coordinates: { value: { latitude: 22.2849, longitude: 114.1582 }, origin: 'google-places' },
  phone: { value: '+852 2332 3078', origin: 'google-places' },
  website: { value: null, origin: 'google-places' },
  openingHours: { value: { periods: [{ openDay: 1, openTime: '09:00', closeDay: 1, closeTime: '21:00' }] }, origin: 'google-places' },
  businessStatus: { value: 'open', origin: 'google-places' },
}

describe('form-fact data', () => {
  it('fills the field each fact uses and leaves the others empty', () => {
    expect(toFormValues('address', facts)).toEqual({ fact: 'address', text: facts.address.value, latitude: null, longitude: null, businessStatus: null })
    expect(toFormValues('district', facts).text).toBe('')
    expect(toFormValues('coordinates', facts)).toMatchObject({ latitude: 22.2849, longitude: 114.1582, text: '' })
    expect(toFormValues('openingHours', facts).text).toBe('Mon 09:00-21:00')
    expect(toFormValues('businessStatus', facts).businessStatus).toBe('open')
  })

  it('round-trips every fact through the form', () => {
    expect(toFactValue(toFormValues('address', facts))).toEqual({ fact: 'address', value: facts.address.value })
    expect(toFactValue(toFormValues('coordinates', facts))).toEqual({ fact: 'coordinates', value: facts.coordinates.value })
    expect(toFactValue(toFormValues('openingHours', facts))).toEqual({ fact: 'openingHours', value: facts.openingHours.value })
    expect(toFactValue(toFormValues('businessStatus', facts))).toEqual({ fact: 'businessStatus', value: 'open' })
  })

  it('validates the fields of the edited fact only', () => {
    expect(formSchema.safeParse({ fact: 'phone', text: '', latitude: null, longitude: null, businessStatus: null }).success).toBe(false)
    expect(formSchema.safeParse({ fact: 'phone', text: '+852 1', latitude: null, longitude: null, businessStatus: null }).success).toBe(true)
    expect(formSchema.safeParse({ fact: 'website', text: 'timhowan.com', latitude: null, longitude: null, businessStatus: null }).success).toBe(false)
    expect(formSchema.safeParse({ fact: 'coordinates', text: '', latitude: 22, longitude: null, businessStatus: null }).success).toBe(false)
    expect(formSchema.safeParse({ fact: 'openingHours', text: 'Funday 1-2', latitude: null, longitude: null, businessStatus: null }).success).toBe(false)
    expect(formSchema.safeParse({ fact: 'openingHours', text: 'Daily 11:00-22:00', latitude: null, longitude: null, businessStatus: null }).success).toBe(true)
    expect(formSchema.safeParse({ fact: 'businessStatus', text: '', latitude: null, longitude: null, businessStatus: null }).success).toBe(false)
  })

  it('refuses to build a value from an incomplete form', () => {
    expect(() => toFactValue({ fact: 'coordinates', text: '', latitude: 1, longitude: null, businessStatus: null })).toThrow()
    expect(() => toFactValue({ fact: 'openingHours', text: 'nope', latitude: null, longitude: null, businessStatus: null })).toThrow()
  })
})
