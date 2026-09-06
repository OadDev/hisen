import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, MessageCircle, Calendar, FileText, Building2, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Timeline, type TimelineEvent } from '@/components/shared/timeline'
import { CommentsPanel } from '@/components/shared/comments-panel'
import { AttachmentsPanel } from '@/components/shared/attachments-panel'
import { EmptyState } from '@/components/shared/empty-state'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { useLead } from '@/features/crm/api'
import { formatCurrency, formatDate, formatDateTime, initials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const ACTIVITY_ICONS = { call: Phone, meeting: Calendar, email: Mail, whatsapp: MessageCircle, note: FileText, 'stage-change': Building2 }

export function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: lead, isLoading, isError, error } = useLead(id)

  if (isLoading) {
    return <PageSkeleton />
  }

  if (isError || !lead) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Lead not found"
        description={error?.message ?? 'This lead may have been removed.'}
      />
    )
  }

  const ownerName = lead.owner?.name ?? 'Unassigned'

  const events: TimelineEvent[] = (lead.activities ?? []).map((a) => ({
    id: String(a.id),
    title: a.title,
    description: a.description ?? undefined,
    timestamp: a.occurredAt,
    actor: a.actor?.name,
    icon: ACTIVITY_ICONS[a.type],
    tone: a.type === 'stage-change' ? 'success' : 'default',
  }))

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate('/crm/leads')}>
        <ArrowLeft /> Back to Leads
      </Button>
      <PageHeader
        title={lead.company}
        description={`${lead.contactName} · ${lead.country}`}
        actions={
          <>
            <StatusBadge status={lead.stage} className="text-sm px-3 py-1" />
            <Button size="sm" variant="outline">
              <FileText /> Create Quotation
            </Button>
            <Button size="sm">Convert to Opportunity</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Source</p>
                <Badge variant="outline" className="mt-1">{lead.source}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Estimated Value</p>
                <p className="mt-1 font-medium">{formatCurrency(lead.estimatedValue)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Interested In</p>
                <p className="mt-1 font-medium">{lead.interestedProduct}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Owner</p>
                <p className="mt-1 font-medium">{ownerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="mt-1 font-medium">{formatDate(lead.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next Follow-up</p>
                <p className="mt-1 font-medium">{lead.nextFollowUp ? formatDate(lead.nextFollowUp) : '—'}</p>
              </div>
              {lead.lostReason && (
                <div className="col-span-full">
                  <p className="text-muted-foreground">Lost Reason</p>
                  <p className="mt-1 font-medium text-destructive">{lead.lostReason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="timeline">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="quotations">Quotation History</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Timeline events={events} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <CommentsPanel
                    comments={[
                      { id: 'c1', author: ownerName, message: 'Customer is comparing with two other vendors. Sending a revised techno-commercial proposal.', timestamp: lead.createdAt },
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="attachments" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <AttachmentsPanel
                    attachments={[
                      { id: 'a1', name: 'Technical_Proposal_v2.pdf', type: 'pdf', size: '1.4 MB', uploadedBy: ownerName, uploadedAt: lead.createdAt },
                      { id: 'a2', name: 'Site_Photos.zip', type: 'doc', size: '8.2 MB', uploadedBy: ownerName, uploadedAt: lead.createdAt },
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="quotations" className="mt-4">
              <EmptyState icon={FileText} title="No quotations yet" description="Create a quotation from this lead once requirements are finalized." />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback>{initials(lead.contactName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{lead.contactName}</p>
                  <p className="text-xs text-muted-foreground">{lead.company}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Mail className="size-4" /> {lead.email}
                </a>
                <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Phone className="size-4" /> {lead.phone}
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">
                  <Phone /> Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail /> Email
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle /> WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reminders</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {lead.nextFollowUp ? (
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Follow-up call</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(lead.nextFollowUp)}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reminders scheduled.</p>
              )}
              <Button variant="outline" size="sm" className="mt-1">
                <Calendar /> Schedule reminder
              </Button>
            </CardContent>
          </Card>

          <Link to="/crm/pipeline" className="text-center text-sm font-medium text-primary hover:underline">
            View in Pipeline Board →
          </Link>
        </div>
      </div>
    </div>
  )
}
