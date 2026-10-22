import type { PrismaClient } from '@repo/db'
import type { JobResult } from '@repo/lib/schemas/job-result'
import type { PlacesClient } from './client'
import type { PlaceFacts } from './map-facts'
import type { FactColumnsWrite } from '@/lib/fact-update'
import type { FactKey } from '@/lib/facts'
import { factUpdate, placeFactInput } from '@/lib/fact-update'
import { factInputOf, factKeys, readFacts } from '@/lib/facts'
import { recordInlineJob } from '@/lib/job-inline'
import { PlacesError } from './client'
import { factsLanguageCode } from './language'
import { mapPlaceFacts } from './map-facts'

export type RefreshResult
  = | { type: 'ok', changedFields: FactKey[] }
    | { type: 'bad', message: string }

const transactionTimeoutMs = 15_000

const factColumns = {
  googlePlaceRef: true,
  address: true,
  addressOrigin: true,
  district: true,
  districtOrigin: true,
  latitude: true,
  longitude: true,
  coordinatesOrigin: true,
  phone: true,
  phoneOrigin: true,
  website: true,
  websiteOrigin: true,
  openingHours: true,
  openingHoursOrigin: true,
  businessStatus: true,
  businessStatusOrigin: true,
} as const

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

// Fetches the restaurant's place again and overwrites the facts whose origin is Google Places; facts the operator or
// an agent set are left alone. The refresh is recorded as a finished inline job targeting the restaurant, with the
// changed facts as its result or the Places error. "Refresh from Places" calls it by hand now; the periodic refresh
// of milestone 0008 calls the same function.
export async function refreshRestaurant(db: PrismaClient, places: PlacesClient, restaurantId: string): Promise<RefreshResult> {
  const row = await db.restaurant.findUniqueOrThrow({ where: { id: restaurantId }, select: factColumns })
  if (row.googlePlaceRef === null) {
    return { type: 'bad', message: 'This restaurant has no Google place id, so there is nothing to refresh.' }
  }

  let place: PlaceFacts
  try {
    place = mapPlaceFacts(await places.getPlace(row.googlePlaceRef, { languageCode: factsLanguageCode }))
  }
  catch (e) {
    if (!(e instanceof PlacesError)) {
      throw e
    }
    await recordInlineJob(db, { kind: 'refresh-google-places', restaurantId, outcome: { error: e.message } })
    return { type: 'bad', message: `Google Places refused the refresh: ${e.message}` }
  }

  const current = readFacts(row)
  const changedFields = factKeys.filter(key =>
    current[key].origin === 'google-places' && !sameValue(factInputOf(current, key).value, placeFactInput(key, place).value))
  const data = changedFields.reduce<Partial<FactColumnsWrite>>(
    (columns, key) => ({ ...columns, ...factUpdate(placeFactInput(key, place), 'google-places') }),
    {},
  )

  await db.$transaction(async (tx) => {
    await tx.restaurant.update({ where: { id: restaurantId }, data: { ...data, googlePlacesRefreshedAt: new Date() } })
    const result: JobResult<'refresh-google-places'> = { changedFields }
    await recordInlineJob(tx, { kind: 'refresh-google-places', restaurantId, outcome: { result } })
  }, { timeout: transactionTimeoutMs })

  return { type: 'ok', changedFields }
}
