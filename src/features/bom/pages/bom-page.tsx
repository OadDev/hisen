import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/shared/kpi-card'
import { MACHINE_BOM, BOM_MACHINES, type BomComponent } from '@/mock/bom'
import { formatCurrency } from '@/lib/utils'
import { Layers, Boxes, Wallet, History } from 'lucide-react'

function componentCost(c: BomComponent): number {
  if (c.children) return c.children.reduce((sum, child) => sum + componentCost(child) * child.quantity, 0)
  return c.unitCost
}

export function BomPage() {
  const [machineId, setMachineId] = useState(BOM_MACHINES[0]?.id)
  const machine = BOM_MACHINES.find((m) => m.id === machineId)
  const totalCost = useMemo(() => MACHINE_BOM.reduce((sum, c) => sum + componentCost(c) * c.quantity, 0), [])
  const totalParts = useMemo(() => MACHINE_BOM.reduce((sum, c) => sum + (c.children?.length ?? 0), 0), [])

  return (
    <div>
      <PageHeader
        title="Bill of Materials"
        description="Multi-level BOM with supplier mapping and cost roll-up."
        actions={<EntityToolbar newLabel="New BOM" onNew={() => {}} />}
      />

      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Machine:</span>
        <Select value={machineId} onValueChange={setMachineId}>
          <SelectTrigger className="w-72"><SelectValue /></SelectTrigger>
          <SelectContent>
            {BOM_MACHINES.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline"><History className="size-3" /> v3 · Revised 14 Aug 2026</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <KpiCard label="Total BOM Cost" value={formatCurrency(totalCost)} icon={Wallet} accent="chart-1" />
        <KpiCard label="Component Count" value={String(totalParts)} icon={Boxes} accent="chart-2" />
        <KpiCard label="Assemblies" value={String(MACHINE_BOM.length)} icon={Layers} accent="chart-3" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{machine?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={[MACHINE_BOM[0]?.id]}>
            {MACHINE_BOM.map((assembly) => (
              <AccordionItem key={assembly.id} value={assembly.id}>
                <AccordionTrigger>
                  <div className="flex flex-1 items-center justify-between pr-4">
                    <span>{assembly.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">{formatCurrency(componentCost(assembly))}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col divide-y">
                    {assembly.children?.map((c) => (
                      <div key={c.id} className="grid grid-cols-5 items-center gap-2 py-2 text-sm">
                        <span className="col-span-2 font-medium">{c.name}</span>
                        <span className="text-muted-foreground">{c.partNo}</span>
                        <span className="text-muted-foreground">{c.quantity} {c.unit} · {c.supplier}</span>
                        <span className="text-right font-medium">{formatCurrency(c.unitCost * c.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
