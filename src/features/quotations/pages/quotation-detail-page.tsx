import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, Printer, ShoppingCart, History, CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/shared/empty-state'
import { quotationById, quotationTotal } from '@/mock/quotations'
import { customerById } from '@/mock/customers'
import { staffById } from '@/mock/staff'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'

export function QuotationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const quotation = id ? quotationById(id) : undefined

  if (!quotation) {
    return <EmptyState title="Quotation not found" description="This quotation may have been removed." />
  }

  const customer = customerById(quotation.customerId)
  const owner = staffById(quotation.ownerId)
  const totals = quotationTotal(quotation)

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate('/quotations')}>
        <ArrowLeft /> Back to Quotations
      </Button>
      <PageHeader
        title={quotation.id}
        description={`${customer?.name ?? 'Unknown customer'} · Prepared by ${owner?.name ?? 'Sales Team'}`}
        actions={
          <>
            <StatusBadge status={quotation.status} className="text-sm px-3 py-1" />
            <Button size="sm" variant="outline"><Printer /> Print</Button>
            <Button size="sm" variant="outline"><Mail /> Email</Button>
            <Button size="sm" variant="outline"><MessageCircle /> WhatsApp</Button>
            {quotation.status !== 'won' && (
              <Button size="sm" onClick={() => { toast.success('Sales order created'); navigate('/sales-orders') }}>
                <ShoppingCart /> Convert to Sales Order
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotation.lineItems.map((li) => (
                    <TableRow key={li.id}>
                      <TableCell className="font-medium">{li.productName}</TableCell>
                      <TableCell className="text-right">{li.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(li.unitPrice, quotation.currency)}</TableCell>
                      <TableCell className="text-right">{li.discountPct}%</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(li.quantity * li.unitPrice * (1 - li.discountPct / 100), quotation.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 ml-auto flex max-w-xs flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(totals.subtotal, quotation.currency)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Discount ({quotation.discountPct}%)</span><span>-{formatCurrency(totals.subtotal - totals.afterDiscount, quotation.currency)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Tax ({quotation.taxPct}%)</span><span>{formatCurrency(totals.tax, quotation.currency)}</span></div>
                <div className="flex justify-between border-t pt-1.5 text-base font-semibold"><span>Total</span><span>{formatCurrency(totals.total, quotation.currency)}</span></div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="versions">
            <TabsList>
              <TabsTrigger value="versions">Version History</TabsTrigger>
              <TabsTrigger value="approval">Approval</TabsTrigger>
            </TabsList>
            <TabsContent value="versions" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3">
                    {[...quotation.versions].reverse().map((v) => (
                      <div key={v.version} className="flex items-start gap-3 rounded-lg border p-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <History className="size-4" />
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Version {v.version}</p>
                            <span className="text-xs text-muted-foreground">{formatDateTime(v.updatedAt)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{v.note}</p>
                          <p className="mt-1 text-xs text-muted-foreground">by {v.updatedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="approval" className="mt-4">
              <Card>
                <CardContent className="flex flex-col gap-4 pt-6">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="size-5 text-success" />
                      <div>
                        <p className="text-sm font-medium">Discount within approved matrix</p>
                        <p className="text-xs text-muted-foreground">Sales Manager approval not required for discounts under 10%.</p>
                      </div>
                    </div>
                    <Badge variant="success">Auto-approved</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                      <XCircle /> Reject
                    </Button>
                    <Button size="sm">
                      <CheckCircle2 /> Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Quotation Details</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span className="font-medium">{formatDate(quotation.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Valid Until</span><span className="font-medium">{formatDate(quotation.validUntil)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span className="font-medium">{quotation.currency}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Owner</span><span className="font-medium">{owner?.name}</span></div>
            </CardContent>
          </Card>
          {customer && (
            <Card>
              <CardHeader><CardTitle className="text-base">Customer</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <button className="text-left font-medium text-primary hover:underline" onClick={() => navigate(`/customers/${customer.id}`)}>
                  {customer.name}
                </button>
                <p className="text-muted-foreground">{customer.industry}</p>
                <p className="text-muted-foreground">{customer.branches[0]?.city}, {customer.branches[0]?.country}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
