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

export default async function Page({ params }: PageProps<'/awards/[id]/editions/[edition-id]'>): Promise<JSX.Element> {
  const { id, 'edition-id': editionId } = await params
  const db = await connectDatabase()

  // The award id in the URL scopes the lookup, so an edition is only reachable under its own award.
  const { label, award } = await db.awardEdition.findUniqueOrThrow({
    where: { id: editionId, awardId: id },
    select: { label: true, award: { select: { name: true } } },
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={routes.awards.list}>Awards</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={routes.awards.detail(id)}>{award.name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
