import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FileText, Handshake, Target, Users, Plus, KanbanSquare, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'
import { ActivityFeed } from '@/features/dashboard/components/activity-feed'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { StatusBadge } from '@/components/shared/status-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { useLeads, type LeadStage } from '@/features/crm/api'
import { useQuotations, type QuotationPriority } from '@/features/quotations/api'
import { CUSTOMERS } from '@/mock/customers'
import { formatCurrency } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const topCustomers = [...CUSTOMERS].sort((a, b) => b.lifetimeValue - a.lifetimeValue).slice(0, 6)

const PIPELINE_STAGES: LeadStage[] = ['Lead', 'Discussion', 'Technical Proposal', 'Quotation', 'Negotiation', 'Advance', 'Won']
const OPEN_QUOTATION_STATUSES = new Set(['draft', 'pending', 'approved'])
const PRIORITIES: QuotationPriority[] = ['high', 'medium', 'low']

export function SalesDashboard() {
  const { data: leadsData, isLoading: leadsLoading, isError: leadsError } = useLeads({ per_page: 100 })
  const { data: quotationsData, isLoading: quotationsLoading, isError: quotationsError } = useQuotations({ per_page: 100 })

  const leads = leadsData?.data ?? []
  const quotations = quotationsData?.data ?? []

  const pipelineValue = useMemo(
    () => leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost').reduce((sum, l) => sum + Number(l.estimatedValue), 0),
    [leads],
  )

  const winRate = useMemo(() => {
    const decided = leads.filter((l) => l.stage === 'Won' || l.stage === 'Lost')
    if (decided.length === 0) return 0
    return Math.round((decided.filter((l) => l.stage === 'Won').length / decided.length) * 100)
  }, [leads])

  const newLeads30d = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 3600e3
    return leads.filter((l) => new Date(l.createdAt).getTime() >= cutoff).length
  }, [leads])

  const funnelData = useMemo(
    () => PIPELINE_STAGES.map((stage) => ({ stage, value: leads.filter((l) => l.stage === stage).length })),
    [leads],
  )

  const quotationsSent = quotations.filter((q) => q.status !== 'draft').length
  const openQuotations = quotations.filter((q) => OPEN_QUOTATION_STATUSES.has(q.status))
  const openByPriority = PRIORITIES.map((p) => ({ priority: p, count: openQuotations.filter((q) => q.priority === p).length }))

  const isLoading = leadsLoading || quotationsLoading
  const isError = leadsError || quotationsError

  return (
    <div>
      <PageHeader title="Sales Dashboard" description="Pipeline health, quota attainment, and top accounts." />

      {isError && (
        <EmptyState icon={AlertTriangle} title="Some dashboard data couldn't load" description="Pipeline and quotation figures below may be incomplete." />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Pipeline Value" value={isLoading ? '—' : formatCurrency(pipelineValue)} icon={Target} accent="chart-2" />
        <KpiCard label="Quotations Sent" value={isLoading ? '—' : String(quotationsSent)} icon={FileText} accent="chart-1" />
        <KpiCard label="Win Rate" value={isLoading ? '—' : `${winRate}%`} icon={Handshake} accent="chart-3" />
        <KpiCard label="New Leads (30d)" value={isLoading ? '—' : String(newLeads30d)} icon={Users} accent="chart-4" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Pipeline Funnel</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" allowDecimals={false} />
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

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open Quotations by Priority</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {openByPriority.map(({ priority, count }) => (
              <Link
                key={priority}
                to={`/quotations?priority=${priority}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <StatusBadge status={priority} />
                <span className="text-sm font-semibold">{count} open</span>
              </Link>
            ))}
            <p className="mt-1 text-xs text-muted-foreground">{openQuotations.length} open quotations in total — click a priority to filter the list.</p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
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
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
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
