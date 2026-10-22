'use server'

import type { PlaceFacts } from '@/lib/places/map-facts'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { formSchemaRestaurant } from '@/components/form-restaurant'
import { otherNamesSchema } from '@/components/form-restaurant-entry'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { PlacesError } from '@/lib/places/client'
import { connectPlaces } from '@/lib/places/connect'
import { factsLanguageCode } from '@/lib/places/language'
import { mapPlaceFacts } from '@/lib/places/map-facts'
import { createRestaurant } from '@/lib/restaurant-create'
import { routes } from '@/lib/routes'
import { emptyToNull } from '@/lib/text'

const inputSchema = z.object({
  placeId: z.string().min(1).nullable(),
  otherNames: otherNamesSchema,
  formData: formSchemaRestaurant,
})

type Input = z.infer<typeof inputSchema>

interface OutputOk {
  type: 'ok'
  id: string
  // The place already belonged to a restaurant, which is opened instead of a new one.
  existed: boolean
}

interface OutputBad {
  type: 'bad'
  message: string
}

type Output = OutputOk | OutputBad

// Creates the restaurant the review step confirmed. The facts are fetched again here from the place id, so nothing
// the client sends is trusted beyond the identity fields it edited.
export async function actionRestaurantCreate(input: Input): Promise<Output> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { placeId, otherNames, formData } = parsed.data

  let place: PlaceFacts | null = null
  if (placeId !== null) {
    try {
      place = mapPlaceFacts(await connectPlaces().getPlace(placeId, { languageCode: factsLanguageCode }))
    }
    catch (e) {
      if (e instanceof PlacesError) {
        return { type: 'bad', message: `Google Places refused the place: ${e.message}` }
      }
      throw e
    }
  }

  const db = await connectDatabase()
  const result = await createRestaurant(db, {
    name: formData.name,
    nameLocale: formData.nameLocale,
    otherNames,
    slug: formData.slug,
    region: formData.region,
    place,
    address: place === null ? emptyToNull(formData.address) : null,
    listing: null,
  })

  switch (result.type) {
    case 'created': {
      revalidatePath(routes.restaurants.list)
      revalidatePath(routes.home)
      return { type: 'ok', id: result.id, existed: false }
    }
    case 'exists':
      return { type: 'ok', id: result.id, existed: true }
    case 'bad':
      return { type: 'bad', message: result.message }
  }
}
