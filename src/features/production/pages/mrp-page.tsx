import type { ColumnDef } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { KpiCard } from '@/components/shared/kpi-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MRP_REQUIREMENTS, type MrpRequirement } from '@/mock/production'
import { Boxes, ShoppingCart, PackageSearch } from 'lucide-react'

export function MrpPage() {
  const shortfalls = MRP_REQUIREMENTS.filter((r) => r.shortfall > 0)

  const columns: ColumnDef<MrpRequirement>[] = [
    { accessorKey: 'component', header: 'Component' },
    { accessorKey: 'required', header: 'Required', cell: ({ row }) => `${row.original.required} ${row.original.unit}` },
    { accessorKey: 'inStock', header: 'In Stock', cell: ({ row }) => `${row.original.inStock} ${row.original.unit}` },
    { accessorKey: 'onOrder', header: 'On Order', cell: ({ row }) => `${row.original.onOrder} ${row.original.unit}` },
    {
      accessorKey: 'shortfall',
      header: 'Shortfall',
      cell: ({ row }) =>
        row.original.shortfall > 0 ? (
          <Badge variant="destructive">{row.original.shortfall} {row.original.unit}</Badge>
        ) : (
          <Badge variant="success">Sufficient</Badge>
        ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Material Requirements Planning"
        description="Aggregate component demand from active work orders against available stock."
        actions={<EntityToolbar showImport={false} newLabel="Run MRP" onNew={() => {}} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Components Tracked" value={String(MRP_REQUIREMENTS.length)} icon={Boxes} accent="chart-1" />
        <KpiCard label="Shortfalls" value={String(shortfalls.length)} icon={AlertTriangle} accent="chart-4" />
        <KpiCard label="Suggested POs" value={String(shortfalls.length)} icon={ShoppingCart} accent="chart-2" />
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={MRP_REQUIREMENTS}
          searchPlaceholder="Search components..."
          toolbar={
            <Button size="sm" variant="outline">
              <PackageSearch /> Generate Purchase Requisitions
            </Button>
          }
        />
      </div>
    </div>
  )
}
