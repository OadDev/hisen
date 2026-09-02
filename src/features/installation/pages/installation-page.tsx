import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { INSTALLATIONS, type InstallationJob } from '@/mock/installation'
import { staffById } from '@/mock/staff'
import { formatDate } from '@/lib/utils'
import { CheckCircle2, FileSignature } from 'lucide-react'

export function InstallationPage() {
  const columns: ColumnDef<InstallationJob>[] = [
    { accessorKey: 'id', header: 'Job #', cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
    { accessorKey: 'customerName', header: 'Customer' },
    { id: 'engineer', header: 'Engineer', accessorFn: (row) => staffById(row.engineerId)?.name },
    { accessorKey: 'scheduledDate', header: 'Scheduled', cell: ({ row }) => formatDate(row.original.scheduledDate) },
    {
      id: 'checklist',
      header: 'Checklist',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={(row.original.checklistDone / row.original.checklistTotal) * 100} className="w-20" />
          <span className="text-xs text-muted-foreground">{row.original.checklistDone}/{row.original.checklistTotal}</span>
        </div>
      ),
    },
    {
      id: 'signoff',
      header: 'Sign-off',
      cell: ({ row }) =>
        row.original.customerSigned ? (
          <Badge variant="success"><FileSignature className="size-3" /> Signed</Badge>
        ) : (
          <Badge variant="muted">Pending</Badge>
        ),
    },
    {
      id: 'training',
      header: 'Training',
      cell: ({ row }) => (row.original.trainingCompleted ? <Badge variant="success"><CheckCircle2 className="size-3" /> Done</Badge> : <Badge variant="muted">Pending</Badge>),
    },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Installation"
        description="Engineer assignment, site checklists, and customer sign-off."
        actions={<EntityToolbar newLabel="Schedule Installation" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={INSTALLATIONS} searchPlaceholder="Search installation jobs..." />
    </div>
  )
}
