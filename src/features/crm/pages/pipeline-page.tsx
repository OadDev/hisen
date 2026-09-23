import { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLeads, useUpdateLeadStage, type Lead, type LeadStage } from '@/features/crm/api'
import { LeadFormDialog } from '@/features/crm/components/lead-form-dialog'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils'
import { List, Plus, Phone, Mail, MessageCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const PIPELINE_STAGES: LeadStage[] = ['Lead', 'Discussion', 'Technical Proposal', 'Quotation', 'Negotiation', 'Advance', 'Won']

export function PipelinePage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useLeads({ per_page: 100 })
  const updateStage = useUpdateLeadStage()
  const [leads, setLeads] = useState<Lead[]>([])
  const [dragging, setDragging] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const columnRefs = useRef<Partial<Record<LeadStage, HTMLDivElement | null>>>({})

  useEffect(() => {
    if (data) setLeads(data.data.filter((l) => l.stage !== 'Lost'))
  }, [data])

  const columns = useMemo(() => {
    const map = new Map<LeadStage, Lead[]>()
    for (const stage of PIPELINE_STAGES) map.set(stage, [])
    for (const lead of leads) map.get(lead.stage)?.push(lead)
    return map
  }, [leads])

  const totalDeals = leads.length
  const totalValue = leads.reduce((sum, l) => sum + Number(l.estimatedValue), 0)

  function moveLead(id: string, stage: LeadStage) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)))
    updateStage.mutate({ id, stage })
  }

  function jumpToStage(stage: LeadStage) {
    columnRefs.current[stage]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col">
      <PageHeader
        title="Sales Pipeline"
        description="Drag deals across stages from first contact to won."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/crm/leads">
                <List /> List View
              </Link>
            </Button>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus /> Add Deal
            </Button>
          </>
        }
      />

      {!isLoading && !isError && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-sm">{totalDeals} Deals</Badge>
          <Badge variant="outline" className="text-sm font-semibold">{formatCurrency(totalValue)}</Badge>
          <Select onValueChange={(v) => jumpToStage(v as LeadStage)}>
            <SelectTrigger size="sm" className="ml-auto lg:hidden">
              <SelectValue placeholder="Jump to stage" />
            </SelectTrigger>
            <SelectContent>
              {PIPELINE_STAGES.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage} ({columns.get(stage)?.length ?? 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isLoading ? (
        <PageSkeleton />
      ) : isError ? (
        <EmptyState icon={AlertTriangle} title="Couldn't load pipeline" description={error.message} />
      ) : (
      <div ref={scrollerRef} className="flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:snap-none">
        {PIPELINE_STAGES.map((stage) => {
          const items = columns.get(stage) ?? []
          const total = items.reduce((sum, l) => sum + Number(l.estimatedValue), 0)
          return (
            <div
              key={stage}
              ref={(el) => { columnRefs.current[stage] = el }}
              className="flex w-[86vw] shrink-0 snap-center flex-col rounded-xl bg-muted/40 p-2.5 sm:w-72 sm:snap-align-none"
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
                    <p className="text-xs text-muted-foreground">{lead.contactName} · {lead.interestedProduct}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-sm font-semibold">{formatCurrency(lead.estimatedValue)}</p>
                        {lead.nextFollowUp && <p className="text-[11px] text-muted-foreground">{formatDate(lead.nextFollowUp)}</p>}
                      </div>
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">{initials(lead.owner?.name ?? 'Unassigned')}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex items-center gap-1 border-t pt-2" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`tel:${lead.phone ?? ''}`}
                        className={cn('flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground', !lead.phone && 'pointer-events-none opacity-30')}
                      >
                        <Phone className="size-3.5" />
                      </a>
                      <a
                        href={lead.phone ? `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}` : undefined}
                        target="_blank"
                        rel="noreferrer"
                        className={cn('flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground', !lead.phone && 'pointer-events-none opacity-30')}
                      >
                        <MessageCircle className="size-3.5" />
                      </a>
                      <a
                        href={`mailto:${lead.email ?? ''}`}
                        className={cn('flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground', !lead.email && 'pointer-events-none opacity-30')}
                      >
                        <Mail className="size-3.5" />
                      </a>
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

      <LeadFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
