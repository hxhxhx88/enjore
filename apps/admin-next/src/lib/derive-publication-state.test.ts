import { describe, expect, it } from 'vitest'
import { derivePublicationState, publicationStates, publicationStateWhere } from '@/lib/derive-publication-state'

describe('derivePublicationState', () => {
  it('is withdrawn whenever withdrawnAt is set', () => {
    expect(derivePublicationState({ withdrawnAt: new Date(), profile: { id: 'p' } })).toBe('withdrawn')
    expect(derivePublicationState({ withdrawnAt: new Date(), profile: null })).toBe('withdrawn')
  })

  it('is published with a profile and unpublished without', () => {
    expect(derivePublicationState({ withdrawnAt: null, profile: { id: 'p' } })).toBe('published')
    expect(derivePublicationState({ withdrawnAt: null, profile: null })).toBe('unpublished')
  })
})

describe('publicationStateWhere', () => {
  it('mirrors the rule as a where clause for every state', () => {
    expect(publicationStates.map(publicationStateWhere)).toEqual([
      { withdrawnAt: null, profile: null },
      { withdrawnAt: null, profile: { isNot: null } },
      { withdrawnAt: { not: null } },
    ])
  })
})
