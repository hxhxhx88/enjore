import { localeTagSchema } from '@repo/lib/schemas/locale-tag'
import { regionSchema } from '@repo/lib/schemas/region'
import { z } from 'zod'

// Building blocks shared by the form schemas. Forms hold `''` where the database holds `null`.
export const trimmedText = z.string().trim()

export const localeTagFormSchema = trimmedText.refine(
  value => localeTagSchema.safeParse(value).success,
  'Use a lowercase BCP 47 tag like en-us or zh-hk.',
)

export const regionFormSchema = trimmedText.refine(
  value => regionSchema.safeParse(value).success,
  'Use a two-letter lowercase region code like hk.',
)

export const optionalUrlSchema = trimmedText.refine(
  value => value === '' || (/^https?:\/\//.test(value) && URL.canParse(value)),
  'Enter a full URL starting with https://, or leave it empty.',
)

export const slugSchema = trimmedText
  .min(1, 'Slug is required.')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, digits and hyphens.')
