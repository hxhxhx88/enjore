import { describe, expect, it } from 'vitest'
import { toData, toFormValues } from '@/components/form-award-edition/data'

describe('form-award-edition data', () => {
  it('maps empty strings to null and keeps numbers', () => {
    expect(toData({ label: 'Hong Kong Macau 2026', year: 2026, region: '  ', sourceUrl: '', expectedCount: 200, notes: '' })).toEqual({
      label: 'Hong Kong Macau 2026',
      year: 2026,
      region: null,
      sourceUrl: null,
      expectedCount: 200,
      notes: null,
    })
  })

  it('round-trips an edition through the form values', () => {
    const edition = {
      label: 'Asia 2025',
      year: 2025,
      region: 'Asia',
      sourceUrl: 'https://www.theworlds50best.com/asia/en/list/1-50',
      expectedCount: null,
      notes: 'Includes 51 to 100.',
    }

    expect(toFormValues({ ...edition, expectedCount: null })).toEqual({ ...edition, expectedCount: null })
    expect(toData(toFormValues(edition))).toEqual(edition)
    expect(toFormValues({ ...edition, region: null, notes: null }).region).toBe('')
  })
})
