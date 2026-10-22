'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { formSchemaRestaurant } from '@/components/form-restaurant'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  restaurantId: z.string().min(1),
  formData: formSchemaRestaurant,
})

type Input = z.infer<typeof inputSchema>

// The identity fields only; the form's address belongs to creation and the facts table edits it afterwards.
export async function actionRestaurantUpdate(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { restaurantId, formData: { name, nameLocale, slug, region } } = parsed.data

  const db = await connectDatabase()
  try {
    await db.restaurant.update({
      where: { id: restaurantId },
      data: { name, nameLocale, slug, region },
    })
    revalidatePath(routes.restaurants.list)
    revalidatePath(routes.restaurants.detail(restaurantId))
    revalidatePath(routes.home)
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
