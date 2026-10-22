'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { factUpdate } from '@/lib/fact-update'
import { factValueSchema } from '@/lib/facts'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  restaurantId: z.string().min(1),
  value: factValueSchema,
})

type Input = z.infer<typeof inputSchema>

// Sets one fact by hand. The origin becomes manual, so a refresh from Places leaves it alone.
export async function actionRestaurantFactUpdate(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { restaurantId, value } = parsed.data

  const db = await connectDatabase()
  try {
    await db.restaurant.update({
      where: { id: restaurantId },
      data: factUpdate(value, 'manual'),
    })
    revalidatePath(routes.restaurants.list)
    revalidatePath(routes.restaurants.detail(restaurantId))
    return { type: 'ok' }
  }
  catch (e) {
    const error = parseDatabaseError(e)
    if (error) {
      return { type: 'bad', message: error.message }
    }
    throw e
  }
}
