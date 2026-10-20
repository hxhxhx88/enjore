'use client'

import type { JSX } from 'react'
import { Trans } from '@lingui/react/macro'
import { Button } from '@repo/ui-web/primitives/button'
import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props): JSX.Element {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-medium">
        <Trans>Something went wrong</Trans>
      </h1>
      <Button onClick={reset}>
        <Trans>Try again</Trans>
      </Button>
    </div>
  )
}
