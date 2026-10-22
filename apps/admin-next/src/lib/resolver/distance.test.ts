import { describe, expect, it } from 'vitest'
import { distanceMeters } from '@/lib/resolver/distance'

describe('distanceMeters', () => {
  const central = { latitude: 22.2819, longitude: 114.1584 }

  it('is zero between a point and itself', () => {
    expect(distanceMeters(central, central)).toBe(0)
  })

  it('measures a thousandth of a degree of latitude as about 111 metres', () => {
    expect(distanceMeters(central, { ...central, latitude: central.latitude + 0.001 })).toBeCloseTo(111.2, 0)
  })

  it('shrinks a degree of longitude with the latitude', () => {
    expect(distanceMeters(central, { ...central, longitude: central.longitude + 0.001 })).toBeCloseTo(102.9, 0)
  })

  it('is symmetric', () => {
    const tsimShaTsui = { latitude: 22.2976, longitude: 114.1722 }
    expect(distanceMeters(central, tsimShaTsui)).toBeCloseTo(distanceMeters(tsimShaTsui, central), 6)
    expect(distanceMeters(central, tsimShaTsui)).toBeGreaterThan(2000)
    expect(distanceMeters(central, tsimShaTsui)).toBeLessThan(2500)
  })
})
