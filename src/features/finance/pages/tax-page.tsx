import { PageHeader } from '@/components/shared/page-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Landmark, ReceiptText, TrendingUp, Percent } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const FILINGS = [
  { period: 'Aug 2026', type: 'GSTR-1', dueDate: '11 Sep 2026', status: 'pending' },
  { period: 'Jul 2026', type: 'GSTR-3B', dueDate: '20 Aug 2026', status: 'paid' },
  { period: 'Jun 2026', type: 'GSTR-1', dueDate: '11 Jul 2026', status: 'paid' },
  { period: 'Jun 2026', type: 'GSTR-3B', dueDate: '20 Jul 2026', status: 'paid' },
  { period: 'Q1 FY26-27', type: 'VAT (Export)', dueDate: '30 Jul 2026', status: 'paid' },
]

export function TaxPage() {
  return (
    <div>
      <PageHeader title="GST / VAT" description="Tax liability, input credit, and filing status." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
        <KpiCard label="Output GST" value={formatCurrency(1_842_000)} icon={Landmark} accent="chart-1" />
        <KpiCard label="Input Tax Credit" value={formatCurrency(1_200_000)} icon={ReceiptText} accent="chart-2" />
        <KpiCard label="Net Payable" value={formatCurrency(642_000)} icon={TrendingUp} accent="chart-4" />
        <KpiCard label="Effective Rate" value="18%" icon={Percent} accent="chart-3" />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Filing History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Return Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FILINGS.map((f, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{f.period}</TableCell>
                  <TableCell>{f.type}</TableCell>
                  <TableCell>{f.dueDate}</TableCell>
                  <TableCell><StatusBadge status={f.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
