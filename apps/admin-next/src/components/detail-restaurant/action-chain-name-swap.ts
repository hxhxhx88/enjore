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
  chainId: z.string().min(1),
  locale: localeTagFormSchema,
})

type Input = z.infer<typeof inputSchema>

const transactionTimeoutMs = 15_000

// "Make canonical" for a chain's name, as `action-restaurant-name-swap.ts` does for a restaurant's.
export async function actionChainNameSwap(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { chainId, locale } = parsed.data

  const db = await connectDatabase()
  try {
    const swapped = await db.$transaction(async (tx) => {
      const chain = await tx.chain.findUniqueOrThrow({ where: { id: chainId }, select: { name: true, nameLocale: true } })
      const row = await tx.translation.findUnique({
        where: { locale_table_recordId_field: { locale, table: 'chains', recordId: chainId, field: 'name' } },
        select: { id: true, value: true },
      })
      if (row === null) {
        return false
      }
      await tx.chain.update({ where: { id: chainId }, data: { name: row.value, nameLocale: locale } })
      await tx.translation.update({ where: { id: row.id }, data: { locale: chain.nameLocale, value: chain.name } })
      return true
    }, { timeout: transactionTimeoutMs })
    if (!swapped) {
      return { type: 'bad', message: `There is no translation in ${locale} to make canonical.` }
    }
    revalidatePath(routes.restaurants.list)
    revalidatePath('/restaurants/[id]', 'page')
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
