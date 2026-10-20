'use client'

import type { JSX } from 'react'
import { useMemo } from 'react'
import { createStore, StoreContext } from './context'
import { Render } from './render'

export function SignIn(): JSX.Element {
  // It is important to wrap `createStore` with `useMemo` to avoid re-creating the store on every render.
  const store = useMemo(() => createStore(), [])

  return (
    <StoreContext value={store}>
      <Render />
    </StoreContext>
  )
}
