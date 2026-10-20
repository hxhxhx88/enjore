import type { ColumnDef, Header, RowData } from '@tanstack/react-table'
import { columnSizingFeature, rowSelectionFeature, tableFeatures } from '@tanstack/react-table'

// TanStack Table v9 only bundles the features a table registers. Consumers type their columns against this set.
export const dataTableFeatures = tableFeatures({ columnSizingFeature, rowSelectionFeature })

export type DataTableFeatures = typeof dataTableFeatures

export type DataTableColumnDef<Data extends RowData, Value = unknown> = ColumnDef<DataTableFeatures, Data, Value>

export type DataTableHeader<Data extends RowData> = Header<DataTableFeatures, Data, unknown>
