import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FileText, Handshake, Target, Users, Plus, KanbanSquare } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'
import { ActivityFeed } from '@/features/dashboard/components/activity-feed'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { ORDER_FUNNEL } from '@/mock/analytics'
import { CUSTOMERS } from '@/mock/customers'
import { formatCurrency } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const topCustomers = [...CUSTOMERS].sort((a, b) => b.lifetimeValue - a.lifetimeValue).slice(0, 6)

export function SalesDashboard() {
  return (
    <div>
      <PageHeader title="Sales Dashboard" description="Pipeline health, quota attainment, and top accounts." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Pipeline Value" value={formatCurrency(21_600_000)} icon={Target} trend={{ value: 9.4, label: 'vs last month' }} accent="chart-2" />
        <KpiCard label="Quotations Sent" value="168" icon={FileText} trend={{ value: 4.2 }} accent="chart-1" />
        <KpiCard label="Win Rate" value="34%" icon={Handshake} trend={{ value: 2.1 }} accent="chart-3" />
        <KpiCard label="New Leads (30d)" value="96" icon={Users} trend={{ value: 12.7 }} accent="chart-4" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Pipeline Funnel</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ORDER_FUNNEL}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="value" name="Deals" fill="var(--chart-2)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <QuickActions
          actions={[
            { label: 'New Lead', to: '/crm/leads?new=1', icon: Plus },
            { label: 'New Quotation', to: '/quotations?new=1', icon: FileText },
            { label: 'Pipeline Board', to: '/crm/pipeline', icon: KanbanSquare },
            { label: 'Customers', to: '/customers', icon: Users },
          ]}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Accounts by Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead className="text-right">LTV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell><Badge variant="outline">{c.industry}</Badge></TableCell>
                    <TableCell className="text-right">{formatCurrency(c.lifetimeValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <ActivityFeed
          events={[
            { id: '1', title: 'Follow-up call completed', description: 'Discussed technical proposal with Zenith Auto Parts', timestamp: new Date().toISOString(), actor: 'Priya Sharma' },
            { id: '2', title: 'Quotation revised (v3)', description: 'QTN-2408 — added extraction accessory', timestamp: new Date(Date.now() - 3600e3 * 3).toISOString(), actor: 'Rohit Mehta' },
            { id: '3', title: 'Lead converted to Sales Order', description: 'Coastal Sheet Metal · ₹32,00,000', timestamp: new Date(Date.now() - 3600e3 * 20).toISOString(), tone: 'success' },
          ]}
        />
      </div>
    </div>
  )
}
