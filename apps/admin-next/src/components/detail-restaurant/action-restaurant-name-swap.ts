'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { localeTagFormSchema } from '@/lib/form-schemas'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  restaurantId: z.string().min(1),
  // The locale of the translation that becomes the canonical name.
  locale: localeTagFormSchema,
})

type Input = z.infer<typeof inputSchema>

const transactionTimeoutMs = 15_000

// "Make canonical": the translation's value and locale move onto the restaurant, and the old canonical name and
// locale move onto the translation row, in one transaction. Swapping back is the same action in the other locale.
export async function actionRestaurantNameSwap(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { restaurantId, locale } = parsed.data

  const db = await connectDatabase()
  try {
    const swapped = await db.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.findUniqueOrThrow({ where: { id: restaurantId }, select: { name: true, nameLocale: true } })
      const row = await tx.translation.findUnique({
        where: { locale_table_recordId_field: { locale, table: 'restaurants', recordId: restaurantId, field: 'name' } },
        select: { id: true, value: true },
      })
      if (row === null) {
        return false
      }
      await tx.restaurant.update({ where: { id: restaurantId }, data: { name: row.value, nameLocale: locale } })
      await tx.translation.update({ where: { id: row.id }, data: { locale: restaurant.nameLocale, value: restaurant.name } })
      return true
    }, { timeout: transactionTimeoutMs })
    if (!swapped) {
      return { type: 'bad', message: `There is no translation in ${locale} to make canonical.` }
    }
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
