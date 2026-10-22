import { businessStatuses } from '@repo/lib/schemas/business-status'
import { factOrigins } from '@repo/lib/schemas/fact-origin'
import { describe, expect, it } from 'vitest'
import { importStatuses } from '@/lib/derive-import-status'
import { publicationStates } from '@/lib/derive-publication-state'
import { factKeys } from '@/lib/facts'
import {
  businessStatusLabels,
  facetLabels,
  facets,
  factLabels,
  factOriginLabels,
  importStatusLabels,
  publicationStateLabels,
  regionLabel,
  regionLabels,
} from '@/lib/labels'

describe('labels', () => {
  it('has a sentence-case label for every import status and facet', () => {
    for (const status of importStatuses) {
      expect(importStatusLabels[status]).toMatch(/^[A-Z][a-z ]+$/)
    }
    for (const facet of facets) {
      expect(facetLabels[facet]).toMatch(/^[A-Z][a-z]+$/)
    }
  })

  it('starts every restaurant label with a capital and ends none with a period', () => {
    const labels = [
      ...publicationStates.map(state => publicationStateLabels[state]),
      ...businessStatuses.map(status => businessStatusLabels[status]),
      ...factKeys.map(key => factLabels[key]),
      ...factOrigins.map(origin => factOriginLabels[origin]),
      ...Object.values(regionLabels),
    ]
    for (const label of labels) {
      expect(label).toMatch(/^[A-Z][^.]*[^.\s]$/)
    }
  })

  it('shows an unknown region as its code', () => {
    expect(regionLabel('hk')).toBe('Hong Kong')
    expect(regionLabel('pt')).toBe('PT')
  })
})
