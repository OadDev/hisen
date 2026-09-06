import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'
import { KpiCard } from '@/components/shared/kpi-card'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { useLeads } from '@/features/crm/api'
import { formatCurrency } from '@/lib/utils'
import { TrendingDown, DollarSign, Percent, AlertTriangle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const CHART_COLORS = ['var(--chart-4)', 'var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-5)', 'var(--chart-6)']

export function LostLeadsPage() {
  const { data, isLoading, isError, error } = useLeads({ per_page: 100 })
  const allLeads = useMemo(() => data?.data ?? [], [data])
  const lost = useMemo(() => allLeads.filter((l) => l.stage === 'Lost'), [allLeads])

  const reasonBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    for (const lead of lost) {
      const reason = lead.lostReason ?? 'Unknown'
      map.set(reason, (map.get(reason) ?? 0) + 1)
    }
    return Array.from(map, ([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count)
  }, [lost])

  const sourceBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    for (const lead of lost) map.set(lead.source, (map.get(lead.source) ?? 0) + 1)
    return Array.from(map, ([source, value]) => ({ source, value }))
  }, [lost])

  const lostValue = lost.reduce((sum, l) => sum + l.estimatedValue, 0)
  const winRate = allLeads.length ? Math.round((allLeads.filter((l) => l.stage === 'Won').length / allLeads.length) * 100) : 0

  if (isLoading) {
    return <PageSkeleton />
  }

  if (isError) {
    return <EmptyState icon={AlertTriangle} title="Couldn't load lost leads" description={error.message} />
  }

  return (
    <div>
      <PageHeader title="Lost Lead Analysis" description="Understand why deals are lost and where to improve." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Lost Deals" value={String(lost.length)} icon={TrendingDown} accent="chart-4" />
        <KpiCard label="Lost Value" value={formatCurrency(lostValue)} icon={DollarSign} accent="chart-2" />
        <KpiCard label="Overall Win Rate" value={`${winRate}%`} icon={Percent} accent="chart-1" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reasons for Loss</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reasonBreakdown} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="reason" width={140} tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="count" name="Deals" fill="var(--chart-4)" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lost by Source</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceBreakdown} dataKey="value" nameKey="source" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {sourceBreakdown.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Lost Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lost.slice(0, 15).map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell>{lead.owner?.name ?? 'Unassigned'}</TableCell>
                  <TableCell><Badge variant="outline">{lead.source}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{lead.lostReason}</TableCell>
                  <TableCell className="text-right">{formatCurrency(lead.estimatedValue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
