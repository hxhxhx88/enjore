import type { JSX } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui-web/primitives/breadcrumb'
import { connectDatabase } from '@/lib/db'
import { routes } from '@/lib/routes'

export default async function Page({ params }: PageProps<'/users/[id]'>): Promise<JSX.Element> {
  const { id } = await params
  const db = await connectDatabase()

  const { email } = await db.user.findUniqueOrThrow({
    where: { id },
    select: { email: true },
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={routes.users.list}>Users</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{email}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
