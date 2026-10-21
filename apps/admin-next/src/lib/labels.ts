import type { ImportStatus } from './derive-import-status'

// Plain English labels for the admin, which is exempt from i18n (`docs/development/0003-coding/i18n.md`).

// The facets an award may declare, in the order they are shown.
export const facets = ['tier', 'rank', 'score', 'label'] as const
export type Facet = (typeof facets)[number]

export const facetLabels: Readonly<Record<Facet, string>> = {
  tier: 'Tier',
  rank: 'Rank',
  score: 'Score',
  label: 'Label',
}

export const importStatusLabels: Readonly<Record<ImportStatus, string>> = {
  'not-imported': 'Not imported',
  'importing': 'Importing',
  'imported': 'Imported',
  'verified': 'Verified',
}
