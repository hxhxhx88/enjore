'use client'

import type { JSX } from 'react'
import type { Props } from './context'
import { useMemo } from 'react'
import { createStore, PropsContext, StoreContext } from './context'
import { ModalController } from './modal-controller'

export function Provider({ children, ...props }: Props & { children: JSX.Element }): JSX.Element {
  const store = useMemo(() => createStore(), [])
  return (
    <PropsContext value={props}>
      <StoreContext value={store}>
        {children}
        <ModalController />
      </StoreContext>
    </PropsContext>
  )
}
