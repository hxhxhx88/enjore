import { describe, expect, it } from 'vitest'
import { importStatuses } from '@/lib/derive-import-status'
import { facetLabels, facets, importStatusLabels } from '@/lib/labels'

describe('labels', () => {
  it('has a sentence-case label for every import status and facet', () => {
    for (const status of importStatuses) {
      expect(importStatusLabels[status]).toMatch(/^[A-Z][a-z ]+$/)
    }
    for (const facet of facets) {
      expect(facetLabels[facet]).toMatch(/^[A-Z][a-z]+$/)
    }
  })
})
