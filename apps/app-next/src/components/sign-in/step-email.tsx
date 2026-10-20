import type { JSX } from 'react'
import { Trans } from '@lingui/react/macro'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { actionSendCode } from './action-send-code'
import { useStore } from './context'
import { FormEmail, FormProviderEmail } from './form-email'

export function StepEmail(): JSX.Element {
  const startCodeStep = useStore(s => s.startCodeStep)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: actionSendCode,
    onSuccess(output, { email }) {
      switch (output.type) {
        case 'ok': {
          startCodeStep({ email, publicCode: output.publicCode })
          break
        }
        case 'bad': {
          toast.add({ type: 'warning', title: output.message })
          break
        }
      }
    },
  })

  return (
    <div className="space-y-4">
      <FormProviderEmail>
        <FormEmail formRef={formRef} onSubmit={mutate} />
      </FormProviderEmail>
      <LoadingButton
        isLoading={isPending}
        className="w-full"
        onClick={() => {
          formRef.current?.requestSubmit()
        }}
      >
        <Trans>Continue</Trans>
      </LoadingButton>
    </div>
  )
}
