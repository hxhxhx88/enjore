'use client'

import type { JSX, ReactNode } from 'react'
import { toast } from '@repo/ui-web/primitives/toast'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface Prop {
  readonly children: ReactNode
}

function onError(...args: unknown[]): void {
  console.error(args)

  toast.add({ type: 'error', title: 'Something is wrong. Please try again later.' })
}

export function ReactQueryProvider({ children }: Prop): JSX.Element {
  // Create the client once per provider instance. A lazy `useState` initializer keeps it stable across renders.
  const [client] = useState(() => new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
