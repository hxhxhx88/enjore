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
  editionId: z.string().min(1),
  formData: formSchemaAwardEdition,
})

type Input = z.infer<typeof inputSchema>

// Shared by the award page and the edition page, which perform the identical edit; that is the one case
// `docs/development/0003-coding/nextjs-server-action.md` reserves `src/actions` for.
export async function actionEditionUpdate(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { awardId, editionId, formData } = parsed.data

  const db = await connectDatabase()
  try {
    // The award id scopes the update, so an edition can only be edited under its own award.
    await db.awardEdition.update({
      where: { id: editionId, awardId },
      data: editionFormToData(formData),
    })
    revalidatePath(routes.awards.detail(awardId))
    revalidatePath(routes.awards.edition(awardId, editionId))
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
