import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Progress } from '@/components/ui/progress'
import { SALES_ORDERS, customerForOrder, type SalesOrder } from '@/mock/sales-orders'
import { formatCurrency, formatDate } from '@/lib/utils'

export function SalesOrdersPage() {
  const navigate = useNavigate()

  const columns: ColumnDef<SalesOrder>[] = [
    {
      accessorKey: 'id',
      header: 'Order #',
      cell: ({ row }) => (
        <button className="font-medium text-foreground hover:text-primary" onClick={() => navigate(`/sales-orders/${row.original.id}`)}>
          {row.original.id}
        </button>
      ),
    },
    { id: 'customer', header: 'Customer', accessorFn: (row) => customerForOrder(row)?.name ?? '—' },
    { accessorKey: 'orderDate', header: 'Order Date', cell: ({ row }) => formatDate(row.original.orderDate) },
    { accessorKey: 'orderValue', header: 'Value', cell: ({ row }) => formatCurrency(row.original.orderValue, row.original.currency) },
    {
      accessorKey: 'productionProgress',
      header: 'Production',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.productionProgress} className="w-20" />
          <span className="text-xs text-muted-foreground">{row.original.productionProgress}%</span>
        </div>
      ),
    },
    { accessorKey: 'paymentStatus', header: 'Payment', cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} /> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Sales Orders"
        description="Confirmed orders from quotation through dispatch and installation."
        actions={<EntityToolbar newLabel="New Sales Order" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={SALES_ORDERS} enableSelection searchPlaceholder="Search sales orders..." />
    </div>
  )
}
