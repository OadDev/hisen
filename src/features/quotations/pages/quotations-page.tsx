import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2, DollarSign } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { QUOTATIONS, quotationTotal, type Quotation } from '@/mock/quotations'
import { customerById } from '@/mock/customers'
import { staffById } from '@/mock/staff'
import { formatCurrency, formatDate } from '@/lib/utils'

export function QuotationsPage() {
  const navigate = useNavigate()

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
    { id: 'customer', header: 'Customer', accessorFn: (row) => customerById(row.customerId)?.name ?? '—' },
    { id: 'owner', header: 'Owner', accessorFn: (row) => staffById(row.ownerId)?.name ?? '—' },
    {
      id: 'total',
      header: 'Value',
      accessorFn: (row) => quotationTotal(row).total,
      cell: ({ row }) => formatCurrency(quotationTotal(row.original).total, row.original.currency),
    },
    { id: 'version', header: 'Version', cell: ({ row }) => `v${row.original.versions.length}` },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'validUntil', header: 'Valid Until', cell: ({ row }) => formatDate(row.original.validUntil) },
  ]

  return (
    <div>
      <PageHeader
        title="Quotations"
        description="Track quotation versions, approvals, and conversion."
        actions={<EntityToolbar newLabel="New Quotation" onNew={() => navigate('/configurator')} />}
      />
      <DataTable
        columns={columns}
        data={QUOTATIONS}
        enableSelection
        searchPlaceholder="Search quotations..."
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
    </div>
  )
}
