import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { WAREHOUSES, STOCK_ITEMS } from '@/mock/inventory'
import { MapPin, Boxes } from 'lucide-react'

export function WarehousesPage() {
  return (
    <div>
      <PageHeader
        title="Warehouses"
        description="Facility capacity, bin locations, and stock distribution."
        actions={<EntityToolbar newLabel="New Warehouse" onNew={() => {}} />}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {WAREHOUSES.map((wh) => {
          const itemCount = STOCK_ITEMS.filter((s) => s.warehouseId === wh.id).length
          return (
            <Card key={wh.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {wh.name}
                  <Badge variant="outline" className="capitalize">{wh.type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-3.5" /> {wh.city}</p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Boxes className="size-3.5" /> {itemCount} SKUs · {wh.binLocations} bins</p>
                <div>
                  <div className="mb-1.5 flex justify-between text-sm"><span>Capacity Used</span><span className="text-muted-foreground">{wh.capacityPct}%</span></div>
                  <Progress value={wh.capacityPct} indicatorClassName={wh.capacityPct > 85 ? 'bg-destructive' : undefined} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
