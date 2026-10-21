'use server'

import type { ActionOutput } from '@/lib/action-output'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { editionFormToData, formSchemaAwardEdition } from '@/components/form-award-edition'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { routes } from '@/lib/routes'

const inputSchema = z.object({
  awardId: z.string().min(1),
  formData: formSchemaAwardEdition,
})

type Input = z.infer<typeof inputSchema>

// Creating an edition imports nothing; the import is a separate step on the edition page.
export async function actionEditionCreate(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { awardId, formData } = parsed.data

  const db = await connectDatabase()
  try {
    await db.awardEdition.create({
      data: { awardId, ...editionFormToData(formData) },
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
