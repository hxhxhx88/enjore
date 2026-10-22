import type { Prisma } from '@repo/db'
import { z } from 'zod'

export const publicationStates = ['unpublished', 'published', 'withdrawn'] as const
export const publicationStateSchema = z.enum(publicationStates)
export type PublicationState = (typeof publicationStates)[number]

interface Row {
  withdrawnAt: Date | null
  // The published profile, loaded as any non-null selection.
  profile: object | null
}

// The publication state of a restaurant is derived, never stored (see the `Restaurant` comment in the schema):
// withdrawn while `withdrawnAt` is set, else published when a profile row exists, else unpublished.
export function derivePublicationState({ withdrawnAt, profile }: Row): PublicationState {
  if (withdrawnAt !== null) {
    return 'withdrawn'
  }
  if (profile !== null) {
    return 'published'
  }
  return 'unpublished'
}

// The same rule as a filter.
export function publicationStateWhere(state: PublicationState): Prisma.RestaurantWhereInput {
  switch (state) {
    case 'withdrawn':
      return { withdrawnAt: { not: null } }
    case 'published':
      return { withdrawnAt: null, profile: { isNot: null } }
    case 'unpublished':
      return { withdrawnAt: null, profile: null }
  }
}
