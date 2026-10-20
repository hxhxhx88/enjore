import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import { useStore } from './context'

export function ButtonUserAdd(): JSX.Element {
  const setModalData = useStore(s => s.setModalData)

  return (
    <Button onClick={() => setModalData({ type: 'add-user' })}>
      Add user
    </Button>
  )
}
