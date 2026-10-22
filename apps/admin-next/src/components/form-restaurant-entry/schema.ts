import { z } from 'zod'
import { localeTagFormSchema, optionalUrlSchema, regionFormSchema, trimmedText } from '@/lib/form-schemas'

const otherNameSchema = z.object({
  value: trimmedText.min(1, 'Enter the name or remove the row.').max(200, 'Keep the name under 200 characters.'),
  locale: localeTagFormSchema,
})

// The other official names, which become Translation rows of the name; the create action validates them again.
export const otherNamesSchema = z.array(otherNameSchema)

// What the operator knows about the venue before the resolver looks it up: a name and an address, or a Google Maps
// link, with the region the search is biased to.
export const formSchema = z.object({
  name: trimmedText.max(200, 'Keep the name under 200 characters.'),
  nameLocale: localeTagFormSchema,
  otherNames: otherNamesSchema,
  address: trimmedText.max(300, 'Keep the address under 300 characters.'),
  region: regionFormSchema,
  googleMapsUrl: optionalUrlSchema,
}).superRefine((values, context) => {
  if (values.name === '' && values.googleMapsUrl === '') {
    context.addIssue({ code: 'custom', path: ['name'], message: 'Enter a name or paste a Google Maps link.' })
  }
  const seen = new Set<string>()
  values.otherNames.forEach((other, index) => {
    if (other.locale === values.nameLocale) {
      context.addIssue({ code: 'custom', path: ['otherNames', index, 'locale'], message: 'This is the canonical name\'s locale; pick another one.' })
    }
    else if (seen.has(other.locale)) {
      context.addIssue({ code: 'custom', path: ['otherNames', index, 'locale'], message: 'Another name already uses this locale.' })
    }
    seen.add(other.locale)
  })
})

export type FormType = z.infer<typeof formSchema>

export const defaultValues: FormType = {
  name: '',
  nameLocale: 'zh-hk',
  otherNames: [],
  address: '',
  region: 'hk',
  googleMapsUrl: '',
}
