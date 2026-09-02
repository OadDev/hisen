import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Landmark, Receipt, TrendingDown, TrendingUp, FileText, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { CASH_FLOW } from '@/mock/analytics'
import { formatCurrency } from '@/lib/utils'

export function FinanceDashboard() {
  return (
    <div>
      <PageHeader title="Finance Dashboard" description="Cash flow, receivables health, and tax position." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Receivables (Outstanding)" value={formatCurrency(8_420_000)} icon={Receipt} trend={{ value: -3.5, label: 'improved' }} accent="chart-4" />
        <KpiCard label="Payables Due" value={formatCurrency(3_180_000)} icon={Wallet} accent="chart-2" />
        <KpiCard label="Net Cash Flow (MTD)" value={formatCurrency(1_960_000)} icon={TrendingUp} trend={{ value: 6.8 }} accent="chart-1" />
        <KpiCard label="GST Payable" value={formatCurrency(642_000)} icon={Landmark} accent="chart-3" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Cash Inflow vs Outflow</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CASH_FLOW}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v) => `${v / 100000}L`} />
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} cursor={{ fill: 'var(--muted)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="inflow" name="Inflow" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="outflow" name="Outflow" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <QuickActions
          actions={[
            { label: 'Invoices', to: '/finance/invoices', icon: FileText },
            { label: 'Receivables', to: '/finance/receivables', icon: Receipt },
            { label: 'Payables', to: '/finance/payables', icon: TrendingDown },
            { label: 'GST / VAT', to: '/finance/tax', icon: Landmark },
          ]}
        />
      </div>
    </div>
  )
}
