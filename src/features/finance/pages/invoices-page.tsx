import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { INVOICES, type Invoice } from '@/mock/finance'
import { formatCurrency, formatDate } from '@/lib/utils'

export function InvoicesPage() {
  const columns: ColumnDef<Invoice>[] = [
    { accessorKey: 'id', header: 'Invoice #', cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
    { accessorKey: 'customerName', header: 'Customer' },
    { accessorKey: 'salesOrderId', header: 'Sales Order' },
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
        actions={<EntityToolbar newLabel="New Invoice" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={INVOICES} enableSelection searchPlaceholder="Search invoices..." />
    </div>
  )
}
