import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { EXPENSES, type Expense } from '@/mock/finance'
import { formatCurrency, formatDate } from '@/lib/utils'

export function ExpensesPage() {
  const columns: ColumnDef<Expense>[] = [
    { accessorKey: 'id', header: 'Expense #' },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge> },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'submittedBy', header: 'Submitted By' },
    { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount) },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Operational and field expense claims across departments."
        actions={<EntityToolbar newLabel="New Expense" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={EXPENSES} enableSelection searchPlaceholder="Search expenses..." />
    </div>
  )
}
