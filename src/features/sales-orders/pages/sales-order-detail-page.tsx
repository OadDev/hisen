import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Factory, PackageCheck, Wrench, Receipt } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/shared/empty-state'
import { salesOrderById, customerForOrder } from '@/mock/sales-orders'
import { quotationById, quotationTotal } from '@/mock/quotations'
import { staffById } from '@/mock/staff'
import { formatCurrency, formatDate } from '@/lib/utils'

const STAGES = [
  { key: 'pending', label: 'Order Confirmed', icon: Receipt },
  { key: 'production', label: 'In Production', icon: Factory },
  { key: 'dispatched', label: 'Dispatched', icon: PackageCheck },
  { key: 'installed', label: 'Installed', icon: Wrench },
]

export function SalesOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const order = id ? salesOrderById(id) : undefined

  if (!order) {
    return <EmptyState title="Sales order not found" description="This order may have been removed." />
  }

  const customer = customerForOrder(order)
  const quotation = quotationById(order.quotationId)
  const owner = staffById(order.ownerId)
  const currentStageIndex = STAGES.findIndex((s) => s.key === order.status)
  const balance = order.orderValue - order.advancePaid

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate('/sales-orders')}>
        <ArrowLeft /> Back to Sales Orders
      </Button>
      <PageHeader
        title={order.id}
        description={`${customer?.name ?? 'Unknown'} · Owner: ${owner?.name ?? '—'}`}
        actions={<StatusBadge status={order.status} className="text-sm px-3 py-1" />}
      />

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {STAGES.map((stage, index) => {
              const done = currentStageIndex === -1 ? false : index <= currentStageIndex
              const Icon = stage.icon
              return (
                <div key={stage.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-center">
                    {index > 0 && <div className={`h-0.5 flex-1 ${done ? 'bg-primary' : 'bg-border'}`} />}
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="size-4" />
                    </span>
                    {index < STAGES.length - 1 && <div className={`h-0.5 flex-1 ${index < currentStageIndex ? 'bg-primary' : 'bg-border'}`} />}
                  </div>
                  <span className="text-xs font-medium text-center">{stage.label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Configuration Summary</CardTitle></CardHeader>
            <CardContent>
              {quotation ? (
                <div className="flex flex-col gap-2">
                  {quotation.lineItems.map((li) => (
                    <div key={li.id} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
                      <span className="font-medium">{li.productName} × {li.quantity}</span>
                      <span>{formatCurrency(li.unitPrice * li.quantity * (1 - li.discountPct / 100), order.currency)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 text-sm font-semibold">
                    <span>Total Order Value</span>
                    <span>{formatCurrency(quotationTotal(quotation).total, order.currency)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Linked quotation not found.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Production Status</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Overall progress</span>
                <span className="text-muted-foreground">{order.productionProgress}%</span>
              </div>
              <Progress value={order.productionProgress} />
              <Button variant="link" className="mt-2 h-auto p-0" onClick={() => navigate('/production/work-orders')}>
                View linked work order →
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Payments</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Order Value</span><span className="font-medium">{formatCurrency(order.orderValue, order.currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Advance Paid</span><span className="font-medium text-success">{formatCurrency(order.advancePaid, order.currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Balance Due</span><span className="font-medium">{formatCurrency(balance, order.currency)}</span></div>
              <StatusBadge status={order.paymentStatus} className="w-fit" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Shipment & Installation</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Expected Dispatch</span><span className="font-medium">{formatDate(order.expectedDispatch)}</span></div>
              <Button variant="outline" size="sm" onClick={() => navigate('/dispatch')}>View Dispatch Plan</Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/installation')}>View Installation Schedule</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
