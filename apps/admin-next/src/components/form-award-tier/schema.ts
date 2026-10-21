import { z } from 'zod'
import { trimmedText } from '@/lib/form-schemas'

export const formSchema = z.object({
  name: trimmedText.min(1, 'Name is required.').max(100, 'Keep the name under 100 characters.'),
  // 1 is the highest distinction of the award.
  level: z.number({ error: 'Enter a whole number.' }).int('Use a whole number.').min(1, 'Levels start at 1.').max(1000, 'Keep the level under 1000.'),
  // Any key is accepted; one the marks registry does not draw renders the generic mark.
  glyphKey: trimmedText.min(1, 'Glyph key is required.').max(50).regex(/^[a-z][a-z0-9-]*$/, 'Use lowercase letters, digits and hyphens.'),
  glyphCount: z.number({ error: 'Enter a whole number.' }).int('Use a whole number.').min(1, 'At least one glyph.').max(10, 'At most ten glyphs.'),
})

export type FormType = z.infer<typeof formSchema>

export const defaultValues: FormType = {
  name: '',
  level: 1,
  glyphKey: '',
  glyphCount: 1,
}
