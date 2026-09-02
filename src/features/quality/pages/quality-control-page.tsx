import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { KpiCard } from '@/components/shared/kpi-card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QC_INSPECTIONS, NCRS, type QcInspection, type Ncr } from '@/mock/quality'
import { formatDate } from '@/lib/utils'
import { ShieldCheck, ShieldAlert, ClipboardCheck } from 'lucide-react'

const SEVERITY_VARIANT = { minor: 'muted', major: 'warning', critical: 'destructive' } as const

export function QualityControlPage() {
  const passRate = Math.round((QC_INSPECTIONS.filter((q) => q.result === 'passed').length / QC_INSPECTIONS.length) * 100)
  const openNcrs = NCRS.filter((n) => n.status !== 'closed').length

  const inspectionColumns: ColumnDef<QcInspection>[] = [
    { accessorKey: 'id', header: 'Inspection #' },
    { accessorKey: 'workOrderId', header: 'Work Order' },
    { accessorKey: 'stage', header: 'Stage', cell: ({ row }) => <Badge variant="outline">{row.original.stage}</Badge> },
    { id: 'checklist', header: 'Checklist', cell: ({ row }) => `${row.original.checklistPassed}/${row.original.checklistItems} passed` },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
    { accessorKey: 'result', header: 'Result', cell: ({ row }) => <StatusBadge status={row.original.result} /> },
  ]

  const ncrColumns: ColumnDef<Ncr>[] = [
    { accessorKey: 'id', header: 'NCR #' },
    { accessorKey: 'workOrderId', header: 'Work Order' },
    { accessorKey: 'stage', header: 'Stage', cell: ({ row }) => <Badge variant="outline">{row.original.stage}</Badge> },
    { accessorKey: 'description', header: 'Defect' },
    { accessorKey: 'severity', header: 'Severity', cell: ({ row }) => <Badge variant={SEVERITY_VARIANT[row.original.severity]} className="capitalize">{row.original.severity}</Badge> },
    { accessorKey: 'raisedOn', header: 'Raised On', cell: ({ row }) => formatDate(row.original.raisedOn) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Quality Control"
        description="Inspection checklists across incoming, assembly, electrical, PLC, final, and packing stages."
        actions={<EntityToolbar newLabel="New Inspection" onNew={() => {}} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <KpiCard label="Overall Pass Rate" value={`${passRate}%`} icon={ShieldCheck} accent="chart-1" />
        <KpiCard label="Open NCRs" value={String(openNcrs)} icon={ShieldAlert} accent="chart-4" />
        <KpiCard label="Inspections (30d)" value={String(QC_INSPECTIONS.length)} icon={ClipboardCheck} accent="chart-2" />
      </div>

      <Tabs defaultValue="inspections">
        <TabsList>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="ncr">Non-Conformance Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="inspections" className="mt-4">
          <DataTable columns={inspectionColumns} data={QC_INSPECTIONS} searchPlaceholder="Search inspections..." />
        </TabsContent>
        <TabsContent value="ncr" className="mt-4">
          <DataTable columns={ncrColumns} data={NCRS} searchPlaceholder="Search NCRs..." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
