import type { Prisma } from '@repo/db'

export const select = {
  id: true,
  name: true,
  nameLocale: true,
  region: true,
  district: true,
  businessStatus: true,
  withdrawnAt: true,
  googlePlacesRefreshedAt: true,
  chain: { select: { id: true, name: true } },
  // Presence alone says whether the restaurant is published.
  profile: { select: { id: true } },
} satisfies Prisma.RestaurantSelect

export type Row = Prisma.RestaurantGetPayload<{ select: typeof select }>
