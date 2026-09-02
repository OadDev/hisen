import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { PURCHASE_ORDERS, type PurchaseOrder } from '@/mock/purchase'
import { vendorById } from '@/mock/vendors'
import { formatCurrency, formatDate } from '@/lib/utils'

export function PurchaseOrdersPage() {
  const navigate = useNavigate()

  const columns: ColumnDef<PurchaseOrder>[] = [
    { accessorKey: 'id', header: 'PO #', cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
    {
      id: 'vendor',
      header: 'Vendor',
      accessorFn: (row) => vendorById(row.vendorId)?.name ?? '—',
      cell: ({ row }) => (
        <button className="text-left hover:text-primary" onClick={() => navigate(`/vendors/${row.original.vendorId}`)}>
          {vendorById(row.original.vendorId)?.name}
        </button>
      ),
    },
    { accessorKey: 'item', header: 'Item' },
    { accessorKey: 'quantity', header: 'Qty' },
    { accessorKey: 'totalValue', header: 'Value', cell: ({ row }) => formatCurrency(row.original.totalValue) },
    { accessorKey: 'expectedDelivery', header: 'Expected Delivery', cell: ({ row }) => formatDate(row.original.expectedDelivery) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description="Track PO approvals, dispatch, and receipt status."
        actions={<EntityToolbar newLabel="New Purchase Order" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={PURCHASE_ORDERS} enableSelection searchPlaceholder="Search purchase orders..." />
    </div>
  )
}
