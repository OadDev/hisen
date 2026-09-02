import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SPARE_PARTS_STOCK, WARRANTY_CLAIMS, type SparePartStock, type WarrantyClaim } from '@/mock/spare-parts'
import { formatCurrency, formatDate } from '@/lib/utils'

export function SparePartsPage() {
  const stockColumns: ColumnDef<SparePartStock>[] = [
    { accessorKey: 'name', header: 'Part Name', cell: ({ row }) => <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground">{row.original.sku}</p></div> },
    {
      id: 'compatibility',
      header: 'Compatible With',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.compatibleMachines.map((m) => (
            <Badge key={m} variant="outline" className="text-[10px]">{m}</Badge>
          ))}
        </div>
      ),
    },
    { accessorKey: 'quantity', header: 'In Stock' },
    { accessorKey: 'price', header: 'Price', cell: ({ row }) => formatCurrency(row.original.price) },
    {
      id: 'warranty',
      header: 'Warranty Claimable',
      cell: ({ row }) => (row.original.warrantyClaimable ? <Badge variant="success">Yes</Badge> : <Badge variant="muted">No</Badge>),
    },
  ]

  const claimColumns: ColumnDef<WarrantyClaim>[] = [
    { accessorKey: 'id', header: 'Claim #' },
    { accessorKey: 'partName', header: 'Part' },
    { accessorKey: 'customerName', header: 'Customer' },
    { accessorKey: 'submittedOn', header: 'Submitted', cell: ({ row }) => formatDate(row.original.submittedOn) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Spare Parts"
        description="Spare parts catalog, machine compatibility, and warranty claims."
        actions={<EntityToolbar newLabel="New Spare Part" onNew={() => {}} />}
      />
      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog">Catalog & Inventory</TabsTrigger>
          <TabsTrigger value="claims">Warranty Claims</TabsTrigger>
        </TabsList>
        <TabsContent value="catalog" className="mt-4">
          <DataTable columns={stockColumns} data={SPARE_PARTS_STOCK} searchPlaceholder="Search spare parts..." />
        </TabsContent>
        <TabsContent value="claims" className="mt-4">
          <DataTable columns={claimColumns} data={WARRANTY_CLAIMS} searchPlaceholder="Search claims..." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
