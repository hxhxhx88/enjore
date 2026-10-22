'use server'

import type { FactKey } from '@/lib/facts'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { connectPlaces } from '@/lib/places/connect'
import { refreshRestaurant } from '@/lib/places/refresh'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  restaurantId: z.string().min(1),
})

type Input = z.infer<typeof inputSchema>

interface OutputOk {
  type: 'ok'
  changedFields: FactKey[]
}

interface OutputBad {
  type: 'bad'
  message: string
}

type Output = OutputOk | OutputBad

// "Refresh from Places" by hand; the periodic refresh of milestone 0008 runs the same function.
export async function actionRestaurantRefresh(input: Input): Promise<Output> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { restaurantId } = parsed.data

  const db = await connectDatabase()
  const result = await refreshRestaurant(db, connectPlaces(), restaurantId)
  revalidatePath(routes.restaurants.list)
  revalidatePath(routes.restaurants.detail(restaurantId))
  return result
}
