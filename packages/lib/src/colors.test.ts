import { describe, expect, it } from 'vitest'
import { oklchToHsl } from './colors'

describe('oklchToHsl', () => {
  it('converts oklch colors to hsl', () => {
    expect(oklchToHsl('oklch(0.646 0.222 41.116)')).toMatch(/^hsl\(\d+(\.\d+)?, \d+(\.\d+)?%, \d+(\.\d+)?%\)$/)
  })

  it('preserves the alpha channel', () => {
    expect(oklchToHsl('oklch(0.646 0.222 41.116 / 10%)')).toMatch(/^hsla\(.+, 0\.1\)$/)
  })

  it('returns the input when it cannot be parsed', () => {
    expect(oklchToHsl('not-a-color')).toBe('not-a-color')
  })
})
