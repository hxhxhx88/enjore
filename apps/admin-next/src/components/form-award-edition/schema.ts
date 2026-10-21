import { z } from 'zod'
import { optionalUrlSchema, trimmedText } from '@/lib/form-schemas'

export const formSchema = z.object({
  label: trimmedText.min(1, 'Label is required.').max(200, 'Keep the label under 200 characters.'),
  year: z.number({ error: 'Enter a year.' }).int('Use a whole number.').min(1900, 'Enter a year after 1900.').max(2100, 'Enter a year before 2100.'),
  // The scope the list covers, as free text; not the restaurant region code.
  region: trimmedText.max(100, 'Keep the region under 100 characters.'),
  sourceUrl: optionalUrlSchema,
  expectedCount: z.number({ error: 'Enter a whole number.' }).int('Use a whole number.').min(0, 'Enter zero or more.').nullable(),
  notes: trimmedText.max(5000, 'Keep the notes under 5000 characters.'),
})

export type FormType = z.infer<typeof formSchema>

export const defaultValues: FormType = {
  label: '',
  year: new Date().getFullYear(),
  region: '',
  sourceUrl: '',
  expectedCount: null,
  notes: '',
}
