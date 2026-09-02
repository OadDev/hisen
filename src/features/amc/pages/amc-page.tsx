import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { KpiCard } from '@/components/shared/kpi-card'
import { Progress } from '@/components/ui/progress'
import { AMC_CONTRACTS, amcEngineerName, type AmcContract } from '@/mock/amc'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ShieldCheck, AlertTriangle, IndianRupee, CalendarClock } from 'lucide-react'

export function AmcPage() {
  const active = AMC_CONTRACTS.filter((c) => c.status === 'active').length
  const expiringSoon = AMC_CONTRACTS.filter((c) => c.status === 'expiring-soon').length
  const totalValue = AMC_CONTRACTS.reduce((sum, c) => sum + c.value, 0)

  const columns: ColumnDef<AmcContract>[] = [
    { accessorKey: 'id', header: 'Contract #' },
    { accessorKey: 'customerName', header: 'Customer' },
    { accessorKey: 'machine', header: 'Machine' },
    { accessorKey: 'serialNumber', header: 'Serial No.', cell: ({ row }) => <span className="font-mono text-xs">{row.original.serialNumber}</span> },
    { id: 'engineer', header: 'Engineer', accessorFn: (row) => amcEngineerName(row) },
    {
      id: 'visits',
      header: 'Visits Completed',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={(row.original.visitsCompleted / row.original.visitsPerYear) * 100} className="w-20" />
          <span className="text-xs text-muted-foreground">{row.original.visitsCompleted}/{row.original.visitsPerYear}</span>
        </div>
      ),
    },
    { accessorKey: 'endDate', header: 'Expires On', cell: ({ row }) => formatDate(row.original.endDate) },
    { accessorKey: 'value', header: 'Contract Value', cell: ({ row }) => formatCurrency(row.original.value) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Annual Maintenance Contracts"
        description="AMC renewals, preventive maintenance schedule, and coverage value."
        actions={<EntityToolbar newLabel="New AMC" onNew={() => {}} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
        <KpiCard label="Active Contracts" value={String(active)} icon={ShieldCheck} accent="chart-1" />
        <KpiCard label="Expiring Soon" value={String(expiringSoon)} icon={AlertTriangle} accent="chart-4" />
        <KpiCard label="Total AMC Value" value={formatCurrency(totalValue)} icon={IndianRupee} accent="chart-2" />
        <KpiCard label="Visits This Quarter" value="48" icon={CalendarClock} accent="chart-3" />
      </div>

      <DataTable columns={columns} data={AMC_CONTRACTS} searchPlaceholder="Search AMC contracts..." />
    </div>
  )
}
