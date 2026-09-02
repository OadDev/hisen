import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, FileText, MessageCircle, Send } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Stepper } from '@/features/configurator/components/stepper'
import { ProductThumbnail } from '@/components/shared/product-thumbnail'
import { MACHINES, VOLTAGE_OPTIONS, COUNTRY_STANDARDS } from '@/mock/products'
import { CUSTOMERS } from '@/mock/customers'
import { formatCurrency } from '@/lib/utils'

const MODULES = [
  { id: 'rotary-axis', label: '4th Axis Rotary Attachment', price: 185000 },
  { id: 'auto-tool-changer', label: 'Automatic Tool Changer (ATC)', price: 320000 },
  { id: 'advanced-plc', label: 'Advanced PLC Control Package', price: 95000 },
  { id: 'remote-monitoring', label: 'IoT Remote Monitoring Module', price: 65000 },
  { id: 'high-speed-spindle', label: 'High-Speed Spindle Upgrade', price: 145000 },
]

const ACCESSORY_OPTIONS = [
  { id: 'chiller', label: 'Water Chiller Unit', price: 78000 },
  { id: 'dust-extraction', label: 'Dust Extraction System', price: 54000 },
  { id: 'fume-extractor', label: 'Fume Extractor', price: 42000 },
  { id: 'vacuum-table', label: 'Vacuum Table', price: 68000 },
]

const STEPS = [
  { id: 'machine', label: 'Select Machine' },
  { id: 'modules', label: 'Modules & Options' },
  { id: 'power', label: 'Voltage & Standard' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'warranty', label: 'Warranty & Installation' },
  { id: 'review', label: 'Review & Quotation' },
]

export function ConfiguratorPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [machineId, setMachineId] = useState(MACHINES[0]?.id)
  const [modules, setModules] = useState<string[]>([])
  const [voltage, setVoltage] = useState(VOLTAGE_OPTIONS[1])
  const [countryStandard, setCountryStandard] = useState(COUNTRY_STANDARDS[0])
  const [accessories, setAccessories] = useState<string[]>([])
  const [warranty, setWarranty] = useState('1')
  const [installation, setInstallation] = useState('onsite')
  const [customerId, setCustomerId] = useState<string | undefined>()

  const machine = MACHINES.find((m) => m.id === machineId) ?? MACHINES[0]

  const pricing = useMemo(() => {
    const base = machine?.price ?? 0
    const modulesTotal = modules.reduce((sum, id) => sum + (MODULES.find((m) => m.id === id)?.price ?? 0), 0)
    const accessoriesTotal = accessories.reduce((sum, id) => sum + (ACCESSORY_OPTIONS.find((a) => a.id === id)?.price ?? 0), 0)
    const warrantyExtra = warranty === '1' ? 0 : warranty === '2' ? base * 0.03 : base * 0.055
    const installationFee = installation === 'onsite' ? 85000 : 0
    const subtotal = base + modulesTotal + accessoriesTotal + warrantyExtra + installationFee
    const gst = subtotal * 0.18
    return { base, modulesTotal, accessoriesTotal, warrantyExtra, installationFee, subtotal, gst, total: subtotal + gst }
  }, [machine, modules, accessories, warranty, installation])

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  return (
    <div>
      <PageHeader title="Machine Configurator" description="Build a configured machine and generate a quotation instantly." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr_340px]">
        <div className="hidden lg:block">
          <Stepper steps={STEPS} current={step} onStepClick={setStep} />
        </div>

        <Card className="min-h-[480px]">
          <CardContent className="pt-6">
            {step === 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold">Choose a machine</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {MACHINES.slice(0, 8).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMachineId(m.id)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${machineId === m.id ? 'border-primary ring-1 ring-primary' : 'hover:bg-accent/50'}`}
                    >
                      <ProductThumbnail seed={m.imageSeed} category={m.category} className="size-14 shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(m.price)}</p>
                      </div>
                      {machineId === m.id && <Check className="ml-auto size-4 shrink-0 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold">Select optional modules</h3>
                <div className="flex flex-col gap-3">
                  {MODULES.map((m) => (
                    <label key={m.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/40">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={modules.includes(m.id)} onCheckedChange={() => toggle(modules, setModules, m.id)} />
                        <span className="text-sm font-medium">{m.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">+{formatCurrency(m.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Voltage</h3>
                  <RadioGroup value={voltage} onValueChange={setVoltage} className="grid grid-cols-2 gap-3">
                    {VOLTAGE_OPTIONS.map((v) => (
                      <label key={v} className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent/40">
                        <RadioGroupItem value={v} />
                        <span className="text-sm">{v}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Country / Regional Standard</h3>
                  <RadioGroup value={countryStandard} onValueChange={setCountryStandard} className="grid grid-cols-2 gap-3">
                    {COUNTRY_STANDARDS.map((c) => (
                      <label key={c} className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent/40">
                        <RadioGroupItem value={c} />
                        <span className="text-sm">{c}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold">Add accessories</h3>
                <div className="flex flex-col gap-3">
                  {ACCESSORY_OPTIONS.map((a) => (
                    <label key={a.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/40">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={accessories.includes(a.id)} onCheckedChange={() => toggle(accessories, setAccessories, a.id)} />
                        <span className="text-sm font-medium">{a.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">+{formatCurrency(a.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Warranty period</h3>
                  <RadioGroup value={warranty} onValueChange={setWarranty} className="grid grid-cols-3 gap-3">
                    {[['1', '1 Year (Standard)'], ['2', '2 Years (+3%)'], ['3', '3 Years (+5.5%)']].map(([v, label]) => (
                      <label key={v} className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent/40">
                        <RadioGroupItem value={v} />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Installation</h3>
                  <RadioGroup value={installation} onValueChange={setInstallation} className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent/40">
                      <RadioGroupItem value="onsite" />
                      <span className="text-sm">Onsite installation (+₹85,000)</span>
                    </label>
                    <label className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent/40">
                      <RadioGroupItem value="remote" />
                      <span className="text-sm">Remote / self-installation</span>
                    </label>
                  </RadioGroup>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Link to customer (optional)</h3>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger className="w-full sm:w-96">
                      <SelectValue placeholder="Select existing customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {CUSTOMERS.slice(0, 20).map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold">Quotation Preview</h3>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start justify-between border-b pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Prepared for</p>
                      <p className="font-medium">{CUSTOMERS.find((c) => c.id === customerId)?.name ?? 'Unassigned Customer'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Quotation No.</p>
                      <p className="font-medium">QTN-{Math.floor(2000 + Math.random() * 900)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <ProductThumbnail seed={machine?.imageSeed ?? ''} category="Machines" className="size-16 shrink-0" />
                    <div>
                      <p className="font-medium">{machine?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {voltage} · {countryStandard} · {warranty} Year Warranty · {installation === 'onsite' ? 'Onsite Installation' : 'Remote Installation'}
                      </p>
                    </div>
                  </div>
                  {(modules.length > 0 || accessories.length > 0) && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {modules.map((id) => (
                        <Badge key={id} variant="outline">{MODULES.find((m) => m.id === id)?.label}</Badge>
                      ))}
                      {accessories.map((id) => (
                        <Badge key={id} variant="outline">{ACCESSORY_OPTIONS.find((a) => a.id === id)?.label}</Badge>
                      ))}
                    </div>
                  )}
                  <Separator className="my-4" />
                  <PriceRows pricing={pricing} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => { toast.success('Quotation created from configuration'); navigate('/quotations') }}>
                    <FileText /> Generate Quotation
                  </Button>
                  <Button variant="outline">
                    <Send /> Email PDF
                  </Button>
                  <Button variant="outline">
                    <MessageCircle /> Share via WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Live Price Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceRows pricing={pricing} compact />
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ChevronLeft /> Back
            </Button>
            <Button className="flex-1" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PriceRows({ pricing, compact }: { pricing: { base: number; modulesTotal: number; accessoriesTotal: number; warrantyExtra: number; installationFee: number; subtotal: number; gst: number; total: number }; compact?: boolean }) {
  return (
    <div className={compact ? 'flex flex-col gap-2 text-sm' : 'flex flex-col gap-2 text-sm max-w-sm ml-auto'}>
      <Row label="Base machine price" value={pricing.base} />
      {pricing.modulesTotal > 0 && <Row label="Modules & options" value={pricing.modulesTotal} />}
      {pricing.accessoriesTotal > 0 && <Row label="Accessories" value={pricing.accessoriesTotal} />}
      {pricing.warrantyExtra > 0 && <Row label="Extended warranty" value={pricing.warrantyExtra} />}
      {pricing.installationFee > 0 && <Row label="Installation" value={pricing.installationFee} />}
      <Separator className="my-1" />
      <Row label="Subtotal" value={pricing.subtotal} />
      <Row label="GST (18%)" value={pricing.gst} />
      <Separator className="my-1" />
      <div className="flex items-center justify-between text-base font-semibold">
        <span>Total</span>
        <span>{formatCurrency(pricing.total)}</span>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{formatCurrency(value)}</span>
    </div>
  )
}
