import type { JSX } from 'react'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { useMutation } from '@tanstack/react-query'
import { actionUserAdd } from './action-user-add'

export function ButtonUserAdd(): JSX.Element {
  const { mutate, isPending } = useMutation({
    mutationFn: actionUserAdd,
  })

  return (
    <LoadingButton
      isLoading={isPending}
      onClick={() => mutate({ name: 'John Doe', email: 'john.doe@example.com' })}
    >
      Add user
    </LoadingButton>
  )
}
