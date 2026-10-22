'use server'

import type { ActionOutput } from '@/lib/action-output'
import { z } from 'zod'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { localeTagFormSchema } from '@/lib/form-schemas'
import { mountedTranslationTableSchema, revalidateTranslatedRecord } from '@/lib/translations'

const inputSchema = z.object({
  table: mountedTranslationTableSchema,
  recordId: z.string().min(1),
  field: z.string().min(1),
  locale: localeTagFormSchema,
})

type Input = z.infer<typeof inputSchema>

export async function actionTranslationDelete(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { table, recordId, field, locale } = parsed.data

  const db = await connectDatabase()
  // A row deleted twice is not an error; the page shows what is left.
  await db.translation.deleteMany({ where: { locale, table, recordId, field } })
  revalidateTranslatedRecord(table, recordId)
  return { type: 'ok' }
}
