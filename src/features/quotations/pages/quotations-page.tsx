import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2, DollarSign, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuotations, type Quotation } from '@/features/quotations/api'
import { formatCurrency, formatDate } from '@/lib/utils'

const PRIORITIES = ['All Priorities', 'low', 'medium', 'high']

export function QuotationsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') ?? 'All Priorities')
  const { data, isLoading, isError, error } = useQuotations({
    per_page: 100,
    priority: priorityFilter === 'All Priorities' ? undefined : priorityFilter,
  })

  const columns: ColumnDef<Quotation>[] = [
    {
      accessorKey: 'id',
      header: 'Quotation #',
      cell: ({ row }) => (
        <button className="font-medium text-foreground hover:text-primary" onClick={() => navigate(`/quotations/${row.original.id}`)}>
          {row.original.id}
        </button>
      ),
    },
    { id: 'customer', header: 'Customer', accessorFn: (row) => row.customer?.name ?? '—' },
    { id: 'owner', header: 'Owner', accessorFn: (row) => row.owner?.name ?? '—' },
    {
      id: 'total',
      header: 'Value',
      accessorFn: (row) => row.total,
      cell: ({ row }) => formatCurrency(row.original.total, row.original.currency),
    },
    { id: 'version', header: 'Version', cell: ({ row }) => `v${row.original.versions.length}` },
    { accessorKey: 'priority', header: 'Priority', cell: ({ row }) => <StatusBadge status={row.original.priority} /> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'validUntil', header: 'Valid Until', cell: ({ row }) => (row.original.validUntil ? formatDate(row.original.validUntil) : '—') },
  ]

  return (
    <div>
      <PageHeader
        title="Quotations"
        description="Track quotation versions, approvals, and conversion."
        actions={<EntityToolbar newLabel="New Quotation" onNew={() => navigate('/configurator')} />}
      />
      {isLoading ? (
        <PageSkeleton />
      ) : isError ? (
        <EmptyState icon={AlertTriangle} title="Couldn't load quotations" description={error.message} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          enableSelection
          searchPlaceholder="Search quotations..."
          toolbar={
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          bulkActions={(selected) => (
            <>
              <Button variant="outline" size="sm">
                <DollarSign /> Bulk Approve
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 /> Delete ({selected.length})
              </Button>
            </>
          )}
        />
      )}
    </div>
  )
}
