import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ClipboardList, Truck, Wallet, AlertTriangle, FileText, Handshake } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { AlertsPanel } from '@/features/dashboard/components/alerts-panel'
import { PURCHASE_SPEND } from '@/mock/analytics'
import { formatCurrency } from '@/lib/utils'

export function PurchaseDashboard() {
  return (
    <div>
      <PageHeader title="Purchase Dashboard" description="Procurement spend, vendor performance, and pending approvals." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open RFQs" value="14" icon={FileText} accent="chart-2" />
        <KpiCard label="POs Awaiting Approval" value="7" icon={ClipboardList} accent="chart-4" />
        <KpiCard label="Monthly Spend" value={formatCurrency(2_640_000)} icon={Wallet} trend={{ value: 5.3 }} accent="chart-1" />
        <KpiCard label="On-Time Delivery" value="91%" icon={Truck} trend={{ value: 1.8 }} accent="chart-3" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Purchase Spend Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PURCHASE_SPEND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v) => `${v / 100000}L`} />
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="value" name="Spend" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <QuickActions
          actions={[
            { label: 'New RFQ', to: '/purchase/rfq', icon: FileText },
            { label: 'Purchase Orders', to: '/purchase/orders', icon: ClipboardList },
            { label: 'Goods Receipt', to: '/purchase/grn', icon: Truck },
            { label: 'Vendors', to: '/vendors', icon: Handshake },
          ]}
        />
      </div>

      <div className="mt-4">
        <AlertsPanel
          title="Purchase Alerts"
          alerts={[
            { id: '1', title: 'PO-4482 delivery overdue', description: 'Precision Bearings Co. — 4 days overdue.', severity: 'critical', icon: AlertTriangle },
            { id: '2', title: '3 RFQs closing today', description: 'Vendor quotations due by end of day.', severity: 'warning', icon: AlertTriangle },
            { id: '3', title: 'Vendor rate contract expiring', description: 'Steel Alloy Suppliers Pvt Ltd — renews in 10 days.', severity: 'info', icon: AlertTriangle },
          ]}
        />
      </div>
    </div>
  )
}
