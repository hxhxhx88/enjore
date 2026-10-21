'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  awardId: z.string().min(1),
  tierId: z.string().min(1),
})

type Input = z.infer<typeof inputSchema>

export async function actionTierDelete(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { awardId, tierId } = parsed.data

  const db = await connectDatabase()

  const held = await db.accolade.count({ where: { tierId } })
  if (held > 0) {
    return { type: 'bad', message: `This tier is held by ${held} accolades and cannot be deleted.` }
  }

  try {
    await db.awardTier.delete({ where: { id: tierId, awardId } })
    revalidatePath(routes.awards.list)
    revalidatePath(routes.awards.detail(awardId))
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
