'use client'

import type { JSX } from 'react'
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
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-medium">Something went wrong</h1>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
