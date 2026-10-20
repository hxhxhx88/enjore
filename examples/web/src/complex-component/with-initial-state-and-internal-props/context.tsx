'use client'

import type { RefObject } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { createContext, use } from 'react'
import { create, useStore as useStore_ } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// Define state values separately to allow passing initial values to the store.
export interface StateValues {
  value: string
}

export interface State extends StateValues {
  setValue: (value: string) => void
}

// Accept initial values to the store.
export function createStore(initialValues: StateValues): UseBoundStore<StoreApi<State>> {
  return create(
    immer<State>((set) => {
      return {
        ...initialValues,
        setValue(value: string) {
          set((s) => {
            s.value = value
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

export interface Props {
  initialValues: StateValues
}

// `Props` defines the props that are passed to the component, while `ContextProps` further extends the props with internal shared values. Here we use `formRef` as an example.
export interface ContextProps extends Props {
  formRef: RefObject<HTMLFormElement | null>
}

export const PropsContext = createContext<ContextProps | undefined>(undefined)

export function useProps(): ContextProps {
  const props = use(PropsContext)
  if (!props) {
    throw new Error('useProps must be used within PropsContext')
  }

  return props
}
