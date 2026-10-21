'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { formSchemaAwardTier } from '@/components/form-award-tier'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  awardId: z.string().min(1),
  tierId: z.string().min(1),
  formData: formSchemaAwardTier,
})

type Input = z.infer<typeof inputSchema>

export async function actionTierUpdate(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { awardId, tierId, formData } = parsed.data

  const db = await connectDatabase()
  try {
    // The award id scopes the update, so a tier can only be edited under its own award.
    await db.awardTier.update({
      where: { id: tierId, awardId },
      data: formData,
    })
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
