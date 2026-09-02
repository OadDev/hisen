import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/shared/kpi-card'
import { STOCK_ITEMS, WAREHOUSES, type StockItem } from '@/mock/inventory'
import { Boxes, AlertTriangle, PackageX, Warehouse as WarehouseIcon } from 'lucide-react'

export function StockItemsPage() {
  const lowStock = STOCK_ITEMS.filter((s) => s.status === 'low_stock').length
  const outOfStock = STOCK_ITEMS.filter((s) => s.status === 'out_of_stock').length

  const columns: ColumnDef<StockItem>[] = [
    { accessorKey: 'name', header: 'Item', cell: ({ row }) => <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground">{row.original.sku}</p></div> },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge> },
    { id: 'warehouse', header: 'Warehouse', accessorFn: (row) => WAREHOUSES.find((w) => w.id === row.warehouseId)?.name },
    { accessorKey: 'binLocation', header: 'Bin' },
    { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => `${row.original.quantity} ${row.original.unit}` },
    { accessorKey: 'reorderLevel', header: 'Reorder Level' },
    { accessorKey: 'agingDays', header: 'Aging', cell: ({ row }) => `${row.original.agingDays}d` },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Stock Items"
        description="Real-time inventory across all warehouses with batch and bin tracking."
        actions={<EntityToolbar newLabel="New Stock Entry" onNew={() => {}} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
        <KpiCard label="Total SKUs" value={String(STOCK_ITEMS.length)} icon={Boxes} accent="chart-1" />
        <KpiCard label="Low Stock" value={String(lowStock)} icon={AlertTriangle} accent="chart-4" />
        <KpiCard label="Out of Stock" value={String(outOfStock)} icon={PackageX} accent="chart-2" />
        <KpiCard label="Warehouses" value={String(WAREHOUSES.length)} icon={WarehouseIcon} accent="chart-3" />
      </div>

      <DataTable columns={columns} data={STOCK_ITEMS} enableSelection searchPlaceholder="Search stock items..." />
    </div>
  )
}
