import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { IndianRupee, ShoppingCart, Factory, Users, TrendingUp, AlertTriangle, FileText, Wrench, Plus, PackageCheck } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'
import { ActivityFeed } from '@/features/dashboard/components/activity-feed'
import { AlertsPanel } from '@/features/dashboard/components/alerts-panel'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { REVENUE_TREND, ORDER_FUNNEL, SALES_BY_REGION, CATEGORY_SALES_SPLIT } from '@/mock/analytics'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)']

export function ExecutiveDashboard() {
  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        description="Company-wide performance across sales, production, and finance."
        actions={
          <>
            <Select defaultValue="fy">
              <SelectTrigger size="sm" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fy">This Financial Year</SelectItem>
                <SelectItem value="qtr">This Quarter</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline">Export Report</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue (YTD)" value={formatCurrency(58_400_000)} icon={IndianRupee} trend={{ value: 14.2, label: 'vs last year' }} accent="chart-1" />
        <KpiCard label="Open Sales Orders" value="86" icon={ShoppingCart} trend={{ value: 6.1, label: 'vs last month' }} accent="chart-2" />
        <KpiCard label="Production Utilization" value="82%" icon={Factory} trend={{ value: -2.4, label: 'vs last month' }} accent="chart-3" />
        <KpiCard label="Active Customers" value="312" icon={Users} trend={{ value: 8.5, label: 'vs last quarter' }} accent="chart-4" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Revenue vs Target</CardTitle>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><TrendingUp className="size-3.5" /> On track</span>
          </CardHeader>
          <CardContent className="h-72 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND} margin={{ left: 8, right: 8 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v) => `${v / 100000}L`} width={40} />
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--chart-1)" fill="url(#revFill)" strokeWidth={2} />
                <Area type="monotone" dataKey="target" name="Target" stroke="var(--chart-3)" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_SALES_SPLIT} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {CATEGORY_SALES_SPLIT.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
              {CATEGORY_SALES_SPLIT.map((c, i) => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                  {c.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales Funnel</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ORDER_FUNNEL} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="stage" width={90} tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="value" name="Count" fill="var(--chart-2)" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales by Region</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_BY_REGION}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="region" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="value" name="Share" fill="var(--chart-4)" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <QuickActions
          actions={[
            { label: 'New Quotation', to: '/quotations?new=1', icon: FileText },
            { label: 'New Sales Order', to: '/sales-orders?new=1', icon: Plus },
            { label: 'New Work Order', to: '/production/work-orders?new=1', icon: Wrench },
            { label: 'Dispatch Planner', to: '/dispatch', icon: PackageCheck },
          ]}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ActivityFeed
          events={[
            { id: '1', title: 'Sales Order SO-3341 confirmed', description: 'Continental Fabricators · ₹18,40,000', timestamp: new Date().toISOString(), actor: 'Priya Sharma', tone: 'success' },
            { id: '2', title: 'Work Order WO-2214 moved to Electrical stage', description: 'HM CNC Router Pro 1325', timestamp: new Date(Date.now() - 3600e3 * 5).toISOString(), actor: 'Suresh Nair' },
            { id: '3', title: 'Quotation QTN-2451 approved', description: 'Al Falah Trading LLC · $62,500', timestamp: new Date(Date.now() - 3600e3 * 9).toISOString(), actor: 'Rohit Mehta', tone: 'success' },
            { id: '4', title: 'NCR raised on Final QC', description: 'WO-2198 — spindle vibration out of tolerance', timestamp: new Date(Date.now() - 3600e3 * 14).toISOString(), actor: 'Quality Team', tone: 'destructive' },
            { id: '5', title: 'Payment received', description: 'INV-3382 · ₹4,50,000', timestamp: new Date(Date.now() - 3600e3 * 30).toISOString(), actor: 'Accounts', tone: 'success' },
          ]}
        />
        <AlertsPanel
          alerts={[
            { id: '1', title: '5 invoices overdue', description: 'Total outstanding ₹28.4L across 5 customers.', severity: 'critical', icon: AlertTriangle },
            { id: '2', title: '3 AMC contracts expiring in 15 days', description: 'Renewal reminders scheduled via WhatsApp.', severity: 'warning', icon: AlertTriangle },
            { id: '3', title: '12 items below reorder level', description: 'Servo Drive Board, Ball Screw Assembly and others.', severity: 'warning', icon: AlertTriangle },
            { id: '4', title: 'Capacity at 92% next week', description: 'Assembly line 2 is fully booked Mon–Thu.', severity: 'info', icon: AlertTriangle },
          ]}
        />
      </div>
    </div>
  )
}
