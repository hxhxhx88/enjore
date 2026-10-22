import type { JSX } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
} from '@repo/ui-web/primitives/sidebar'
import { AwardIcon, LayoutDashboardIcon } from 'lucide-react'
import { routes } from '@/lib/routes'
import { AppSidebarItem } from './app-sidebar-item'

export function AppSidebar(): JSX.Element {
  return (
    <Sidebar>
      <SidebarHeader>
        <span className="px-2 py-1 text-sm font-semibold tracking-tight">
          Enjore
          <span className="font-normal text-muted-foreground"> admin</span>
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <AppSidebarItem href={routes.home} icon={<LayoutDashboardIcon />}>
              Dashboard
            </AppSidebarItem>
            <AppSidebarItem href={routes.awards.list} icon={<AwardIcon />}>
              Awards
            </AppSidebarItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
