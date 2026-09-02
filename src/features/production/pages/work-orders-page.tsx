import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { WORK_ORDERS, engineerName, type WorkOrder } from '@/mock/production'
import { formatDate } from '@/lib/utils'

const PRIORITY_VARIANT = { low: 'muted', medium: 'warning', high: 'destructive' } as const

export function WorkOrdersPage() {
  const navigate = useNavigate()

  const columns: ColumnDef<WorkOrder>[] = [
    {
      accessorKey: 'id',
      header: 'Work Order',
      cell: ({ row }) => (
        <button className="font-medium text-foreground hover:text-primary" onClick={() => navigate(`/production/work-orders/${row.original.id}`)}>
          {row.original.id}
        </button>
      ),
    },
    { accessorKey: 'machineName', header: 'Machine' },
    { accessorKey: 'stage', header: 'Current Stage', cell: ({ row }) => <Badge variant="outline">{row.original.stage}</Badge> },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.progress} className="w-20" />
          <span className="text-xs text-muted-foreground">{row.original.progress}%</span>
        </div>
      ),
    },
    { id: 'engineer', header: 'Engineer', accessorFn: (row) => engineerName(row) },
    { accessorKey: 'dueDate', header: 'Due Date', cell: ({ row }) => formatDate(row.original.dueDate) },
    { accessorKey: 'priority', header: 'Priority', cell: ({ row }) => <Badge variant={PRIORITY_VARIANT[row.original.priority]} className="capitalize">{row.original.priority}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Work Orders"
        description="Track manufacturing progress across assembly, electrical, PLC, and testing stages."
        actions={<EntityToolbar newLabel="New Work Order" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={WORK_ORDERS} enableSelection searchPlaceholder="Search work orders..." />
    </div>
  )
}
