import type { UseFormProps, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLingui } from '@lingui/react/macro'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { codeLength } from '@/lib/verification'

export interface FormType {
  code: string
}

export const defaultValues: FormType = {
  code: '',
}

export function useValidatedForm(args: Omit<UseFormProps<FormType>, 'resolver'>): UseFormReturn<FormType> {
  const { t } = useLingui()
  const message = t`Enter the ${codeLength}-digit code`

  const validatedForm = z.object({
    code: z.string().length(codeLength, { message }).regex(/^\d+$/, { message }),
  })

  return useForm<FormType>({
    ...args,
    resolver: zodResolver(validatedForm),
  })
}
