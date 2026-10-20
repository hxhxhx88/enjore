'use client'

import type { JSX, ReactNode } from 'react'
import { useLingui } from '@lingui/react/macro'
import { toast } from '@repo/ui-web/primitives/toast'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface Props {
  readonly children: ReactNode
}

export function ReactQueryProvider({ children }: Props): JSX.Element {
  const { t } = useLingui()

  // Create the client once per provider instance. A lazy `useState` initializer keeps it stable across renders.
  const [client] = useState(() => {
    // Unexpected failures end up here; expected ones come back as `bad` outputs from the server actions.
    const onError = (error: unknown): void => {
      console.error(error)

      toast.add({ type: 'error', title: t`Something went wrong. Please try again later.` })
    }

    return new QueryClient({
      queryCache: new QueryCache({ onError }),
      mutationCache: new MutationCache({ onError }),
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    })
  })

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
