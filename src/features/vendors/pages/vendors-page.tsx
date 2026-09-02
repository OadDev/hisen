import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Star } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { VENDORS, type Vendor } from '@/mock/vendors'
import { formatCurrency } from '@/lib/utils'

export function VendorsPage() {
  const navigate = useNavigate()

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: 'name',
      header: 'Vendor',
      cell: ({ row }) => (
        <button className="text-left font-medium hover:text-primary" onClick={() => navigate(`/vendors/${row.original.id}`)}>
          {row.original.name}
        </button>
      ),
    },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge> },
    { id: 'location', header: 'Location', accessorFn: (row) => `${row.city}, ${row.country}` },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          <Star className="size-3.5 fill-warning text-warning" /> {row.original.rating}
        </span>
      ),
    },
    {
      accessorKey: 'onTimeDeliveryPct',
      header: 'On-Time Delivery',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.onTimeDeliveryPct} className="w-20" />
          <span className="text-xs text-muted-foreground">{row.original.onTimeDeliveryPct}%</span>
        </div>
      ),
    },
    { accessorKey: 'totalSpend', header: 'Total Spend', cell: ({ row }) => formatCurrency(row.original.totalSpend) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Vendors"
        description="Vendor profiles, performance scorecards, and certifications."
        actions={<EntityToolbar newLabel="New Vendor" onNew={() => {}} />}
      />
      <DataTable columns={columns} data={VENDORS} enableSelection searchPlaceholder="Search vendors..." />
    </div>
  )
}
