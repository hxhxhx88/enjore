import type { UseFormProps, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLingui } from '@lingui/react/macro'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export interface FormType {
  email: string
}

export const defaultValues: FormType = {
  email: '',
}

export function useValidatedForm(args: Omit<UseFormProps<FormType>, 'resolver'>): UseFormReturn<FormType> {
  const { t } = useLingui()

  const validatedForm = z.object({
    email: z.email({ message: t`Email is invalid` }).min(1, { message: t`Email is required` }),
  })

  return useForm<FormType>({
    ...args,
    resolver: zodResolver(validatedForm),
  })
}
