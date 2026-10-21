'use client'

import type { Route } from 'next'
import type { JSX, ReactNode } from 'react'
import { SidebarMenuButton, SidebarMenuItem } from '@repo/ui-web/primitives/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  readonly href: Route
  // A rendered element rather than a component, so a server component can pass it across the client boundary.
  readonly icon: ReactNode
  readonly children: ReactNode
}

export function AppSidebarItem({ href, icon, children }: Props): JSX.Element {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} render={<Link href={href} />}>
        {icon}
        <span>{children}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
