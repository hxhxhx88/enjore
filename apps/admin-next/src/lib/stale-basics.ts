import type { Prisma } from '@repo/db'

// Basics refreshed from Places longer ago than this are stale. The list filters by it and the dashboard counts it,
// until the periodic refresh of milestone 0008 keeps them fresh.
export const staleAfterDays = 30

const dayMs = 24 * 60 * 60 * 1000

export function staleBasicsCutoff(): Date {
  return new Date(Date.now() - staleAfterDays * dayMs)
}

// Restaurants with a Google place whose facts were never refreshed, or not since the cutoff.
export function staleBasicsWhere(cutoff: Date): Prisma.RestaurantWhereInput {
  return {
    googlePlaceRef: { not: null },
    OR: [{ googlePlacesRefreshedAt: null }, { googlePlacesRefreshedAt: { lt: cutoff } }],
  }
}
