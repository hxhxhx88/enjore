'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  awardId: z.string().min(1),
  isActive: z.boolean(),
})

type Input = z.infer<typeof inputSchema>

// An award with accolades is never deleted; deactivating keeps it with its history and stops offering it.
export async function actionAwardSetActive(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { awardId, isActive } = parsed.data

  const db = await connectDatabase()
  await db.award.update({
    where: { id: awardId },
    data: { isActive },
  })
  revalidatePath(routes.awards.list)
  revalidatePath(routes.awards.detail(awardId))
  revalidatePath(routes.home)
  return { type: 'ok' }
}
