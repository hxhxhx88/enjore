import { describe, expect, it } from 'vitest'
import { decide, isBlocking, isTrusted, thresholds } from '@/lib/resolver/decide'

describe('isTrusted', () => {
  it('trusts a strong name alone', () => {
    expect(isTrusted(0.8, null)).toBe(true)
    expect(isTrusted(0.79, null)).toBe(false)
  })

  it('trusts a weaker name when the address agrees', () => {
    expect(isTrusted(0.5, 0.5)).toBe(true)
    expect(isTrusted(0.5, 0.49)).toBe(false)
    expect(isTrusted(0.49, 1)).toBe(false)
  })
})

describe('isBlocking', () => {
  it('blocks a similar name within walking distance', () => {
    expect(isBlocking({ nameSimilarity: 0.6, distanceMeters: 300, inChain: false })).toBe(true)
    expect(isBlocking({ nameSimilarity: 0.59, distanceMeters: 10, inChain: false })).toBe(false)
    expect(isBlocking({ nameSimilarity: 1, distanceMeters: 301, inChain: false })).toBe(false)
    expect(isBlocking({ nameSimilarity: 1, distanceMeters: null, inChain: false })).toBe(false)
  })

  it('never blocks on a branch of a chain', () => {
    expect(isBlocking({ nameSimilarity: 1, distanceMeters: 0, inChain: true })).toBe(false)
  })

  it('exposes the thresholds the doc names', () => {
    expect(thresholds).toEqual({ trustName: 0.8, trustNameWithAddress: 0.5, trustAddress: 0.5, candidateName: 0.6, candidateDistanceMeters: 300 })
  })
})

describe('decide', () => {
  const facts = { placeId: 'p' }

  it('matches the listing owner before anything else', () => {
    expect(decide({ listingOwner: 'r1', place: { owner: 'r2', facts }, candidates: [] })).toEqual({ type: 'matched', restaurantId: 'r1', via: 'listing' })
  })

  it('matches the owner of the place id', () => {
    expect(decide({ listingOwner: null, place: { owner: 'r2', facts }, candidates: [{ blocking: true }] })).toEqual({ type: 'matched', restaurantId: 'r2', via: 'place' })
  })

  it('creates on a trusted place nobody owns when no candidate blocks', () => {
    expect(decide({ listingOwner: null, place: { owner: null, facts }, candidates: [{ blocking: false }] })).toEqual({ type: 'new', place: facts })
  })

  it('waits for the operator on a blocking candidate or without a trusted place', () => {
    expect(decide({ listingOwner: null, place: { owner: null, facts }, candidates: [{ blocking: true }] })).toEqual({ type: 'unresolved' })
    expect(decide({ listingOwner: null, place: null, candidates: [] })).toEqual({ type: 'unresolved' })
  })
})
