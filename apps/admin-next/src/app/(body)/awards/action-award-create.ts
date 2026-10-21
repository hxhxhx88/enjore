'use server'

import type { FormTypeAward } from '@/components/form-award'
import { revalidatePath } from 'next/cache'
import { awardFormToData, formSchemaAward } from '@/components/form-award'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { routes } from '@/lib/routes'

interface OutputOk {
  type: 'ok'
  id: string
}

interface OutputBad {
  type: 'bad'
  message: string
}

type Output = OutputOk | OutputBad

export async function actionAwardCreate(input: FormTypeAward): Promise<Output> {
  // The input arrives from the network, so it is validated again here.
  const parsed = formSchemaAward.safeParse(input)
  if (!parsed.success) {
    return { type: 'bad', message: 'The form has invalid values.' }
  }

  const db = await connectDatabase()
  try {
    const { id } = await db.award.create({
      data: awardFormToData(parsed.data),
      select: { id: true },
    })
    revalidatePath(routes.awards.list)
    revalidatePath(routes.home)
    return { type: 'ok', id }
  }
  catch (e) {
    const error = parseDatabaseError(e)
    if (error) {
      return { type: 'bad', message: error.message }
    }
    throw e
  }
}
