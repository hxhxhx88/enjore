import type { BusinessStatus } from '@repo/lib/schemas/business-status'
import type { FactOrigin } from '@repo/lib/schemas/fact-origin'
import type { ImportStatus } from './derive-import-status'
import type { PublicationState } from './derive-publication-state'
import type { FactKey } from './facts'

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

export const publicationStateLabels: Readonly<Record<PublicationState, string>> = {
  unpublished: 'Unpublished',
  published: 'Published',
  withdrawn: 'Withdrawn',
}

export const businessStatusLabels: Readonly<Record<BusinessStatus, string>> = {
  'open': 'Open',
  'temporarily-closed': 'Temporarily closed',
  'permanently-closed': 'Permanently closed',
}

export const factLabels: Readonly<Record<FactKey, string>> = {
  address: 'Address',
  district: 'District',
  coordinates: 'Coordinates',
  phone: 'Phone',
  website: 'Website',
  openingHours: 'Opening hours',
  businessStatus: 'Business status',
}

export const factOriginLabels: Readonly<Record<FactOrigin, string>> = {
  'google-places': 'Google Places',
  'agent': 'Agent',
  'manual': 'Manual',
}

// The regions the guide meets first; any other lowercase ISO code is accepted and shown as is.
export const regionLabels: Readonly<Record<string, string>> = {
  hk: 'Hong Kong',
  mo: 'Macau',
  cn: 'China',
  tw: 'Taiwan',
  jp: 'Japan',
  sg: 'Singapore',
  kr: 'South Korea',
  th: 'Thailand',
  my: 'Malaysia',
  gb: 'United Kingdom',
  fr: 'France',
  it: 'Italy',
  es: 'Spain',
  us: 'United States',
  au: 'Australia',
}

export function regionLabel(region: string): string {
  return regionLabels[region] ?? region.toUpperCase()
}
