import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { GOODS_RECEIPTS, type GoodsReceipt } from '@/mock/purchase'
import { formatDate } from '@/lib/utils'

export function GrnPage() {
  const columns: ColumnDef<GoodsReceipt>[] = [
    { accessorKey: 'id', header: 'GRN #', cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
    { accessorKey: 'poId', header: 'PO Reference' },
    { accessorKey: 'item', header: 'Item' },
    {
      id: 'qty',
      header: 'Quantity',
      cell: ({ row }) => `${row.original.quantityReceived} / ${row.original.quantityOrdered}`,
    },
    { accessorKey: 'warehouse', header: 'Warehouse' },
    { accessorKey: 'receivedDate', header: 'Received On', cell: ({ row }) => formatDate(row.original.receivedDate) },
    { accessorKey: 'qcStatus', header: 'QC Status', cell: ({ row }) => <StatusBadge status={row.original.qcStatus} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Goods Receipt Notes"
        description="Incoming stock receipts against purchase orders with QC status."
        actions={<EntityToolbar newLabel="New GRN" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={GOODS_RECEIPTS} searchPlaceholder="Search goods receipts..." />
    </div>
  )
}
