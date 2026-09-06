import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2, Mail, KanbanSquare, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLeads, type Lead } from '@/features/crm/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { LeadFormDialog } from '@/features/crm/components/lead-form-dialog'

const SOURCES = ['All Sources', 'Website', 'WhatsApp', 'Trade Show', 'Alibaba', 'Made-in-China', 'Email', 'Referral', 'Sales Executive']

export function LeadsPage() {
  const navigate = useNavigate()
  const [sourceFilter, setSourceFilter] = useState('All Sources')
  const [formOpen, setFormOpen] = useState(false)

  const { data, isLoading, isError, error } = useLeads({
    per_page: 100,
    source: sourceFilter === 'All Sources' ? undefined : sourceFilter,
  })

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => (
        <button className="text-left font-medium text-foreground hover:text-primary" onClick={() => navigate(`/crm/leads/${row.original.id}`)}>
          {row.original.company}
        </button>
      ),
    },
    { accessorKey: 'contactName', header: 'Contact' },
    { accessorKey: 'source', header: 'Source', cell: ({ row }) => <Badge variant="outline">{row.original.source}</Badge> },
    { accessorKey: 'interestedProduct', header: 'Interested In' },
    {
      accessorKey: 'estimatedValue',
      header: 'Est. Value',
      cell: ({ row }) => formatCurrency(row.original.estimatedValue),
    },
    { accessorKey: 'stage', header: 'Stage', cell: ({ row }) => <StatusBadge status={row.original.stage} /> },
    { id: 'owner', header: 'Owner', accessorFn: (row) => row.owner?.name ?? 'Unassigned' },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Leads"
        description="All inbound and outbound leads across every channel."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/crm/pipeline')}>
              <KanbanSquare /> Pipeline View
            </Button>
            <EntityToolbar onNew={() => setFormOpen(true)} newLabel="New Lead" />
          </>
        }
      />

      {isLoading ? (
        <PageSkeleton />
      ) : isError ? (
        <EmptyState icon={AlertTriangle} title="Couldn't load leads" description={error.message} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          enableSelection
          searchPlaceholder="Search leads by company or contact..."
          emptyTitle="No leads found"
          emptyDescription="Try a different source filter or add a new lead."
          toolbar={
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          bulkActions={(selected) => (
            <>
              <Button variant="outline" size="sm">
                <Mail /> Email ({selected.length})
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 /> Delete
              </Button>
            </>
          )}
        />
      )}

      <LeadFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
