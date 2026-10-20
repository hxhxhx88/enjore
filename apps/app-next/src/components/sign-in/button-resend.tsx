import type { JSX } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { resendCooldownSeconds } from '@/lib/verification'
import { actionSendCode } from './action-send-code'
import { useStore } from './context'

export function ButtonResend(): JSX.Element {
  const { t } = useLingui()
  const email = useStore(s => s.email)
  const setPublicCode = useStore(s => s.setPublicCode)
  const [secondsLeft, setSecondsLeft] = useState(resendCooldownSeconds)

  // Counts down while the code step is shown; every resend starts the cooldown again.
  useEffect(() => {
    const id = setInterval(() => setSecondsLeft(s => (s > 0 ? s - 1 : 0)), 1000)

    return () => clearInterval(id)
  }, [])

  const { mutate, isPending } = useMutation({
    mutationFn: actionSendCode,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          setPublicCode(output.publicCode)
          setSecondsLeft(resendCooldownSeconds)
          toast.add({ type: 'success', title: t`A new code has been sent.` })
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
    <LoadingButton variant="ghost" isLoading={isPending} disabled={secondsLeft > 0} onClick={() => mutate({ email })}>
      {secondsLeft > 0 ? <Trans>Resend code in {secondsLeft}s</Trans> : <Trans>Resend code</Trans>}
    </LoadingButton>
  )
}
