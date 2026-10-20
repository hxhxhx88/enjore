import type { JSX } from 'react'
import { Trans } from '@lingui/react/macro'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { Button } from '@repo/ui-web/primitives/button'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useLocale } from '@/lib/hooks'
import { routes } from '@/lib/routes'
import { actionVerifyCode } from './action-verify-code'
import { ButtonResend } from './button-resend'
import { useStore } from './context'
import { FormCode, FormProviderCode, useFormCode } from './form-code'

export function StepCode(): JSX.Element {
  return (
    <FormProviderCode>
      <Body />
    </FormProviderCode>
  )
}

function Body(): JSX.Element {
  const router = useRouter()
  const locale = useLocale()
  const publicCode = useStore(s => s.publicCode)
  const restart = useStore(s => s.restart)
  const form = useFormCode()
  const formRef = useRef<HTMLFormElement>(null)

  // The code input appears after the email was submitted, so focus moves to it.
  const { setFocus } = form
  useEffect(() => {
    setFocus('code')
  }, [setFocus])

  const { mutate, isPending } = useMutation({
    mutationFn: actionVerifyCode,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          // The action set the session cookie; the account page reads it on the server.
          router.replace(routes.account(locale))
          break
        }
        case 'bad': {
          toast.add({ type: 'warning', title: output.message })
          form.resetField('code')
          break
        }
      }
    },
  })

  return (
    <div className="space-y-4">
      <FormCode formRef={formRef} onSubmit={({ code }) => mutate({ publicCode, code })} />
      <LoadingButton
        isLoading={isPending}
        className="w-full"
        onClick={() => {
          formRef.current?.requestSubmit()
        }}
      >
        <Trans>Verify</Trans>
      </LoadingButton>
      <div className="flex items-center justify-between">
        <ButtonResend />
        <Button variant="link" onClick={restart}>
          <Trans>Use another email</Trans>
        </Button>
      </div>
    </div>
  )
}
