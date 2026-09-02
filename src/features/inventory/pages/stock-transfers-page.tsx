import type { ColumnDef } from '@tanstack/react-table'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { STOCK_TRANSFERS, type StockTransfer } from '@/mock/inventory'
import { formatDate } from '@/lib/utils'

export function StockTransfersPage() {
  const columns: ColumnDef<StockTransfer>[] = [
    { accessorKey: 'id', header: 'Transfer #', cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
    { accessorKey: 'item', header: 'Item' },
    { accessorKey: 'quantity', header: 'Qty' },
    {
      id: 'route',
      header: 'Route',
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 text-sm">
          {row.original.fromWarehouse} <ArrowRight className="size-3.5 text-muted-foreground" /> {row.original.toWarehouse}
        </span>
      ),
    },
    { accessorKey: 'requestedDate', header: 'Requested', cell: ({ row }) => formatDate(row.original.requestedDate) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Stock Transfers"
        description="Inter-warehouse transfer requests and shipment tracking."
        actions={<EntityToolbar newLabel="New Transfer" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={STOCK_TRANSFERS} searchPlaceholder="Search transfers..." />
    </div>
  )
}
