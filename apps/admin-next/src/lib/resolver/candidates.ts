import type { Prisma, PrismaClient } from '@repo/db'
import type { ImportCandidate } from '@repo/lib/schemas/import-entry'
import type { Coordinates } from '@/lib/coordinates'
import { isBlocking, thresholds } from './decide'
import { distanceMeters } from './distance'
import { addressSimilarity, nameSimilarity } from './similarity'

// A candidate as the operator sees it: the stored shape of `import_entries.candidates` plus what the list shows.
export interface CandidateView extends ImportCandidate {
  name: string
  nameLocale: string
  address: string | null
  district: string | null
  slug: string
  chain: { id: string, name: string } | null
  blocking: boolean
}

export interface FindCandidatesInput {
  region: string
  coordinates: Coordinates | null
  names: readonly string[]
  address: string | null
}

// About 500 metres of latitude, and a little less of longitude at these latitudes; the haversine decides within it.
const boxDegrees = 0.005

// Restaurants of one region at most, for a name-only comparison.
const regionLimit = 2000

const maxCandidates = 10

const select = {
  id: true,
  name: true,
  nameLocale: true,
  slug: true,
  address: true,
  district: true,
  latitude: true,
  longitude: true,
  chain: { select: { id: true, name: true } },
} satisfies Prisma.RestaurantSelect

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}

// The restaurants an entry might already be: with coordinates, those of the region within walking distance plus
// those without coordinates whose name is close; without, those of the region whose name is close. Blocking ones
// first, then by name similarity, then by distance; at most ten.
export async function findCandidates(db: PrismaClient, { region, coordinates, names, address }: FindCandidatesInput): Promise<CandidateView[]> {
  const rows = coordinates === null
    ? await db.restaurant.findMany({ where: { region }, select, take: regionLimit })
    : (await Promise.all([
        db.restaurant.findMany({
          where: {
            region,
            latitude: { gte: coordinates.latitude - boxDegrees, lte: coordinates.latitude + boxDegrees },
            longitude: { gte: coordinates.longitude - boxDegrees, lte: coordinates.longitude + boxDegrees },
          },
          select,
        }),
        db.restaurant.findMany({ where: { region, latitude: null }, select, take: regionLimit }),
      ])).flat()

  const translations = rows.length === 0
    ? []
    : await db.translation.findMany({
        where: { table: 'restaurants', field: 'name', recordId: { in: rows.map(row => row.id) } },
        select: { recordId: true, value: true },
      })
  const translatedNames = new Map<string, string[]>()
  for (const { recordId, value } of translations) {
    translatedNames.set(recordId, [...(translatedNames.get(recordId) ?? []), value])
  }

  const candidates = rows.flatMap((row): CandidateView[] => {
    const similarity = nameSimilarity(names, [row.name, ...(translatedNames.get(row.id) ?? [])])
    const position = row.latitude !== null && row.longitude !== null ? { latitude: row.latitude, longitude: row.longitude } : null
    const distance = coordinates !== null && position !== null ? distanceMeters(coordinates, position) : null
    const within = distance !== null && distance <= thresholds.candidateDistanceMeters
    if (!within && similarity < thresholds.candidateName) {
      return []
    }
    const addressScore = address !== null && row.address !== null ? addressSimilarity(address, row.address) : null

    return [{
      restaurantId: row.id,
      nameSimilarity: round(similarity),
      ...(distance === null ? {} : { distanceMeters: Math.round(distance) }),
      ...(addressScore === null ? {} : { addressSimilarity: round(addressScore) }),
      name: row.name,
      nameLocale: row.nameLocale,
      address: row.address,
      district: row.district,
      slug: row.slug,
      chain: row.chain,
      blocking: isBlocking({ nameSimilarity: similarity, distanceMeters: distance, inChain: row.chain !== null }),
    }]
  })

  candidates.sort((a, b) =>
    Number(b.blocking) - Number(a.blocking)
    || b.nameSimilarity - a.nameSimilarity
    || (a.distanceMeters ?? Number.POSITIVE_INFINITY) - (b.distanceMeters ?? Number.POSITIVE_INFINITY))

  return candidates.slice(0, maxCandidates)
}
