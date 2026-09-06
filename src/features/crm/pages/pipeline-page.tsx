import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useLeads, useUpdateLeadStage, type Lead, type LeadStage } from '@/features/crm/api'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { cn, formatCurrency, initials } from '@/lib/utils'
import { List, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const PIPELINE_STAGES: LeadStage[] = ['Lead', 'Discussion', 'Technical Proposal', 'Quotation', 'Negotiation', 'Advance', 'Won']

export function PipelinePage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useLeads({ per_page: 100 })
  const updateStage = useUpdateLeadStage()
  const [leads, setLeads] = useState<Lead[]>([])
  const [dragging, setDragging] = useState<string | null>(null)

  useEffect(() => {
    if (data) setLeads(data.data.filter((l) => l.stage !== 'Lost'))
  }, [data])

  const columns = useMemo(() => {
    const map = new Map<LeadStage, Lead[]>()
    for (const stage of PIPELINE_STAGES) map.set(stage, [])
    for (const lead of leads) map.get(lead.stage)?.push(lead)
    return map
  }, [leads])

  function moveLead(id: string, stage: LeadStage) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)))
    updateStage.mutate({ id, stage })
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col">
      <PageHeader
        title="Sales Pipeline"
        description="Drag deals across stages from first contact to won."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/crm/leads">
              <List /> List View
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <PageSkeleton />
      ) : isError ? (
        <EmptyState icon={AlertTriangle} title="Couldn't load pipeline" description={error.message} />
      ) : (
      <div className="flex flex-1 gap-3 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const items = columns.get(stage) ?? []
          const total = items.reduce((sum, l) => sum + l.estimatedValue, 0)
          return (
            <div
              key={stage}
              className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/40 p-2.5"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragging && moveLead(dragging, stage)}
            >
              <div className="flex items-center justify-between px-1 pb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{stage}</p>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{formatCurrency(total)}</span>
              </div>
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto scrollbar-thin">
                {items.map((lead) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragging(lead.id)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => navigate(`/crm/leads/${lead.id}`)}
                    className={cn(
                      'cursor-grab gap-2 rounded-lg p-3 shadow-none transition-shadow hover:shadow-md active:cursor-grabbing',
                      dragging === lead.id && 'opacity-50',
                    )}
                  >
                    <p className="text-sm font-medium leading-tight">{lead.company}</p>
                    <p className="text-xs text-muted-foreground">{lead.interestedProduct}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-semibold">{formatCurrency(lead.estimatedValue)}</span>
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">{initials(lead.owner?.name ?? 'Unassigned')}</AvatarFallback>
                      </Avatar>
                    </div>
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed py-6 text-center text-xs text-muted-foreground">Drop deals here</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
