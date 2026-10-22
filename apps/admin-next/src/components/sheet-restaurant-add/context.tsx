'use client'

import type { StoreApi, UseBoundStore } from 'zustand'
import type { FormTypeRestaurantEntry } from '@/components/form-restaurant-entry'
import type { ResolveResult } from '@/lib/resolver/resolve-entry'
import { createContext, use } from 'react'
import { create, useStore as useStore_ } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// A match opens the existing restaurant and never reaches the review step.
type ReviewResult = Extract<ResolveResult, { type: 'new' | 'unresolved' }>

interface StepEntry {
  type: 'entry'
  // "Back" from the review returns the values the operator typed.
  initialValues: FormTypeRestaurantEntry | undefined
}

export interface StepReview {
  type: 'review'
  entry: FormTypeRestaurantEntry
  result: ReviewResult
  // The place the restaurant is created from: the trusted one, one the operator picked, or none.
  placeId: string | null
}

type Step = StepEntry | StepReview

export interface State {
  step: Step
  setStep: (step: Step) => void
}

export function createStore(): UseBoundStore<StoreApi<State>> {
  return create(
    immer<State>((set) => {
      return {
        step: { type: 'entry', initialValues: undefined },
        setStep(step: Step) {
          set((s) => {
            s.step = step
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
  // Called with the restaurant to open: the created one, or the existing one the entry matched.
  onDone: (id: string) => void
}

export const PropsContext = createContext<Props | undefined>(undefined)

export function useProps(): Props {
  const props = use(PropsContext)
  if (!props) {
    throw new Error('useProps must be used within PropsContext')
  }

  return props
}
