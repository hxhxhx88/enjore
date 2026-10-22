import type { PrismaClient } from '@repo/db'
import type { PlaceFacts } from '@/lib/places/map-facts'
import { parseDatabaseError, violatesUniqueKey } from './db-error'
import { factsByHand, factsFromPlace } from './fact-update'
import { firstLatinName, slugify } from './slug'

interface RestaurantName {
  value: string
  locale: string
}

// What a new restaurant is made of: its names (canonical plus the other official ones, which become Translation
// rows), a slug or none to derive one, the region, the place it resolved to or the address typed by hand, and the
// guide listing when it came from an import. Shared by "Add restaurant", "Paste a list" (0003) and the agent's
// tool (0005).
export interface RestaurantCreateInput {
  name: string
  nameLocale: string
  otherNames: readonly RestaurantName[]
  slug: string | null
  region: string
  place: PlaceFacts | null
  address: string | null
  listing: { awardId: string, listingUrl: string } | null
}

export type RestaurantCreateResult
  = | { type: 'created', id: string }
    // The place id or the listing already belongs to a restaurant, which the caller opens instead.
    | { type: 'exists', id: string, via: 'place' | 'listing' }
    | { type: 'bad', message: string }

const transactionTimeoutMs = 15_000

// How many `-2`, `-3`, ... suffixes a derived slug tries before giving up.
const slugRetries = 8

// The slug comes from the first Latin-script name, the place's English display name included, and falls back to the
// place id; the operator can change it on the restaurant page.
function deriveSlug({ name, otherNames, place }: RestaurantCreateInput): string {
  const latin = firstLatinName([name, ...otherNames.map(other => other.value), ...(place?.displayName === null || place?.displayName === undefined ? [] : [place.displayName])])
  const slug = latin === undefined ? '' : slugify(latin)
  if (slug !== '') {
    return slug
  }
  const fromPlace = place === null ? '' : slugify(place.placeId)
  return fromPlace === '' ? 'restaurant' : fromPlace
}

export async function createRestaurant(db: PrismaClient, input: RestaurantCreateInput): Promise<RestaurantCreateResult> {
  const { name, nameLocale, otherNames, region, place, address, listing } = input

  const locales = new Set([nameLocale])
  for (const other of otherNames) {
    if (other.locale === nameLocale) {
      return { type: 'bad', message: `Another name uses the canonical locale ${nameLocale}; give it a different locale or make it canonical.` }
    }
    if (locales.has(other.locale)) {
      return { type: 'bad', message: `Two names share the locale ${other.locale}.` }
    }
    locales.add(other.locale)
  }

  const derived = input.slug === null
  const baseSlug = input.slug ?? deriveSlug(input)

  for (let attempt = 0; ; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`
    try {
      const { id } = await db.$transaction(async (tx) => {
        const restaurant = await tx.restaurant.create({
          data: {
            name,
            nameLocale,
            slug,
            region,
            googlePlaceRef: place?.placeId ?? null,
            googlePlacesRefreshedAt: place === null ? null : new Date(),
            ...(place === null ? factsByHand(address) : factsFromPlace(place)),
          },
          select: { id: true },
        })
        if (otherNames.length > 0) {
          await tx.translation.createMany({
            data: otherNames.map(other => ({ locale: other.locale, table: 'restaurants', recordId: restaurant.id, field: 'name', value: other.value })),
          })
        }
        if (listing !== null) {
          await tx.sourceReference.create({ data: { restaurantId: restaurant.id, awardId: listing.awardId, listingUrl: listing.listingUrl } })
        }
        return restaurant
      }, { timeout: transactionTimeoutMs })
      return { type: 'created', id }
    }
    catch (e) {
      const error = parseDatabaseError(e)
      if (error === undefined) {
        throw e
      }
      if (place !== null && violatesUniqueKey(error, ['google_place_ref'])) {
        const owner = await db.restaurant.findUnique({ where: { googlePlaceRef: place.placeId }, select: { id: true } })
        if (owner !== null) {
          return { type: 'exists', id: owner.id, via: 'place' }
        }
      }
      if (listing !== null && violatesUniqueKey(error, ['award_id', 'listing_url'])) {
        const reference = await db.sourceReference.findUnique({
          where: { awardId_listingUrl: { awardId: listing.awardId, listingUrl: listing.listingUrl } },
          select: { restaurantId: true },
        })
        if (reference !== null) {
          return { type: 'exists', id: reference.restaurantId, via: 'listing' }
        }
      }
      if (derived && attempt < slugRetries && violatesUniqueKey(error, ['slug'])) {
        continue
      }
      return { type: 'bad', message: error.message }
    }
  }
}
