import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { Factory, Gauge, Timer, AlertTriangle, ClipboardList, CalendarDays } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { AlertsPanel } from '@/features/dashboard/components/alerts-panel'
import { PRODUCTION_EFFICIENCY } from '@/mock/analytics'
import { Progress } from '@/components/ui/progress'

const STAGES = [
  { name: 'Assembly', progress: 82 },
  { name: 'Electrical', progress: 64 },
  { name: 'PLC Programming', progress: 48 },
  { name: 'Testing', progress: 36 },
  { name: 'Final QC', progress: 20 },
]

export function ProductionDashboard() {
  return (
    <div>
      <PageHeader title="Production Dashboard" description="Work order throughput, efficiency, and stage-wise load." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Work Orders" value="42" icon={Factory} accent="chart-3" />
        <KpiCard label="Avg. Cycle Time" value="18.4 days" icon={Timer} trend={{ value: -6.2, label: 'improved' }} accent="chart-2" />
        <KpiCard label="OEE" value="78.6%" icon={Gauge} trend={{ value: 3.1 }} accent="chart-1" />
        <KpiCard label="Open NCRs" value="6" icon={AlertTriangle} trend={{ value: -12 }} accent="chart-4" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Planned vs Actual Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PRODUCTION_EFFICIENCY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" unit="%" />
                <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="planned" name="Planned" stroke="var(--chart-3)" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <QuickActions
          actions={[
            { label: 'Work Orders', to: '/production/work-orders', icon: ClipboardList },
            { label: 'Prod. Calendar', to: '/production/calendar', icon: CalendarDays },
            { label: 'Capacity Plan', to: '/production/capacity', icon: Gauge },
            { label: 'Quality Control', to: '/quality', icon: AlertTriangle },
          ]}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Load by Stage</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {STAGES.map((s) => (
              <div key={s.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.progress}%</span>
                </div>
                <Progress value={s.progress} />
              </div>
            ))}
          </CardContent>
        </Card>
        <AlertsPanel
          title="Production Alerts"
          alerts={[
            { id: '1', title: 'WO-2214 behind schedule', description: 'Electrical stage delayed by 3 days due to component shortage.', severity: 'critical', icon: AlertTriangle },
            { id: '2', title: 'NCR-118 pending disposition', description: 'Spindle vibration out of tolerance on WO-2198.', severity: 'warning', icon: AlertTriangle },
            { id: '3', title: 'Assembly Line 2 at full capacity', description: 'Fully booked Monday to Thursday next week.', severity: 'info', icon: AlertTriangle },
          ]}
        />
      </div>
    </div>
  )
}
