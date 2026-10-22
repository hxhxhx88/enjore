'use client'

import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui-web/primitives/sheet'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SheetRestaurantAdd } from '@/components/sheet-restaurant-add'
import { routes } from '@/lib/routes'

export function ButtonRestaurantAdd(): JSX.Element {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        Add restaurant
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-lg">
        <SheetRestaurantAdd
          onDone={(id) => {
            setOpen(false)
            router.push(routes.restaurants.detail(id))
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
