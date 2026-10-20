import type { JSX } from 'react'
import type { Props } from './context'
import { useMemo, useRef } from 'react'
import { createStore, PropsContext, StoreContext } from './context'
import { Render } from './render'

export function MyComponentV2(props: Props): JSX.Element {
  const { initialValues } = props

  // Create the store with the initial values.
  const store = useMemo(() => createStore(initialValues), [initialValues])

  // Create necessary internal props.
  const formRef = useRef<HTMLFormElement>(null)
  const contextProps = useMemo(() => ({ ...props, formRef }), [props, formRef])

  return (
    <PropsContext value={contextProps}>
      <StoreContext value={store}>
        <Render />
      </StoreContext>
    </PropsContext>
  )
}
