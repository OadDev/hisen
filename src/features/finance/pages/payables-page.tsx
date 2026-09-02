import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { KpiCard } from '@/components/shared/kpi-card'
import { PAYABLES, type Payable } from '@/mock/finance'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Wallet, AlertTriangle } from 'lucide-react'

export function PayablesPage() {
  const totalDue = PAYABLES.filter((p) => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0)
  const overdue = PAYABLES.filter((p) => p.status === 'overdue').length

  const columns: ColumnDef<Payable>[] = [
    { accessorKey: 'id', header: 'Payment #' },
    { accessorKey: 'vendorName', header: 'Vendor' },
    { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount) },
    { accessorKey: 'dueDate', header: 'Due Date', cell: ({ row }) => formatDate(row.original.dueDate) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Payables"
        description="Vendor payment obligations and due dates."
        actions={<EntityToolbar newLabel="Record Payment" onNew={() => {}} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <KpiCard label="Total Payable" value={formatCurrency(totalDue)} icon={Wallet} accent="chart-2" />
        <KpiCard label="Overdue Payments" value={String(overdue)} icon={AlertTriangle} accent="chart-4" />
      </div>

      <DataTable columns={columns} data={PAYABLES} searchPlaceholder="Search payables..." />
    </div>
  )
}
