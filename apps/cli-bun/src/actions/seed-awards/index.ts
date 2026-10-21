import type { Tx } from '@repo/db'
import type { TranslatableTable } from '@repo/lib/schemas/translation'
import { newDatabase } from '@repo/db'
import { env } from '../../lib/env'
import { awardSeeds, awardSeedsSchema } from './awards'

interface TranslationRow {
  locale: string
  table: TranslatableTable
  recordId: string
  field: string
  value: string
}

async function upsertTranslation(tx: Tx, row: TranslationRow): Promise<void> {
  const { locale, table, recordId, field, value } = row
  await tx.translation.upsert({
    where: { locale_table_recordId_field: { locale, table, recordId, field } },
    create: row,
    update: { value },
  })
}

// Creates or updates the launch awards, their tiers and the translations of their names. Idempotent: awards are
// keyed by slug, tiers by award and name, translations by their unique key. A re-run re-asserts every seeded field
// except `isActive`, which the operator owns; tiers the operator added are left alone.
export async function actionSeedAwards(): Promise<void> {
  const seeds = awardSeedsSchema.parse(awardSeeds)
  const db = newDatabase(env.DATABASE_URL)

  try {
    for (const { slug, tiers, translations, ...fields } of seeds) {
      await db.$transaction(async (tx) => {
        const award = await tx.award.upsert({
          where: { slug },
          create: { slug, ...fields },
          update: fields,
          select: { id: true },
        })

        for (const { translations: tierTranslations, ...tier } of tiers) {
          const { id } = await tx.awardTier.upsert({
            where: { awardId_name: { awardId: award.id, name: tier.name } },
            create: { awardId: award.id, ...tier },
            update: { level: tier.level, glyphKey: tier.glyphKey, glyphCount: tier.glyphCount },
            select: { id: true },
          })
          for (const t of tierTranslations) {
            await upsertTranslation(tx, { table: 'award_tiers', recordId: id, ...t })
          }
        }

        for (const t of translations) {
          await upsertTranslation(tx, { table: 'awards', recordId: award.id, ...t })
        }
      }, { timeout: 30_000 })

      console.warn(`Seeded ${slug}`)
    }
  }
  finally {
    // The connection pool would otherwise keep the process alive.
    await db.$disconnect()
  }
}
