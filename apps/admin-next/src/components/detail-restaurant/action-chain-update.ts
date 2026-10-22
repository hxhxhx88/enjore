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
  chainId: z.string().min(1),
  formData: formSchemaChain,
})

type Input = z.infer<typeof inputSchema>

// A chain's name shows on the page of every branch, so every restaurant page is revalidated.
export async function actionChainUpdate(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { chainId, formData } = parsed.data

  const db = await connectDatabase()
  try {
    await db.chain.update({ where: { id: chainId }, data: formData })
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
