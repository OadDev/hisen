import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/shared/kpi-card'
import { SHIPMENTS, type Shipment } from '@/mock/dispatch'
import { formatDate } from '@/lib/utils'
import { PackageCheck, Ship, FileWarning, Truck } from 'lucide-react'

export function DispatchPage() {
  const inTransit = SHIPMENTS.filter((s) => s.status === 'in-transit').length
  const docsPending = SHIPMENTS.filter((s) => !s.exportDocsReady).length
  const exportShipments = SHIPMENTS.filter((s) => s.mode !== 'road').length

  const columns: ColumnDef<Shipment>[] = [
    { accessorKey: 'id', header: 'Shipment #', cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
    { accessorKey: 'salesOrderId', header: 'Sales Order' },
    { accessorKey: 'customerName', header: 'Customer' },
    { accessorKey: 'destination', header: 'Destination' },
    { accessorKey: 'mode', header: 'Mode', cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.mode}</Badge> },
    { accessorKey: 'containerNo', header: 'Container #', cell: ({ row }) => row.original.containerNo ?? '—' },
    { accessorKey: 'eta', header: 'ETA', cell: ({ row }) => formatDate(row.original.eta) },
    {
      accessorKey: 'exportDocsReady',
      header: 'Export Docs',
      cell: ({ row }) => (row.original.mode === 'road' ? '—' : row.original.exportDocsReady ? <Badge variant="success">Ready</Badge> : <Badge variant="warning">Pending</Badge>),
    },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Dispatch"
        description="Packing lists, container planning, and shipment tracking."
        actions={<EntityToolbar newLabel="New Shipment" onNew={() => {}} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
        <KpiCard label="Active Shipments" value={String(SHIPMENTS.length)} icon={Truck} accent="chart-1" />
        <KpiCard label="In Transit" value={String(inTransit)} icon={PackageCheck} accent="chart-2" />
        <KpiCard label="Export Shipments" value={String(exportShipments)} icon={Ship} accent="chart-3" />
        <KpiCard label="Docs Pending" value={String(docsPending)} icon={FileWarning} accent="chart-4" />
      </div>

      <DataTable columns={columns} data={SHIPMENTS} searchPlaceholder="Search shipments..." />
    </div>
  )
}
