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

export default async function Page({ params }: PageProps<'/awards/[id]'>): Promise<JSX.Element> {
  const { id } = await params
  const db = await connectDatabase()

  const { name } = await db.award.findUniqueOrThrow({
    where: { id },
    select: { name: true },
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={routes.awards.list}>Awards</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
