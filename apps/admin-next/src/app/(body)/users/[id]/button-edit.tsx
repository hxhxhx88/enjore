'use client'

import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import { useDetailUserStore } from '@/components/detail-user'

export function ButtonUserEdit(): JSX.Element {
  const setModalData = useDetailUserStore(s => s.setModalData)

  return (
    <Button onClick={() => setModalData({ type: 'edit' })}>
      Edit user
    </Button>
  )
}
