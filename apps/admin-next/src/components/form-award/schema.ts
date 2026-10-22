import { z } from 'zod'
import { localeTagFormSchema, optionalUrlSchema, slugSchema, trimmedText } from '@/lib/form-schemas'

export const formSchema = z.object({
  name: trimmedText.min(1, 'Name is required.').max(200, 'Keep the name under 200 characters.'),
  nameLocale: localeTagFormSchema,
  shortName: trimmedText.max(50, 'Keep the short name under 50 characters.'),
  slug: slugSchema,
  website: optionalUrlSchema,
  hasTier: z.boolean(),
  hasRank: z.boolean(),
  hasLabel: z.boolean(),
  // Form-only: the database declares the score facet through a non-null `scoreMax`.
  hasScore: z.boolean(),
  scoreMax: z.number({ error: 'Enter a number.' }).positive('The maximum score must be positive.').nullable(),
  isActive: z.boolean(),
}).refine(values => !values.hasScore || values.scoreMax !== null, {
  path: ['scoreMax'],
  error: 'Enter the maximum score.',
})

export type FormType = z.infer<typeof formSchema>

export const defaultValues: FormType = {
  name: '',
  nameLocale: 'en-us',
  shortName: '',
  slug: '',
  website: '',
  hasTier: false,
  hasRank: false,
  hasLabel: false,
  hasScore: false,
  scoreMax: null,
  isActive: true,
}
