'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { awardFormToData, formSchemaAward } from '@/components/form-award'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  awardId: z.string().min(1),
  formData: formSchemaAward,
})

type Input = z.infer<typeof inputSchema>

export async function actionAwardUpdate(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { awardId, formData } = parsed.data

  const db = await connectDatabase()
  try {
    await db.award.update({
      where: { id: awardId },
      data: awardFormToData(formData),
    })
    revalidatePath(routes.awards.list)
    revalidatePath(routes.awards.detail(awardId))
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
