import type { JSX } from 'react'
import { Trans } from '@lingui/react/macro'
import { Field, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@repo/ui-web/primitives/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Controller } from 'react-hook-form'
import { codeLength } from '@/lib/verification'
import { useFormCode } from './hooks'

const slots = Array.from({ length: codeLength }, (_, index) => index)

interface Props {
  // Called once every slot is filled, for example to submit the form.
  readonly onComplete: () => void
}

export function FieldCode({ onComplete }: Props): JSX.Element {
  const form = useFormCode()

  return (
    <Controller
      name="code"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            <Trans>Verification code</Trans>
          </FieldLabel>
          <InputOTP
            {...field}
            maxLength={codeLength}
            pattern={REGEXP_ONLY_DIGITS}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-invalid={fieldState.invalid}
            onComplete={onComplete}
          >
            <InputOTPGroup>
              {slots.map(index => <InputOTPSlot key={index} index={index} />)}
            </InputOTPGroup>
          </InputOTP>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
