import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Wrench, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CommentsPanel } from '@/components/shared/comments-panel'
import { AttachmentsPanel } from '@/components/shared/attachments-panel'
import { Timeline } from '@/components/shared/timeline'
import { EmptyState } from '@/components/shared/empty-state'
import { ticketById, ticketCustomer, ticketEngineer } from '@/mock/service'
import { formatDateTime } from '@/lib/utils'

export function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ticket = id ? ticketById(id) : undefined

  if (!ticket) {
    return <EmptyState title="Ticket not found" description="This ticket may have been removed." />
  }

  const customer = ticketCustomer(ticket)

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate('/service')}>
        <ArrowLeft /> Back to Service Desk
      </Button>
      <PageHeader
        title={ticket.subject}
        description={`${ticket.id} · ${customer?.name ?? 'Unknown customer'} · ${ticket.machine}`}
        actions={<StatusBadge status={ticket.status} className="text-sm px-3 py-1" />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Issue Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90">{ticket.description}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="timeline">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Timeline
                    events={[
                      { id: '1', title: 'Ticket created', timestamp: ticket.createdAt, icon: Wrench, actor: customer?.contacts[0]?.name },
                      { id: '2', title: 'Assigned to engineer', description: ticketEngineer(ticket), timestamp: ticket.createdAt, icon: Wrench },
                      ...(ticket.status !== 'open'
                        ? [{ id: '3', title: 'Engineer visited site', timestamp: ticket.slaDueAt, icon: Wrench, tone: 'default' as const }]
                        : []),
                      ...(ticket.status === 'resolved' || ticket.status === 'closed'
                        ? [{ id: '4', title: 'Issue resolved', timestamp: ticket.slaDueAt, icon: CheckCircle2, tone: 'success' as const }]
                        : []),
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <CommentsPanel comments={[{ id: 'c1', author: ticketEngineer(ticket), message: 'Diagnosed the issue on-site, replacement part ordered.', timestamp: ticket.createdAt }]} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="attachments" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <AttachmentsPanel attachments={[{ id: 'a1', name: 'Fault_Photo.jpg', type: 'image', size: '2.1 MB', uploadedBy: ticketEngineer(ticket), uploadedAt: ticket.createdAt }]} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Ticket Details</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Priority</span><Badge variant="outline" className="capitalize">{ticket.priority}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Engineer</span><span className="font-medium">{ticketEngineer(ticket)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span className="font-medium">{formatDateTime(ticket.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">SLA Due</span><span className="font-medium">{formatDateTime(ticket.slaDueAt)}</span></div>
              {ticket.feedbackRating && (
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Customer Rating</span><span className="flex items-center gap-1 font-medium">{ticket.feedbackRating} <Star className="size-3.5 fill-warning text-warning" /></span></div>
              )}
            </CardContent>
          </Card>
          <Button variant="outline" onClick={() => customer && navigate(`/customers/${customer.id}`)}>View Customer</Button>
        </div>
      </div>
    </div>
  )
}
