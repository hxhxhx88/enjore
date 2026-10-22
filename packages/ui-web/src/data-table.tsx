'use client'

import type { RowData, RowSelectionState, Updater } from '@tanstack/react-table'
import type { HTMLAttributes, JSX, ReactNode } from 'react'
import type { DataTableColumnDef, DataTableHeader } from './lib/data-table'
import { flexRender, useTable } from '@tanstack/react-table'
import { useState } from 'react'
import { dataTableFeatures } from './lib/data-table'
import { cn } from './lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './primitives/table'

interface DataTableProps<Data extends RowData> {
  columns: Array<DataTableColumnDef<Data>>
  data: Data[]
  // Callers pass their own optional class straight through, so an explicit `undefined` is accepted.
  className?: string | undefined
  emptyContent?: ReactNode
  headerProps?: (header: DataTableHeader<Data>) => HTMLAttributes<HTMLTableCellElement>
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void
}

export function DataTable<Data extends RowData>({
  columns,
  data,
  className,
  emptyContent,
  headerProps,
  onRowSelectionChange,
}: DataTableProps<Data>): JSX.Element {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    enableRowSelection: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange(updater: Updater<RowSelectionState>) {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(next)
      onRowSelectionChange?.(next)
    },
  })

  const rows = table.getRowModel().rows

  return (
    <div className={cn('overflow-hidden border', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const width = header.getSize()

                return (
                  <TableHead
                    key={header.id}
                    style={{
                      ...(width ? { width } : undefined),
                    }}
                    {...headerProps?.(header)}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length > 0
            ? (
                rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getAllCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              )
            : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyContent}
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  )
}
