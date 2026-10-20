import type { JSX } from 'react'
import { Trans } from '@lingui/react/macro'
import { Button } from '@repo/ui-web/primitives/button'
import Link from 'next/link'

export default function NotFound(): JSX.Element {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-medium">
        <Trans>Page not found</Trans>
      </h1>
      {/* The proxy redirects the bare root to the visitor's locale. */}
      <Button nativeButton={false} render={<Link href={{ pathname: '/' }} />}>
        <Trans>Back to home</Trans>
      </Button>
    </div>
  )
}
