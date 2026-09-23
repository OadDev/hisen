import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { useInvoices, type Invoice } from '@/features/finance/api'
import { InvoiceFormDialog } from '@/features/finance/components/invoice-form-dialog'
import { formatCurrency, formatDate } from '@/lib/utils'

export function InvoicesPage() {
  const [searchParams] = useSearchParams()
  const [formOpen, setFormOpen] = useState(searchParams.get('new') === '1')
  const { data, isLoading, isError, error } = useInvoices({ per_page: 100 })

  const columns: ColumnDef<Invoice>[] = [
    { accessorKey: 'id', header: 'Invoice #', cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
    { accessorKey: 'customerName', header: 'Customer' },
    { id: 'salesOrder', header: 'Sales Order', accessorFn: (row) => row.salesOrder?.id ?? '—' },
    { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount, row.original.currency) },
    { accessorKey: 'amountPaid', header: 'Paid', cell: ({ row }) => formatCurrency(row.original.amountPaid, row.original.currency) },
    { accessorKey: 'dueDate', header: 'Due Date', cell: ({ row }) => formatDate(row.original.dueDate) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Customer invoices raised against confirmed sales orders."
        actions={<EntityToolbar newLabel="New Invoice" onNew={() => setFormOpen(true)} />}
      />
      {isLoading ? (
        <PageSkeleton />
      ) : isError ? (
        <EmptyState icon={AlertTriangle} title="Couldn't load invoices" description={error.message} />
      ) : (
        <DataTable columns={columns} data={data?.data ?? []} enableSelection searchPlaceholder="Search invoices..." />
      )}
      <InvoiceFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
