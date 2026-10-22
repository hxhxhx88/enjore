'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { formSchemaChain } from '@/components/form-chain'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  restaurantId: z.string().min(1),
  formData: formSchemaChain,
})

type Input = z.infer<typeof inputSchema>

const transactionTimeoutMs = 15_000

// Creates the chain and makes this restaurant its first branch, in one transaction.
export async function actionChainCreate(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { restaurantId, formData } = parsed.data

  const db = await connectDatabase()
  try {
    await db.$transaction(async (tx) => {
      const chain = await tx.chain.create({ data: formData, select: { id: true } })
      await tx.restaurant.update({ where: { id: restaurantId }, data: { chainId: chain.id } })
    }, { timeout: transactionTimeoutMs })
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
