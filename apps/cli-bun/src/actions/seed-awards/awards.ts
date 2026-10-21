import type { LocaleTag } from '@repo/lib/schemas/locale-tag'
import type { TranslatableField } from '@repo/lib/schemas/translation'
import { localeTagSchema } from '@repo/lib/schemas/locale-tag'
import { translatableFields } from '@repo/lib/schemas/translation'
import { z } from 'zod'

interface TranslationSeed<Field extends string> {
  locale: LocaleTag
  field: Field
  value: string
}

interface TierSeed {
  name: string
  // 1 is the highest distinction of the award.
  level: number
  // A key the marks registry does not draw renders the generic mark until a drawing is added.
  glyphKey: string
  glyphCount: number
  translations: Array<TranslationSeed<TranslatableField<'award_tiers'>>>
}

interface AwardSeed {
  slug: string
  name: string
  nameLocale: LocaleTag
  shortName: string | null
  website: string | null
  hasTier: boolean
  hasRank: boolean
  hasLabel: boolean
  scoreMax: number | null
  translations: Array<TranslationSeed<TranslatableField<'awards'>>>
  tiers: TierSeed[]
}

// `LocaleTag` is a plain string at the type level, so a tag such as `zh-CN` or a malformed URL is only caught here.
export const awardSeedsSchema = z.array(z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  nameLocale: localeTagSchema,
  shortName: z.string().min(1).nullable(),
  website: z.url().nullable(),
  hasTier: z.boolean(),
  hasRank: z.boolean(),
  hasLabel: z.boolean(),
  scoreMax: z.number().positive().nullable(),
  translations: z.array(z.object({
    locale: localeTagSchema,
    field: z.enum(translatableFields.awards),
    value: z.string().min(1),
  })),
  tiers: z.array(z.object({
    name: z.string().min(1),
    level: z.number().int().min(1),
    glyphKey: z.string().regex(/^[a-z][a-z0-9-]*$/),
    glyphCount: z.number().int().min(1).max(10),
    translations: z.array(z.object({
      locale: localeTagSchema,
      field: z.enum(translatableFields.award_tiers),
      value: z.string().min(1),
    })),
  })),
}))

function english(value: string): TranslationSeed<'name'> {
  return { locale: 'en-us', field: 'name', value }
}

// The sources marked "Seeded" in the table of `docs/product/0000-project-overview.md`. Names are canonical in the
// brand's language; other names are translation rows. Facets follow the overview's kind of distinction.
export const awardSeeds: readonly AwardSeed[] = [
  {
    slug: 'michelin-guide',
    name: 'MICHELIN Guide',
    nameLocale: 'en-us',
    shortName: 'MICHELIN',
    website: 'https://guide.michelin.com',
    hasTier: true,
    hasRank: false,
    hasLabel: false,
    scoreMax: null,
    translations: [],
    tiers: [
      { name: 'Three MICHELIN Stars', level: 1, glyphKey: 'star', glyphCount: 3, translations: [] },
      { name: 'Two MICHELIN Stars', level: 2, glyphKey: 'star', glyphCount: 2, translations: [] },
      { name: 'One MICHELIN Star', level: 3, glyphKey: 'star', glyphCount: 1, translations: [] },
      { name: 'Bib Gourmand', level: 4, glyphKey: 'bib', glyphCount: 1, translations: [] },
      { name: 'Selected', level: 5, glyphKey: 'plate', glyphCount: 1, translations: [] },
      // Orthogonal to the stars; the level only orders it after them.
      { name: 'MICHELIN Green Star', level: 6, glyphKey: 'leaf', glyphCount: 1, translations: [] },
    ],
  },
  {
    slug: 'worlds-50-best-restaurants',
    name: 'World\'s 50 Best Restaurants',
    nameLocale: 'en-us',
    shortName: 'World\'s 50 Best',
    website: 'https://www.theworlds50best.com',
    hasTier: false,
    hasRank: true,
    hasLabel: true,
    scoreMax: null,
    translations: [],
    tiers: [],
  },
  {
    slug: 'asias-50-best-restaurants',
    name: 'Asia\'s 50 Best Restaurants',
    nameLocale: 'en-us',
    shortName: 'Asia\'s 50 Best',
    website: 'https://www.theworlds50best.com/asia',
    hasTier: false,
    hasRank: true,
    hasLabel: true,
    scoreMax: null,
    translations: [],
    tiers: [],
  },
  {
    slug: 'worlds-50-best-discovery',
    name: 'World\'s 50 Best Discovery',
    nameLocale: 'en-us',
    shortName: '50 Best Discovery',
    website: 'https://www.theworlds50best.com/discovery',
    hasTier: false,
    hasRank: false,
    hasLabel: false,
    scoreMax: null,
    translations: [],
    tiers: [],
  },
  {
    slug: 'la-liste',
    name: 'La Liste',
    nameLocale: 'fr-fr',
    shortName: null,
    website: 'https://www.laliste.com',
    hasTier: false,
    hasRank: true,
    hasLabel: false,
    scoreMax: 100,
    translations: [],
    tiers: [],
  },
  {
    slug: 'opinionated-about-dining',
    name: 'Opinionated About Dining',
    nameLocale: 'en-us',
    shortName: 'OAD',
    website: 'https://www.opinionatedaboutdining.com',
    hasTier: false,
    hasRank: true,
    hasLabel: false,
    scoreMax: null,
    translations: [],
    tiers: [],
  },
  {
    slug: 'black-pearl-guide',
    name: '黑珍珠餐厅指南',
    nameLocale: 'zh-cn',
    shortName: '黑珍珠',
    // The guide's own site is not confirmed; set it once known.
    website: null,
    hasTier: true,
    hasRank: false,
    hasLabel: false,
    scoreMax: null,
    translations: [
      { locale: 'en-us', field: 'name', value: 'Black Pearl Restaurant Guide' },
      { locale: 'en-us', field: 'shortName', value: 'Black Pearl' },
    ],
    tiers: [
      { name: '三钻', level: 1, glyphKey: 'diamond', glyphCount: 3, translations: [english('Three Diamonds')] },
      { name: '二钻', level: 2, glyphKey: 'diamond', glyphCount: 2, translations: [english('Two Diamonds')] },
      { name: '一钻', level: 3, glyphKey: 'diamond', glyphCount: 1, translations: [english('One Diamond')] },
    ],
  },
  {
    slug: 'forbes-travel-guide',
    name: 'Forbes Travel Guide',
    nameLocale: 'en-us',
    shortName: 'Forbes',
    website: 'https://www.forbestravelguide.com',
    hasTier: true,
    hasRank: false,
    hasLabel: false,
    scoreMax: null,
    translations: [],
    tiers: [
      { name: 'Five-Star', level: 1, glyphKey: 'star', glyphCount: 5, translations: [] },
      { name: 'Four-Star', level: 2, glyphKey: 'star', glyphCount: 4, translations: [] },
      { name: 'Recommended', level: 3, glyphKey: 'generic', glyphCount: 1, translations: [] },
    ],
  },
  {
    slug: 'gambero-rosso',
    name: 'Gambero Rosso',
    nameLocale: 'it-it',
    shortName: null,
    website: 'https://www.gamberorosso.it',
    hasTier: true,
    hasRank: false,
    hasLabel: false,
    scoreMax: 100,
    translations: [],
    tiers: [
      { name: 'Tre Forchette', level: 1, glyphKey: 'fork', glyphCount: 3, translations: [english('Three Forks')] },
      { name: 'Due Forchette', level: 2, glyphKey: 'fork', glyphCount: 2, translations: [english('Two Forks')] },
      { name: 'Una Forchetta', level: 3, glyphKey: 'fork', glyphCount: 1, translations: [english('One Fork')] },
    ],
  },
  {
    slug: 'tatler-dining',
    name: 'Tatler Dining',
    nameLocale: 'en-us',
    shortName: 'Tatler',
    website: 'https://www.tatlerasia.com/dining',
    hasTier: false,
    hasRank: false,
    hasLabel: true,
    scoreMax: null,
    translations: [],
    tiers: [],
  },
]
