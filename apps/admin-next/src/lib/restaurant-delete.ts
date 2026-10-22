import type { PrismaClient } from '@repo/db'

const transactionTimeoutMs = 15_000

// Removes a restaurant with everything that belongs to it. The profile and the draft go first by hand, because the
// `Restrict` on their poster artwork and the `Cascade` from the restaurant collide inside one cascading delete; the
// artworks and the restaurant follow, and the cascade takes the accolades, references and jobs. Translation rows
// have no foreign key, so the ones of the restaurant, its profile, its draft and its accolades are deleted last.
// Import entries that pointed at the restaurant become unresolved again through `SetNull`, as the schema intends.
// Objects in R2 are removed from milestone 0004 on.
export async function deleteRestaurant(db: PrismaClient, id: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const { profile, draft, accolades } = await tx.restaurant.findUniqueOrThrow({
      where: { id },
      select: {
        profile: { select: { id: true } },
        draft: { select: { id: true } },
        accolades: { select: { id: true } },
      },
    })

    await tx.restaurantProfile.deleteMany({ where: { restaurantId: id } })
    await tx.restaurantProfileDraft.deleteMany({ where: { restaurantId: id } })
    await tx.posterArtwork.deleteMany({ where: { restaurantId: id } })
    await tx.restaurant.delete({ where: { id } })

    await tx.translation.deleteMany({
      where: {
        OR: [
          { table: 'restaurants', recordId: id },
          ...(profile === null ? [] : [{ table: 'restaurant_profiles', recordId: profile.id }]),
          ...(draft === null ? [] : [{ table: 'restaurant_profile_drafts', recordId: draft.id }]),
          ...accolades.map(accolade => ({ table: 'accolades', recordId: accolade.id })),
        ],
      },
    })
  }, { timeout: transactionTimeoutMs })
}
