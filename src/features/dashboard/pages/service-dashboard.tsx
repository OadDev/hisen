import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Headphones, Wrench, CalendarClock, Star, Plus, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { AlertsPanel } from '@/features/dashboard/components/alerts-panel'
import { SERVICE_TICKET_TREND } from '@/mock/analytics'
import { AlertTriangle } from 'lucide-react'

export function ServiceDashboard() {
  return (
    <div>
      <PageHeader title="Service Dashboard" description="Ticket volume, SLA performance, and AMC coverage." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open Tickets" value="38" icon={Headphones} accent="chart-6" />
        <KpiCard label="Avg. Resolution Time" value="1.8 days" icon={Wrench} trend={{ value: -8.4, label: 'improved' }} accent="chart-2" />
        <KpiCard label="AMC Renewals Due" value="9" icon={CalendarClock} accent="chart-4" />
        <KpiCard label="CSAT Score" value="4.6 / 5" icon={Star} trend={{ value: 1.2 }} accent="chart-1" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Tickets Opened vs Resolved</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SERVICE_TICKET_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="opened" name="Opened" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <QuickActions
          actions={[
            { label: 'New Ticket', to: '/service?new=1', icon: Plus },
            { label: 'AMC Contracts', to: '/amc', icon: CalendarClock },
            { label: 'Installations', to: '/installation', icon: Wrench },
            { label: 'Engineer Map', to: '/service', icon: MapPin },
          ]}
        />
      </div>

      <div className="mt-4">
        <AlertsPanel
          title="Service Alerts"
          alerts={[
            { id: '1', title: 'SLA breach risk on TCK-1182', description: 'Priority: High — response due in 40 minutes.', severity: 'critical', icon: AlertTriangle },
            { id: '2', title: '9 AMC contracts renewing this month', description: 'Auto-reminders scheduled via WhatsApp.', severity: 'warning', icon: AlertTriangle },
            { id: '3', title: 'Engineer unavailable', description: 'Vikram Singh on leave — 2 visits need reassignment.', severity: 'info', icon: AlertTriangle },
          ]}
        />
      </div>
    </div>
  )
}
