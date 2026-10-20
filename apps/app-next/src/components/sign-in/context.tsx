'use client'

import type { StoreApi, UseBoundStore } from 'zustand'
import { createContext, use } from 'react'
import { create, useStore as useStore_ } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface State {
  step: 'email' | 'code'
  // Set when the code step starts. `publicCode` identifies the pending code on the server.
  email: string
  publicCode: string
  startCodeStep: (input: { email: string, publicCode: string }) => void
  setPublicCode: (publicCode: string) => void
  restart: () => void
}

export function createStore(): UseBoundStore<StoreApi<State>> {
  return create(
    immer<State>((set) => {
      return {
        step: 'email',
        email: '',
        publicCode: '',
        startCodeStep({ email, publicCode }) {
          set((s) => {
            s.step = 'code'
            s.email = email
            s.publicCode = publicCode
          })
        },
        setPublicCode(publicCode) {
          set((s) => {
            s.publicCode = publicCode
          })
        },
        restart() {
          set((s) => {
            s.step = 'email'
            s.email = ''
            s.publicCode = ''
          })
        },
      }
    }),
  )
}

export const StoreContext = createContext<ReturnType<typeof createStore> | undefined>(undefined)

export function useStore<U>(selector: (state: State) => U): U {
  const store = use(StoreContext)
  if (!store) {
    throw new Error('useStore must be used within StoreContext')
  }

  return useStore_(store, selector)
}
