import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/shared/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { vendorById } from '@/mock/vendors'
import { PURCHASE_ORDERS } from '@/mock/purchase'
import { formatCurrency, formatDate } from '@/lib/utils'

export function VendorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vendor = id ? vendorById(id) : undefined

  if (!vendor) {
    return <EmptyState title="Vendor not found" description="This vendor may have been removed." />
  }

  const orders = PURCHASE_ORDERS.filter((po) => po.vendorId === vendor.id)

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate('/vendors')}>
        <ArrowLeft /> Back to Vendors
      </Button>
      <PageHeader
        title={vendor.name}
        description={
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {vendor.city}, {vendor.country} · {vendor.category}
          </span>
        }
        actions={<StatusBadge status={vendor.status} className="text-sm px-3 py-1" />}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
        <Card className="py-4"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Rating</p><p className="mt-1 flex items-center gap-1 text-lg font-semibold"><Star className="size-4 fill-warning text-warning" /> {vendor.rating}</p></CardContent></Card>
        <Card className="py-4"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Lead Time</p><p className="mt-1 text-lg font-semibold">{vendor.leadTimeDays} days</p></CardContent></Card>
        <Card className="py-4"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Total Orders</p><p className="mt-1 text-lg font-semibold">{vendor.totalOrders}</p></CardContent></Card>
        <Card className="py-4"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Total Spend</p><p className="mt-1 text-lg font-semibold">{formatCurrency(vendor.totalSpend)}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Purchase Order History</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO #</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.item}</TableCell>
                      <TableCell className="text-right">{formatCurrency(po.totalValue)}</TableCell>
                      <TableCell>{formatDate(po.expectedDelivery)}</TableCell>
                      <TableCell><StatusBadge status={po.status} /></TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No purchase orders yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Performance</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <div className="mb-1.5 flex justify-between text-sm"><span>On-Time Delivery</span><span className="text-muted-foreground">{vendor.onTimeDeliveryPct}%</span></div>
                <Progress value={vendor.onTimeDeliveryPct} />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-sm"><span>Quality Score</span><span className="text-muted-foreground">{vendor.qualityScore}%</span></div>
                <Progress value={vendor.qualityScore} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Certifications</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {vendor.certifications.length ? vendor.certifications.map((c) => <Badge key={c} variant="secondary">{c}</Badge>) : <p className="text-sm text-muted-foreground">None on file</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
