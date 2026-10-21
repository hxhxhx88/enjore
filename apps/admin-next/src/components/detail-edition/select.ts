import type { Prisma } from '@repo/db'

export const selectEditionDetail = {
  id: true,
  awardId: true,
  label: true,
  year: true,
  region: true,
  sourceUrl: true,
  expectedCount: true,
  foundCount: true,
  notes: true,
  importedAt: true,
  verifiedAt: true,
  createdAt: true,
  award: { select: { name: true } },
} satisfies Prisma.AwardEditionSelect

export type EditionDetail = Prisma.AwardEditionGetPayload<{ select: typeof selectEditionDetail }>
