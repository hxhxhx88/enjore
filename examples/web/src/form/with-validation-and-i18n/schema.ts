import type { UseFormProps, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLingui } from '@lingui/react/macro'
import { useForm } from 'react-hook-form'
import z from 'zod'

export const formSchema = z.object({
  email: z.string(),
  name: z.string(),
})

export type FormType = z.infer<typeof formSchema>

export const defaultValues: FormType = {
  email: '',
  name: '',
}

export function useValidatedForm(args: Omit<UseFormProps<FormType>, 'resolver'>): UseFormReturn<FormType> {
  const { t } = useLingui()
  const { name } = formSchema.shape

  const validatedForm = z.object({
    email: z.email({ message: t`Email is invalid` }).min(1, { message: t`Email is required` }),
    name: name.min(1, t`Name is required`).max(100, t`Name must be less than 100 characters`),
  })

  return useForm<FormType>({
    ...args,
    resolver: zodResolver(validatedForm),
  })
}
