'use client'

import type { JSX } from 'react'
import { Trans } from '@lingui/react/macro'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/hooks'
import { routes } from '@/lib/routes'
import { actionSignOut } from './action-sign-out'

export function ButtonSignOut(): JSX.Element {
  const router = useRouter()
  const locale = useLocale()

  const { mutate, isPending } = useMutation({
    mutationFn: actionSignOut,
    onSuccess() {
      // The action cleared the session cookie; the home page reads it on the server.
      router.replace(routes.home(locale))
    },
  })

  return (
    <LoadingButton isLoading={isPending} onClick={() => mutate()}>
      <Trans>Sign out</Trans>
    </LoadingButton>
  )
}
