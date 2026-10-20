import type { JSX } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { Field, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormEmail } from './hooks'

export function FieldEmail(): JSX.Element {
  const { t } = useLingui()
  const form = useFormEmail()

  return (
    <Controller
      name="email"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            <Trans>Email</Trans>
          </FieldLabel>
          <Input
            {...field}
            type="email"
            autoComplete="email"
            placeholder={t`you@example.com`}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
