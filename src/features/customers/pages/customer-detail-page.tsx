import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, FileText, Cog, ShieldCheck, Headphones, Mail, Phone, AlertTriangle } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/shared/empty-state'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCustomer } from '@/features/customers/api'
import { formatCurrency, formatDate, initials } from '@/lib/utils'

export function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: customer, isLoading, isError, error } = useCustomer(id)

  if (isLoading) {
    return <PageSkeleton />
  }

  if (isError || !customer) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Customer not found"
        description={error?.message ?? 'This customer record may have been removed.'}
      />
    )
  }

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate('/customers')}>
        <ArrowLeft /> Back to Customers
      </Button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-14 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary/10 text-lg text-primary">{initials(customer.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
              <StatusBadge status={customer.status} />
              {customer.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {customer.branches[0]?.city}, {customer.branches[0]?.country} · {customer.industry}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText /> New Quotation
          </Button>
          <Button size="sm">Edit Customer</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
        <Card className="py-4"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Lifetime Value</p><p className="mt-1 text-lg font-semibold">{formatCurrency(customer.lifetimeValue)}</p></CardContent></Card>
        <Card className="py-4"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Credit Limit</p><p className="mt-1 text-lg font-semibold">{formatCurrency(customer.creditLimit)}</p></CardContent></Card>
        <Card className="py-4"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Credit Days</p><p className="mt-1 text-lg font-semibold">{customer.creditDays} days</p></CardContent></Card>
        <Card className="py-4"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Installed Machines</p><p className="mt-1 text-lg font-semibold">{customer.installedMachines.length}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branches">Branches & Contacts</TabsTrigger>
          <TabsTrigger value="machines">Installed Machines</TabsTrigger>
          <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          <TabsTrigger value="amc">AMC & Warranty</TabsTrigger>
          <TabsTrigger value="service">Service History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Company Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">GSTIN</p><p className="mt-1 font-medium">{customer.gstin}</p></div>
                <div><p className="text-muted-foreground">PAN</p><p className="mt-1 font-medium">{customer.panNumber}</p></div>
                <div><p className="text-muted-foreground">Currency</p><p className="mt-1 font-medium">{customer.currency}</p></div>
                <div><p className="text-muted-foreground">Account Owner</p><p className="mt-1 font-medium">{customer.accountOwner ?? '—'}</p></div>
                <div><p className="text-muted-foreground">Customer Since</p><p className="mt-1 font-medium">{formatDate(customer.createdAt)}</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Primary Contact</CardTitle></CardHeader>
              <CardContent>
                {customer.contacts[0] ? (
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback>{initials(customer.contacts[0].name)}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{customer.contacts[0].name}</p>
                      <p className="text-xs text-muted-foreground">{customer.contacts[0].designation}</p>
                      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="size-3.5" />{customer.contacts[0].email}</span>
                        <span className="flex items-center gap-1"><Phone className="size-3.5" />{customer.contacts[0].phone}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No contact on file.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branches" className="mt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Branches</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-3">
                {customer.branches.map((b) => (
                  <div key={b.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{b.name}</p>
                      {b.isHeadOffice && <Badge variant="secondary">HQ</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{b.address}, {b.city}, {b.state}, {b.country}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Contact Persons</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-3">
                {customer.contacts.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar><AvatarFallback>{initials(c.name)}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{c.name}</p>
                        {c.isPrimary && <Badge variant="secondary">Primary</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.designation} · {c.email}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="machines" className="mt-4">
          {customer.installedMachines.length === 0 ? (
            <EmptyState icon={Cog} title="No installed machines" description="Machines will appear here once dispatched and installed." />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Machine</TableHead>
                      <TableHead>Serial No.</TableHead>
                      <TableHead>Installed On</TableHead>
                      <TableHead>Warranty Ends</TableHead>
                      <TableHead>AMC</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.installedMachines.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.productName}</TableCell>
                        <TableCell className="font-mono text-xs">{m.serialNumber}</TableCell>
                        <TableCell>{formatDate(m.installedOn)}</TableCell>
                        <TableCell>{formatDate(m.warrantyEndsOn)}</TableCell>
                        <TableCell>{m.amcActive ? <Badge variant="success">Active</Badge> : <Badge variant="muted">None</Badge>}</TableCell>
                        <TableCell><StatusBadge status={m.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="purchases" className="mt-4">
          <EmptyState icon={FileText} title="Purchase history" description="Quotations and sales orders for this customer will be listed here." />
        </TabsContent>
        <TabsContent value="amc" className="mt-4">
          <EmptyState icon={ShieldCheck} title="AMC & Warranty" description="Active AMC contracts and warranty coverage will be listed here." />
        </TabsContent>
        <TabsContent value="service" className="mt-4">
          <EmptyState icon={Headphones} title="Service history" description="Past service tickets and resolutions will be listed here." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
