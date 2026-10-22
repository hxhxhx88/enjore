'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { factUpdate } from '@/lib/fact-update'
import { factKeySchema } from '@/lib/facts'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  restaurantId: z.string().min(1),
  fact: factKeySchema,
})

type Input = z.infer<typeof inputSchema>

// Clears one fact: null with a manual origin, which a refresh from Places does not fill again.
export async function actionRestaurantFactClear(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { restaurantId, fact } = parsed.data

  const db = await connectDatabase()
  await db.restaurant.update({
    where: { id: restaurantId },
    data: factUpdate({ fact, value: null }, 'manual'),
  })
  revalidatePath(routes.restaurants.list)
  revalidatePath(routes.restaurants.detail(restaurantId))
  return { type: 'ok' }
}
