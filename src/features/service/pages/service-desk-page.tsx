import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/shared/kpi-card'
import { TICKETS, ticketCustomer, ticketEngineer, type ServiceTicket } from '@/mock/service'
import { formatDateTime } from '@/lib/utils'
import { Headphones, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

const PRIORITY_VARIANT = { low: 'muted', medium: 'info', high: 'warning', urgent: 'destructive' } as const

export function ServiceDeskPage() {
  const navigate = useNavigate()
  const open = TICKETS.filter((t) => t.status === 'open' || t.status === 'in-progress').length
  const urgent = TICKETS.filter((t) => t.priority === 'urgent' && t.status !== 'closed').length
  const closed = TICKETS.filter((t) => t.status === 'closed').length

  const columns: ColumnDef<ServiceTicket>[] = [
    {
      accessorKey: 'id',
      header: 'Ticket #',
      cell: ({ row }) => (
        <button className="font-medium hover:text-primary" onClick={() => navigate(`/service/${row.original.id}`)}>
          {row.original.id}
        </button>
      ),
    },
    { accessorKey: 'subject', header: 'Subject' },
    { id: 'customer', header: 'Customer', accessorFn: (row) => ticketCustomer(row)?.name },
    { accessorKey: 'machine', header: 'Machine' },
    { id: 'engineer', header: 'Engineer', accessorFn: (row) => ticketEngineer(row) },
    { accessorKey: 'priority', header: 'Priority', cell: ({ row }) => <Badge variant={PRIORITY_VARIANT[row.original.priority]} className="capitalize">{row.original.priority}</Badge> },
    { accessorKey: 'slaDueAt', header: 'SLA Due', cell: ({ row }) => formatDateTime(row.original.slaDueAt) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Service Desk"
        description="Customer complaints, tickets, and engineer allocation."
        actions={<EntityToolbar newLabel="New Ticket" onNew={() => {}} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
        <KpiCard label="Open Tickets" value={String(open)} icon={Headphones} accent="chart-6" />
        <KpiCard label="Urgent" value={String(urgent)} icon={AlertTriangle} accent="chart-4" />
        <KpiCard label="Closed (Total)" value={String(closed)} icon={CheckCircle2} accent="chart-1" />
        <KpiCard label="Avg. SLA" value="18h" icon={Clock} accent="chart-2" />
      </div>

      <DataTable columns={columns} data={TICKETS} enableSelection searchPlaceholder="Search tickets..." />
    </div>
  )
}
