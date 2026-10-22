import type { UseFormReturn } from 'react-hook-form'
import type { FormType } from './schema'
import { useFormContext } from 'react-hook-form'

export function useFormFact(): UseFormReturn<FormType> {
  return useFormContext<FormType>()
}
