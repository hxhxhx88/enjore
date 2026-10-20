import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { LinkParameters } from './link-parameters'

interface Props {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: Props): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2">
      {currentPage > 1
        ? (
            <LinkParameters parameters={{ page: `${currentPage - 1}` }}>
              <Button size="icon" variant="outline">
                <ChevronLeftIcon />
              </Button>
            </LinkParameters>
          )
        : (
            <Button disabled size="icon" variant="outline">
              <ChevronLeftIcon />
            </Button>
          )}
      <div className="flex items-center gap-1">
        {`${currentPage} of ${totalPages}`}
      </div>
      {currentPage < totalPages
        ? (
            <LinkParameters parameters={{ page: `${currentPage + 1}` }}>
              <Button size="icon" variant="outline">
                <ChevronRightIcon />
              </Button>
            </LinkParameters>
          )
        : (
            <Button disabled size="icon" variant="outline">
              <ChevronRightIcon />
            </Button>
          )}
    </div>
  )
}
