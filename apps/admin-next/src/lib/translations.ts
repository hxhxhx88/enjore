import type { TranslatableTable } from '@repo/lib/schemas/translation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { routes } from './routes'

// The translatable tables the admin edits so far; milestone 0004 adds the profile tables.
const mountedTranslationTables = ['restaurants', 'chains'] as const satisfies readonly TranslatableTable[]
export const mountedTranslationTableSchema = z.enum(mountedTranslationTables)
export type MountedTranslationTable = (typeof mountedTranslationTables)[number]

// The pages that show a record's translations. A chain's name appears on the page of each of its branches, so every
// restaurant page is revalidated for it.
export function revalidateTranslatedRecord(table: MountedTranslationTable, recordId: string): void {
  switch (table) {
    case 'restaurants': {
      revalidatePath(routes.restaurants.list)
      revalidatePath(routes.restaurants.detail(recordId))
      break
    }
    case 'chains': {
      revalidatePath(routes.restaurants.list)
      revalidatePath('/restaurants/[id]', 'page')
      break
    }
  }
}
