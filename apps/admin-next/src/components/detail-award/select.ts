import type { Prisma } from '@repo/db'

export const selectAwardDetail = {
  id: true,
  name: true,
  nameLocale: true,
  shortName: true,
  slug: true,
  website: true,
  hasTier: true,
  hasRank: true,
  hasLabel: true,
  scoreMax: true,
  isActive: true,
  // Level 1 is the highest distinction, so ascending shows the top tier first.
  tiers: {
    select: { id: true, name: true, level: true, glyphKey: true, glyphCount: true },
    orderBy: { level: 'asc' },
  },
  editions: {
    select: {
      id: true,
      label: true,
      year: true,
      region: true,
      sourceUrl: true,
      expectedCount: true,
      foundCount: true,
      notes: true,
      importedAt: true,
      verifiedAt: true,
    },
    orderBy: [{ year: 'desc' }, { label: 'asc' }],
  },
  _count: { select: { sourceReferences: true } },
} satisfies Prisma.AwardSelect

export type AwardDetail = Prisma.AwardGetPayload<{ select: typeof selectAwardDetail }>
export type TierRow = AwardDetail['tiers'][number]
export type EditionRow = AwardDetail['editions'][number]
