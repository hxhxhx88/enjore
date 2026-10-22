'use server'

import type { ActionOutput } from '@/lib/action-output'
import { translatableFields } from '@repo/lib/schemas/translation'
import { z } from 'zod'
import { invalidInput } from '@/lib/action-output'
import { connectDatabase } from '@/lib/db'
import { parseDatabaseError } from '@/lib/db-error'
import { localeTagFormSchema, trimmedText } from '@/lib/form-schemas'
import { mountedTranslationTableSchema, revalidateTranslatedRecord } from '@/lib/translations'

const inputSchema = z.object({
  table: mountedTranslationTableSchema,
  recordId: z.string().min(1),
  field: z.string().min(1),
  locale: localeTagFormSchema,
  value: trimmedText.min(1).max(500),
}).refine((input) => {
  const fields: readonly string[] = translatableFields[input.table]
  return fields.includes(input.field)
}, {
  path: ['field'],
  error: 'This field is not translatable.',
})

type Input = z.infer<typeof inputSchema>

// Adds or changes the value of one field in one locale. A translation of the name in the record's own locale is
// refused: the canonical value already holds it, and "Make canonical" would collide with it later.
export async function actionTranslationUpsert(input: Input): Promise<ActionOutput> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return invalidInput
  }
  const { table, recordId, field, locale, value } = parsed.data

  const db = await connectDatabase()
  const record = table === 'restaurants'
    ? await db.restaurant.findUnique({ where: { id: recordId }, select: { nameLocale: true } })
    : await db.chain.findUnique({ where: { id: recordId }, select: { nameLocale: true } })
  if (record === null) {
    return { type: 'bad', message: 'The record no longer exists.' }
  }
  if (field === 'name' && record.nameLocale === locale) {
    return { type: 'bad', message: `${locale} is the locale of the canonical name; edit the name itself or pick another locale.` }
  }

  try {
    await db.translation.upsert({
      where: { locale_table_recordId_field: { locale, table, recordId, field } },
      create: { locale, table, recordId, field, value },
      update: { value },
    })
    revalidateTranslatedRecord(table, recordId)
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
