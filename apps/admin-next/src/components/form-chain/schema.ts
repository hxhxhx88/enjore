import { z } from 'zod'
import { localeTagFormSchema, slugSchema, trimmedText } from '@/lib/form-schemas'

// A chain has a canonical name in the same form as a restaurant's, and a slug; its other names are Translation rows.
export const formSchema = z.object({
  name: trimmedText.min(1, 'Name is required.').max(200, 'Keep the name under 200 characters.'),
  nameLocale: localeTagFormSchema,
  slug: slugSchema,
})

export type FormType = z.infer<typeof formSchema>

export const defaultValues: FormType = {
  name: '',
  nameLocale: 'zh-hk',
  slug: '',
}
