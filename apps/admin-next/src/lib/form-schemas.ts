import { z } from 'zod'

// Building blocks shared by the form schemas. Forms hold `''` where the database holds `null`.
export const trimmedText = z.string().trim()

export const optionalUrlSchema = trimmedText.refine(
  value => value === '' || (/^https?:\/\//.test(value) && URL.canParse(value)),
  'Enter a full URL starting with https://, or leave it empty.',
)

export const slugSchema = trimmedText
  .min(1, 'Slug is required.')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, digits and hyphens.')
