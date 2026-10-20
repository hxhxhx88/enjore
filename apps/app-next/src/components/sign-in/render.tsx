import type { JSX } from 'react'
import { Trans } from '@lingui/react/macro'
import { AppLogo } from '@repo/ui-web/app-logo'
import { codeLength } from '@/lib/verification'
import { useStore } from './context'
import { StepCode } from './step-code'
import { StepEmail } from './step-email'

export function Render(): JSX.Element {
  const step = useStore(s => s.step)
  const email = useStore(s => s.email)

  return (
    <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <AppLogo size={48} />
        <h1 className="text-xl font-semibold">
          <Trans>Sign in</Trans>
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === 'email'
            ? <Trans>Enter your email and we will send you a sign-in code.</Trans>
            : <Trans>We sent a {codeLength}-digit code to {email}.</Trans>}
        </p>
      </div>
      {step === 'email' ? <StepEmail /> : <StepCode />}
    </div>
  )
}
