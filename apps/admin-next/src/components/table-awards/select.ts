import type { Prisma } from '@repo/db'

export const select = {
  id: true,
  name: true,
  nameLocale: true,
  shortName: true,
  slug: true,
  hasTier: true,
  hasRank: true,
  hasLabel: true,
  scoreMax: true,
  isActive: true,
  _count: { select: { tiers: true, editions: true } },
} satisfies Prisma.AwardSelect

export type Row = Prisma.AwardGetPayload<{ select: typeof select }>
