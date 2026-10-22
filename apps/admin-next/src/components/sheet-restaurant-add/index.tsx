'use client'

import type { JSX } from 'react'
import type { Props } from './context'
import { useMemo } from 'react'
import { createStore, PropsContext, StoreContext } from './context'
import { Render } from './render'

// The content of the "Add restaurant" sheet: the entry step, then the review of what the resolver found. The sheet
// around it unmounts on close, so each opening starts from a fresh store.
export function SheetRestaurantAdd(props: Props): JSX.Element {
  const store = useMemo(() => createStore(), [])
  return (
    <PropsContext value={props}>
      <StoreContext value={store}>
        <Render />
      </StoreContext>
    </PropsContext>
  )
}
