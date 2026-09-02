import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CommentsPanel } from '@/components/shared/comments-panel'
import { AttachmentsPanel } from '@/components/shared/attachments-panel'
import { EmptyState } from '@/components/shared/empty-state'
import { workOrderById, engineerName, WORK_ORDER_STAGES } from '@/mock/production'
import { formatDate } from '@/lib/utils'

export function WorkOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const wo = id ? workOrderById(id) : undefined

  if (!wo) {
    return <EmptyState title="Work order not found" description="This work order may have been removed." />
  }

  const currentIndex = WORK_ORDER_STAGES.indexOf(wo.stage)

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate('/production/work-orders')}>
        <ArrowLeft /> Back to Work Orders
      </Button>
      <PageHeader
        title={wo.id}
        description={`${wo.machineName} · Sales Order ${wo.salesOrderId}`}
        actions={<StatusBadge status={wo.status} className="text-sm px-3 py-1" />}
      />

      <Card className="mb-4">
        <CardHeader><CardTitle className="text-base">Stage Progress</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {WORK_ORDER_STAGES.map((stage, index) => {
            const done = index < currentIndex || wo.status === 'completed'
            const active = index === currentIndex && wo.status !== 'completed'
            return (
              <div key={stage} className="flex items-center gap-3">
                {done ? <CheckCircle2 className="size-5 text-success" /> : active ? <Clock className="size-5 text-primary" /> : <Circle className="size-5 text-muted-foreground" />}
                <span className={`flex-1 text-sm ${active ? 'font-semibold' : done ? 'text-foreground' : 'text-muted-foreground'}`}>{stage}</span>
                {active && <Progress value={wo.progress} className="w-32" />}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="materials">Materials Used</TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <CommentsPanel
                    comments={[
                      { id: 'c1', author: engineerName(wo), message: `Started ${wo.stage.toLowerCase()} stage. On track for the planned due date.`, timestamp: wo.startDate },
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
                      { id: 'a1', name: 'Assembly_Drawing_Rev2.pdf', type: 'pdf', size: '3.1 MB', uploadedBy: engineerName(wo), uploadedAt: wo.startDate },
                      { id: 'a2', name: 'Electrical_Wiring_Diagram.pdf', type: 'pdf', size: '2.4 MB', uploadedBy: engineerName(wo), uploadedAt: wo.startDate },
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="materials" className="mt-4">
              <EmptyState title="No materials logged yet" description="Materials consumed for this work order will appear here." />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Assigned Engineer</span><span className="font-medium">{engineerName(wo)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Start Date</span><span className="font-medium">{formatDate(wo.startDate)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Due Date</span><span className="font-medium">{formatDate(wo.dueDate)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Priority</span><span className="font-medium capitalize">{wo.priority}</span></div>
            </CardContent>
          </Card>
          <Button variant="outline" onClick={() => navigate(`/sales-orders/${wo.salesOrderId}`)}>View Sales Order</Button>
          <Button variant="outline" onClick={() => navigate('/quality')}>View QC Checklist</Button>
        </div>
      </div>
    </div>
  )
}
