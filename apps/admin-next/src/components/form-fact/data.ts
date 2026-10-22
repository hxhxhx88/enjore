import type { FormType } from './schema'
import type { FactKey, Facts, FactValue } from '@/lib/facts'
import { formatOpeningHours, parseOpeningHours } from '@/lib/opening-hours-text'

// The form values of a fact, from the typed facts the page holds: text facts as they are, hours in the text format,
// the rest in their own fields.
export function toFormValues(fact: FactKey, facts: Facts): FormType {
  const empty: FormType = { fact, text: '', latitude: null, longitude: null, businessStatus: null }
  switch (fact) {
    case 'address':
      return { ...empty, text: facts.address.value ?? '' }
    case 'district':
      return { ...empty, text: facts.district.value ?? '' }
    case 'phone':
      return { ...empty, text: facts.phone.value ?? '' }
    case 'website':
      return { ...empty, text: facts.website.value ?? '' }
    case 'coordinates':
      return { ...empty, latitude: facts.coordinates.value?.latitude ?? null, longitude: facts.coordinates.value?.longitude ?? null }
    case 'openingHours':
      return { ...empty, text: facts.openingHours.value === null ? '' : formatOpeningHours(facts.openingHours.value) }
    case 'businessStatus':
      return { ...empty, businessStatus: facts.businessStatus.value }
  }
}

// The fact value a valid form carries. The schema has checked the fields the fact uses, so a missing one here is a
// programming error, not an input error.
export function toFactValue(form: FormType): FactValue {
  switch (form.fact) {
    case 'address':
      return { fact: 'address', value: form.text }
    case 'district':
      return { fact: 'district', value: form.text }
    case 'phone':
      return { fact: 'phone', value: form.text }
    case 'website':
      return { fact: 'website', value: form.text }
    case 'coordinates': {
      if (form.latitude === null || form.longitude === null) {
        throw new Error('Coordinates need both numbers.')
      }
      return { fact: 'coordinates', value: { latitude: form.latitude, longitude: form.longitude } }
    }
    case 'openingHours': {
      const parsed = parseOpeningHours(form.text)
      if (parsed.type === 'bad') {
        throw new Error(parsed.message)
      }
      return { fact: 'openingHours', value: parsed.hours }
    }
    case 'businessStatus': {
      if (form.businessStatus === null) {
        throw new Error('A business status is needed.')
      }
      return { fact: 'businessStatus', value: form.businessStatus }
    }
  }
}
