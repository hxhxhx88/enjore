'use client'

import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@repo/ui-web/primitives/dropdown-menu'
import { EllipsisIcon } from 'lucide-react'
import { useDetailUserStore } from '@/components/detail-user'

export function ButtonMenu(): JSX.Element {
  const setModalData = useDetailUserStore(s => s.setModalData)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setModalData({ type: 'delete' })} variant="destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
