'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  restaurantId: z.string().min(1),
  // Null removes the restaurant from its chain.
  chainId: z.string().min(1).nullable(),
})

type Input = z.infer<typeof inputSchema>

export async function actionRestaurantChainSet(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { restaurantId, chainId } = parsed.data

  const db = await connectDatabase()
  try {
    await db.restaurant.update({
      where: { id: restaurantId },
      data: { chainId },
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
