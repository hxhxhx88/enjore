import type { JSX, RefObject } from 'react'
import type { FormType } from './schema'
import { FieldEmail } from './field-email'
import { useFormUser } from './hooks'

interface Props {
  readonly className?: string
  readonly formRef?: RefObject<HTMLFormElement | null>
  readonly onSubmit: (form: FormType) => void
}

export function Form({ className, formRef, onSubmit }: Props): JSX.Element {
  const form = useFormUser()

  return (
    <form
      className={className}
      ref={formRef}
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event)
      }}
    >
      <FieldEmail />
    </form>
  )
}
