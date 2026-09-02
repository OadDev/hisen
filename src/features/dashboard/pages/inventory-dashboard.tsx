import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Warehouse, PackageSearch, AlertTriangle, ArrowLeftRight, Boxes, Barcode } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { INVENTORY_VALUE_TREND, WAREHOUSE_UTILIZATION } from '@/mock/analytics'
import { formatCurrency } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

export function InventoryDashboard() {
  return (
    <div>
      <PageHeader title="Inventory Dashboard" description="Stock health, warehouse utilization, and movement trends." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Inventory Value" value={formatCurrency(21_200_000)} icon={Boxes} trend={{ value: 4.4 }} accent="chart-1" />
        <KpiCard label="Items Below Reorder" value="12" icon={AlertTriangle} trend={{ value: -3 }} accent="chart-4" />
        <KpiCard label="Open Transfers" value="5" icon={ArrowLeftRight} accent="chart-2" />
        <KpiCard label="SKUs Tracked" value="1,284" icon={Barcode} accent="chart-3" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Inventory Value Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INVENTORY_VALUE_TREND}>
                <defs>
                  <linearGradient id="invFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v) => `${v / 100000}L`} />
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
                <Area type="monotone" dataKey="value" name="Value" stroke="var(--chart-3)" fill="url(#invFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <QuickActions
          actions={[
            { label: 'Stock Items', to: '/inventory/stock', icon: PackageSearch },
            { label: 'Warehouses', to: '/inventory/warehouses', icon: Warehouse },
            { label: 'Stock Transfers', to: '/inventory/transfers', icon: ArrowLeftRight },
            { label: 'Machine Tracking', to: '/machine-tracking', icon: Barcode },
          ]}
        />
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Warehouse Utilization</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {WAREHOUSE_UTILIZATION.map((w) => (
              <div key={w.warehouse}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{w.warehouse}</span>
                  <span className="text-muted-foreground">{w.used}%</span>
                </div>
                <Progress value={w.used} indicatorClassName={w.used > 85 ? 'bg-destructive' : undefined} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
