import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Progress } from '@/components/ui/progress'
import { RFQS, type Rfq } from '@/mock/purchase'
import { formatDate } from '@/lib/utils'

export function RfqPage() {
  const columns: ColumnDef<Rfq>[] = [
    { accessorKey: 'id', header: 'RFQ #', cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
    { accessorKey: 'item', header: 'Item' },
    { accessorKey: 'quantity', header: 'Quantity' },
    {
      id: 'responses',
      header: 'Vendor Responses',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={(row.original.quotesReceived / row.original.vendorsInvited) * 100} className="w-20" />
          <span className="text-xs text-muted-foreground">{row.original.quotesReceived}/{row.original.vendorsInvited}</span>
        </div>
      ),
    },
    { accessorKey: 'dueDate', header: 'Due Date', cell: ({ row }) => formatDate(row.original.dueDate) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Request for Quotations"
        description="Send RFQs to vendors and compare quotations side by side."
        actions={<EntityToolbar newLabel="New RFQ" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={RFQS} enableSelection searchPlaceholder="Search RFQs..." />
    </div>
  )
}
