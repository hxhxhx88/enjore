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
})

type Input = z.infer<typeof inputSchema>

const stillReferenced = 'This award has accolades or source references and cannot be deleted. Deactivate it instead.'

export async function actionAwardDelete(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { awardId } = parsed.data

  const db = await connectDatabase()

  // Deleting cascades into tiers and editions, whose accolades and the award's source references are protected by
  // `Restrict` foreign keys. The check gives a precise message; the catch below covers a race with a concurrent write.
  const [accolades, references] = await Promise.all([
    db.accolade.count({ where: { awardId } }),
    db.sourceReference.count({ where: { awardId } }),
  ])
  if (accolades > 0 || references > 0) {
    return { type: 'bad', message: stillReferenced }
  }

  try {
    await db.award.delete({ where: { id: awardId } })
    revalidatePath(routes.awards.list)
    revalidatePath(routes.home)
    return { type: 'ok' }
  }
  catch (e) {
    const error = parseDatabaseError(e)
    // The cascade trips the edition's or the tier's constraint first, so the parser's message would name those.
    if (error?.kind === 'foreign-key') {
      return { type: 'bad', message: stillReferenced }
    }
    throw e
  }
}
