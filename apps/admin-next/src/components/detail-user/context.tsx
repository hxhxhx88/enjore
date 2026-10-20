'use client'

import type { StoreApi, UseBoundStore } from 'zustand'
import { createContext, use } from 'react'
import { create, useStore as useStore_ } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface ModalDataEdit {
  type: 'edit'
}

interface ModalDataDelete {
  type: 'delete'
}

type ModalData = ModalDataEdit | ModalDataDelete

export interface State {
  modalData: ModalData | undefined
  setModalData: (modalData: ModalData | undefined) => void
}

export function createStore(): UseBoundStore<StoreApi<State>> {
  return create(
    immer<State>((set) => {
      return {
        modalData: undefined,
        setModalData(modalData: ModalData | undefined) {
          set((s) => {
            s.modalData = modalData
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
  userId: string
}

export const PropsContext = createContext<Props | undefined>(undefined)

export function useProps(): Props {
  const props = use(PropsContext)
  if (!props) {
    throw new Error('useProps must be used within PropsContext')
  }

  return props
}
