import { businessStatusSchema } from '@repo/lib/schemas/business-status'
import { z } from 'zod'
import { factKeySchema } from '@/lib/facts'
import { trimmedText } from '@/lib/form-schemas'
import { parseOpeningHours } from '@/lib/opening-hours-text'

// One form for the seven facts: `fact` says which one is edited and which fields count. Text facts and the opening
// hours share `text`; coordinates use the two numbers; the business status its own choice.
export const formSchema = z.object({
  fact: factKeySchema,
  text: trimmedText,
  latitude: z.number({ error: 'Enter a number.' }).min(-90, 'Latitude runs from -90 to 90.').max(90, 'Latitude runs from -90 to 90.').nullable(),
  longitude: z.number({ error: 'Enter a number.' }).min(-180, 'Longitude runs from -180 to 180.').max(180, 'Longitude runs from -180 to 180.').nullable(),
  businessStatus: businessStatusSchema.nullable(),
}).superRefine((values, context) => {
  switch (values.fact) {
    case 'address':
    case 'district':
    case 'phone': {
      if (values.text === '') {
        context.addIssue({ code: 'custom', path: ['text'], message: 'Enter a value, or clear the fact instead.' })
      }
      break
    }
    case 'website': {
      if (!/^https?:\/\//.test(values.text) || !URL.canParse(values.text)) {
        context.addIssue({ code: 'custom', path: ['text'], message: 'Enter a full URL starting with https://.' })
      }
      break
    }
    case 'coordinates': {
      if (values.latitude === null) {
        context.addIssue({ code: 'custom', path: ['latitude'], message: 'Enter the latitude.' })
      }
      if (values.longitude === null) {
        context.addIssue({ code: 'custom', path: ['longitude'], message: 'Enter the longitude.' })
      }
      break
    }
    case 'openingHours': {
      const parsed = parseOpeningHours(values.text)
      if (parsed.type === 'bad') {
        context.addIssue({ code: 'custom', path: ['text'], message: parsed.message })
      }
      break
    }
    case 'businessStatus': {
      if (values.businessStatus === null) {
        context.addIssue({ code: 'custom', path: ['businessStatus'], message: 'Pick a status.' })
      }
      break
    }
  }
})

export type FormType = z.infer<typeof formSchema>

export const defaultValues: FormType = {
  fact: 'address',
  text: '',
  latitude: null,
  longitude: null,
  businessStatus: null,
}
