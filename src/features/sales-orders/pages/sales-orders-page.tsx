import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { Progress } from '@/components/ui/progress'
import { useSalesOrders, type SalesOrder } from '@/features/sales-orders/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export function SalesOrdersPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useSalesOrders({ per_page: 100 })

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
    { id: 'customer', header: 'Customer', accessorFn: (row) => row.customer?.name ?? '—' },
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
      {isLoading ? (
        <PageSkeleton />
      ) : isError ? (
        <EmptyState icon={AlertTriangle} title="Couldn't load sales orders" description={error.message} />
      ) : (
        <DataTable columns={columns} data={data?.data ?? []} enableSelection searchPlaceholder="Search sales orders..." />
      )}
    </div>
  )
}
