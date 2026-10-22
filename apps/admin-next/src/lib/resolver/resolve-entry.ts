import type { PrismaClient } from '@repo/db'
import type { CandidateView } from './candidates'
import type { MapsUrlInfo } from './maps-url'
import type { Coordinates } from '@/lib/coordinates'
import type { PlacesClient } from '@/lib/places/client'
import type { PlaceFacts } from '@/lib/places/map-facts'
import { factsLanguageCode, searchLanguageCode } from '@/lib/places/language'
import { mapPlaceFacts } from '@/lib/places/map-facts'
import { regionBias, regionCodeOf } from '@/lib/places/regions'
import { findCandidates } from './candidates'
import { decide, isTrusted } from './decide'
import { expandMapsUrl, isShortMapsUrl, parseMapsUrl } from './maps-url'
import { addressSimilarity, nameSimilarity } from './similarity'

interface ResolveEntryName {
  value: string
  locale: string
}

// What is known about the venue to resolve: the names, canonical first; the address; the region the operator chose;
// a Google Maps link; and the guide listing, which "Add restaurant" has none of and the imports of 0003 and 0005 pass.
export interface ResolveEntryInput {
  names: readonly ResolveEntryName[]
  address: string | null
  region: string
  googleMapsUrl: string | null
  listing: { awardId: string, listingUrl: string } | null
}

// One result of the text search, scored against the entry, for the operator to pick from when none is trusted.
export interface PlaceResult {
  placeId: string
  displayName: string | null
  address: string | null
  coordinates: Coordinates | null
  nameSimilarity: number
  addressSimilarity: number | null
}

export type ResolveResult
  = | { type: 'matched', restaurantId: string, via: 'listing' | 'place' }
    | { type: 'new', place: PlaceFacts, candidates: CandidateView[] }
    | { type: 'unresolved', place: PlaceFacts | null, placeResults: PlaceResult[], candidates: CandidateView[] }

// An entry the resolver cannot work with; the message is for the operator.
export class ResolveInputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ResolveInputError'
  }
}

// Around the pin of a Maps link the venue is right there, so the search needs only a short reach.
const linkBiasRadiusMeters = 200

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}

// The match order of the PRD: the guide listing, then the Google place id, then the operator. Everything in the
// result is plain data, so it crosses the server-action boundary to the sheet.
export async function resolveEntry(db: PrismaClient, places: PlacesClient, entry: ResolveEntryInput): Promise<ResolveResult> {
  if (entry.listing !== null) {
    const reference = await db.sourceReference.findUnique({
      where: { awardId_listingUrl: { awardId: entry.listing.awardId, listingUrl: entry.listing.listingUrl } },
      select: { restaurantId: true },
    })
    if (reference !== null) {
      return { type: 'matched', restaurantId: reference.restaurantId, via: 'listing' }
    }
  }

  let link: MapsUrlInfo | undefined
  if (entry.googleMapsUrl !== null) {
    const expanded = isShortMapsUrl(entry.googleMapsUrl) ? await expandMapsUrl(entry.googleMapsUrl) : entry.googleMapsUrl
    link = parseMapsUrl(expanded)
    if (link === undefined) {
      throw new ResolveInputError('Could not read a place from this Google Maps link. Type the name and address instead.')
    }
  }

  // The link's name joins the entry's names for the search and the scoring; a link-only entry has no other.
  const names = [...entry.names.map(name => name.value), ...(link?.name === null || link?.name === undefined ? [] : [link.name])]
  const searchName = names[0]
  if (searchName === undefined) {
    throw new ResolveInputError('A name or a Google Maps link is needed.')
  }

  const canonicalLocale = entry.names[0]?.locale
  let placeResults: PlaceResult[] = []
  let trustedPlaceId = link?.placeId ?? null
  if (trustedPlaceId === null) {
    const results = await places.searchText({
      textQuery: entry.address === null ? searchName : `${searchName} ${entry.address}`,
      languageCode: canonicalLocale === undefined ? factsLanguageCode : searchLanguageCode(canonicalLocale),
      regionCode: regionCodeOf(entry.region),
      locationBias: link?.coordinates === null || link?.coordinates === undefined
        ? regionBias(entry.region)
        : { circle: { center: link.coordinates, radius: linkBiasRadiusMeters } },
    })
    placeResults = results.map((result) => {
      const displayName = result.displayName?.text ?? null
      const address = result.formattedAddress ?? null
      return {
        placeId: result.id,
        displayName,
        address,
        coordinates: result.location ?? null,
        nameSimilarity: displayName === null ? 0 : round(nameSimilarity(names, [displayName])),
        addressSimilarity: entry.address !== null && address !== null ? round(addressSimilarity(entry.address, address)) : null,
      }
    })
    const top = placeResults[0]
    if (top !== undefined && isTrusted(top.nameSimilarity, top.addressSimilarity)) {
      trustedPlaceId = top.placeId
    }
  }

  let place: PlaceFacts | null = null
  let owner: string | null = null
  if (trustedPlaceId !== null) {
    place = mapPlaceFacts(await places.getPlace(trustedPlaceId, { languageCode: factsLanguageCode }))
    const existing = await db.restaurant.findUnique({ where: { googlePlaceRef: trustedPlaceId }, select: { id: true } })
    owner = existing?.id ?? null
  }

  // The place's own region, address and position are better keys than the operator's when there is a place.
  const candidates = owner !== null
    ? []
    : await findCandidates(db, {
        region: place?.region ?? entry.region,
        coordinates: place?.coordinates ?? link?.coordinates ?? null,
        names,
        address: place?.address ?? entry.address,
      })

  const decision = decide({
    listingOwner: null,
    place: place === null ? null : { owner, facts: place },
    candidates,
  })
  switch (decision.type) {
    case 'matched':
      return decision
    case 'new':
      return { type: 'new', place: decision.place, candidates }
    case 'unresolved':
      return { type: 'unresolved', place, placeResults, candidates }
  }
}
