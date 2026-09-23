import { useNavigate } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { useInvoices } from '@/features/finance/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export function LastInvoiceCard() {
  const navigate = useNavigate()
  const { data, isLoading } = useInvoices({ per_page: 1 })
  const invoice = data?.data[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Your Last Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !invoice ? (
          <p className="text-sm text-muted-foreground">No invoices raised yet.</p>
        ) : (
          <button
            className="flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50"
            onClick={() => navigate('/finance/invoices')}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Receipt className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{invoice.id}</p>
                <StatusBadge status={invoice.status} />
              </div>
              <p className="truncate text-xs text-muted-foreground">Billed to: {invoice.customerName}</p>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="font-semibold">{formatCurrency(invoice.amount, invoice.currency)}</span>
                <span className="text-xs text-muted-foreground">Due {formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </button>
        )}
      </CardContent>
    </Card>
  )
}
