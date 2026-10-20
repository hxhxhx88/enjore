'use client'

import type { JSX, ReactNode } from 'react'
import type { FormType } from './schema'
import { FormProvider } from 'react-hook-form'
import { defaultValues, useValidatedForm } from './schema'

interface Props {
  readonly children: ReactNode
  readonly initialValues?: Partial<FormType>
}

export function Provider({ children, initialValues }: Props): JSX.Element {
  const form = useValidatedForm({
    defaultValues: { ...defaultValues, ...initialValues },
  })
  return <FormProvider {...form}>{children}</FormProvider>
}
