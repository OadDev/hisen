import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { KpiCard } from '@/components/shared/kpi-card'
import { INVOICES, type Invoice } from '@/mock/finance'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Receipt, AlertTriangle, TrendingUp } from 'lucide-react'

export function ReceivablesPage() {
  const outstanding = useMemo(() => INVOICES.filter((i) => i.status !== 'paid'), [])
  const totalOutstanding = outstanding.reduce((sum, i) => sum + (i.amount - i.amountPaid), 0)
  const overdue = INVOICES.filter((i) => i.status === 'overdue')

  const columns: ColumnDef<Invoice>[] = [
    { accessorKey: 'id', header: 'Invoice #' },
    { accessorKey: 'customerName', header: 'Customer' },
    { id: 'balance', header: 'Balance Due', accessorFn: (row) => row.amount - row.amountPaid, cell: ({ row }) => formatCurrency(row.original.amount - row.original.amountPaid, row.original.currency) },
    { accessorKey: 'dueDate', header: 'Due Date', cell: ({ row }) => formatDate(row.original.dueDate) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Receivables" description="Outstanding customer balances and aging." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <KpiCard label="Total Outstanding" value={formatCurrency(totalOutstanding)} icon={Receipt} accent="chart-2" />
        <KpiCard label="Overdue Invoices" value={String(overdue.length)} icon={AlertTriangle} accent="chart-4" />
        <KpiCard label="Avg. Collection Period" value="34 days" icon={TrendingUp} accent="chart-1" />
      </div>

      <DataTable columns={columns} data={outstanding} searchPlaceholder="Search receivables..." />
    </div>
  )
}
