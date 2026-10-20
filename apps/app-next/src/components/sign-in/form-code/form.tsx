import type { JSX, RefObject } from 'react'
import type { FormType } from './schema'
import { cn } from '@repo/ui-web/lib/utils'
import { FieldCode } from './field-code'
import { useFormCode } from './hooks'

interface Props {
  readonly className?: string
  readonly formRef?: RefObject<HTMLFormElement | null>
  readonly onSubmit: (form: FormType) => void
}

export function Form({ className, formRef, onSubmit }: Props): JSX.Element {
  const form = useFormCode()
  const submit = form.handleSubmit(onSubmit)

  return (
    <form
      className={cn('space-y-2', className)}
      ref={formRef}
      onSubmit={(event) => {
        void submit(event)
      }}
    >
      {/* Submits as soon as the last digit is entered. */}
      <FieldCode
        onComplete={() => {
          void submit()
        }}
      />
    </form>
  )
}
