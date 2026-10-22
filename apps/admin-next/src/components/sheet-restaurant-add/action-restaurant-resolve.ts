'use server'

import type { FormTypeRestaurantEntry } from '@/components/form-restaurant-entry'
import type { ResolveResult } from '@/lib/resolver/resolve-entry'
import { formSchemaRestaurantEntry } from '@/components/form-restaurant-entry'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { PlacesError } from '@/lib/places/client'
import { connectPlaces } from '@/lib/places/connect'
import { resolveEntry, ResolveInputError } from '@/lib/resolver/resolve-entry'
import { emptyToNull } from '@/lib/text'

interface OutputOk {
  type: 'ok'
  result: ResolveResult
}

interface OutputBad {
  type: 'bad'
  message: string
}

type Output = OutputOk | OutputBad

// Runs the entry through the resolver without writing anything; the review step creates.
export async function actionRestaurantResolve(input: FormTypeRestaurantEntry): Promise<Output> {
  const parsed = formSchemaRestaurantEntry.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { name, nameLocale, otherNames, address, region, googleMapsUrl } = parsed.data

  const db = await connectDatabase()
  try {
    const result = await resolveEntry(db, connectPlaces(), {
      names: [...(name === '' ? [] : [{ value: name, locale: nameLocale }]), ...otherNames],
      address: emptyToNull(address),
      region,
      googleMapsUrl: emptyToNull(googleMapsUrl),
      listing: null,
    })
    return { type: 'ok', result }
  }
  catch (e) {
    if (e instanceof ResolveInputError) {
      return { type: 'bad', message: e.message }
    }
    if (e instanceof PlacesError) {
      return { type: 'bad', message: `Google Places refused the search: ${e.message}` }
    }
    throw e
  }
}
