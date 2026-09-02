import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/shared/kpi-card'
import { CUSTOMERS, type InstalledMachine } from '@/mock/customers'
import { formatDate } from '@/lib/utils'
import { Cog, ShieldCheck, Wrench } from 'lucide-react'

interface TrackedMachine extends InstalledMachine {
  customerId: string
  customerName: string
}

export function MachineTrackingPage() {
  const navigate = useNavigate()

  const machines: TrackedMachine[] = useMemo(
    () => CUSTOMERS.flatMap((c) => c.installedMachines.map((m) => ({ ...m, customerId: c.id, customerName: c.name }))),
    [],
  )

  const amcActive = machines.filter((m) => m.amcActive).length
  const underService = machines.filter((m) => m.status === 'under-service').length

  const columns: ColumnDef<TrackedMachine>[] = [
    { accessorKey: 'productName', header: 'Machine' },
    { accessorKey: 'serialNumber', header: 'Serial No.', cell: ({ row }) => <span className="font-mono text-xs">{row.original.serialNumber}</span> },
    {
      id: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <button className="hover:text-primary" onClick={() => navigate(`/customers/${row.original.customerId}`)}>
          {row.original.customerName}
        </button>
      ),
    },
    { accessorKey: 'installedOn', header: 'Installed On', cell: ({ row }) => formatDate(row.original.installedOn) },
    { accessorKey: 'warrantyEndsOn', header: 'Warranty Ends', cell: ({ row }) => formatDate(row.original.warrantyEndsOn) },
    { accessorKey: 'amcActive', header: 'AMC', cell: ({ row }) => (row.original.amcActive ? <Badge variant="success">Active</Badge> : <Badge variant="muted">None</Badge>) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Machine Tracking"
        description="Serial-level tracking of every machine installed at customer sites."
        actions={<EntityToolbar newLabel="Register Machine" onNew={() => {}} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <KpiCard label="Machines Tracked" value={String(machines.length)} icon={Cog} accent="chart-1" />
        <KpiCard label="Under Active AMC" value={String(amcActive)} icon={ShieldCheck} accent="chart-2" />
        <KpiCard label="Under Service" value={String(underService)} icon={Wrench} accent="chart-4" />
      </div>

      <DataTable columns={columns} data={machines} searchPlaceholder="Search by machine, serial, or customer..." />
    </div>
  )
}
