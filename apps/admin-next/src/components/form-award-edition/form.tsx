'use client'

import type { JSX, RefObject } from 'react'
import type { FormType } from './schema'
import { cn } from '@repo/ui-web/lib/utils'
import { FieldExpectedCount } from './field-expected-count'
import { FieldEditionLabel } from './field-label'
import { FieldNotes } from './field-notes'
import { FieldRegion } from './field-region'
import { FieldSourceUrl } from './field-source-url'
import { FieldYear } from './field-year'
import { useFormAwardEdition } from './hooks'

interface Props {
  readonly className?: string | undefined
  readonly formRef?: RefObject<HTMLFormElement | null>
  readonly onSubmit: (form: FormType) => void
}

export function Form({ className, formRef, onSubmit }: Props): JSX.Element {
  const form = useFormAwardEdition()

  return (
    <form
      className={cn('flex flex-col gap-5', className)}
      ref={formRef}
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event)
      }}
    >
      <FieldEditionLabel />
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldYear />
        <FieldExpectedCount />
      </div>
      <FieldRegion />
      <FieldSourceUrl />
      <FieldNotes />
    </form>
  )
}
