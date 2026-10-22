import { z } from 'zod'
import { localeTagFormSchema, regionFormSchema, slugSchema, trimmedText } from '@/lib/form-schemas'

// The identity fields of a restaurant: the review step of "Add restaurant" confirms them, "Edit" on the restaurant
// page changes them. The facts are edited one by one in the "Basics" section, except the address of a restaurant
// created without a Google place, which is typed here.
export const formSchema = z.object({
  name: trimmedText.min(1, 'Name is required.').max(200, 'Keep the name under 200 characters.'),
  nameLocale: localeTagFormSchema,
  slug: slugSchema,
  region: regionFormSchema,
  // Form-only: whether a Google place supplies the facts; without one, the address is required here.
  hasPlace: z.boolean(),
  address: trimmedText.max(300, 'Keep the address under 300 characters.'),
}).refine(values => values.hasPlace || values.address !== '', {
  path: ['address'],
  error: 'Enter the address.',
})

export type FormType = z.infer<typeof formSchema>

export const defaultValues: FormType = {
  name: '',
  nameLocale: 'zh-hk',
  slug: '',
  region: 'hk',
  hasPlace: true,
  address: '',
}
