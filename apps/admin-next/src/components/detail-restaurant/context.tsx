'use client'

import type { StoreApi, UseBoundStore } from 'zustand'
import type { ChainOption, ChainRow, RestaurantDetail } from './select'
import type { TranslationRow } from '@/components/editor-translations'
import type { FactKey } from '@/lib/facts'
import { createContext, use } from 'react'
import { create, useStore as useStore_ } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface ModalDataRestaurantEdit {
  type: 'restaurant-edit'
}

interface ModalDataRestaurantDelete {
  type: 'restaurant-delete'
}

export interface ModalDataFactEdit {
  type: 'fact-edit'
  fact: FactKey
}

export interface ModalDataFactClear {
  type: 'fact-clear'
  fact: FactKey
}

export interface ModalDataChainCreate {
  type: 'chain-create'
  // The name typed in the picker, prefilled in the form.
  name: string
}

export interface ModalDataChainEdit {
  type: 'chain-edit'
  chain: ChainRow
}

// One field for the open modal keeps at most one open at a time (`docs/development/0003-coding/modal.md`).
type ModalData
  = | ModalDataRestaurantEdit
    | ModalDataRestaurantDelete
    | ModalDataFactEdit
    | ModalDataFactClear
    | ModalDataChainCreate
    | ModalDataChainEdit

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

// The page loads the restaurant once and passes it down; every action revalidates the page, so the props stay fresh.
export interface Props {
  restaurant: RestaurantDetail
  nameTranslations: TranslationRow[]
  chainNameTranslations: TranslationRow[]
  chains: ChainOption[]
}

export const PropsContext = createContext<Props | undefined>(undefined)

export function useProps(): Props {
  const props = use(PropsContext)
  if (!props) {
    throw new Error('useProps must be used within PropsContext')
  }

  return props
}
