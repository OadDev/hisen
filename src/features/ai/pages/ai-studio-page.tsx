import { useState } from 'react'
import {
  Sparkles, FileText, TrendingUp, Wrench, LineChart, Boxes, MessageSquareText, FileStack, CalendarClock, Send, Bot, User,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const FEATURES = [
  { id: 'quotation-ai', icon: FileText, name: 'AI Quotation Recommendation', description: 'Suggests optimal machine configuration and pricing based on similar past deals.' },
  { id: 'material-forecast', icon: Boxes, name: 'Material Forecasting', description: 'Predicts component demand from the sales pipeline and lead times.' },
  { id: 'predictive-maintenance', icon: Wrench, name: 'Predictive Maintenance', description: 'Flags machines at risk of failure using usage and service history.' },
  { id: 'sales-forecast', icon: TrendingUp, name: 'Sales Forecasting', description: 'Projects revenue by region and product line for the next quarter.' },
  { id: 'inventory-optimization', icon: LineChart, name: 'Inventory Optimization', description: 'Recommends reorder points and safety stock per SKU.' },
  { id: 'chatbot', icon: MessageSquareText, name: 'AI Chatbot', description: 'Internal assistant for ERP queries, trained on your company data.' },
  { id: 'doc-gen', icon: FileStack, name: 'Document Generation', description: 'Auto-drafts quotations, COAs, and installation reports.' },
  { id: 'scheduling', icon: CalendarClock, name: 'Smart Scheduling', description: 'Optimizes engineer visit routes and production line allocation.' },
]

export function AiStudioPage() {
  const [active, setActive] = useState('chatbot')
  const feature = FEATURES.find((f) => f.id === active)!

  return (
    <div>
      <PageHeader
        title="AI Studio"
        description="AI-powered assistance across sales, production, inventory, and service — ready for Claude/OpenAI integration."
        actions={<Badge variant="outline" className="gap-1.5"><Sparkles className="size-3.5" /> Preview build — not yet connected to a live model</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {FEATURES.map((f) => (
          <button key={f.id} onClick={() => setActive(f.id)} className="text-left">
            <Card className={cn('h-full gap-2 py-4 transition-colors hover:border-primary/40', active === f.id && 'border-primary ring-1 ring-primary')}>
              <CardContent className="px-4">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-4.5" />
                </span>
                <p className="mt-3 text-sm font-medium leading-tight">{f.name}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{f.description}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><feature.icon className="size-4" /> {feature.name}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {active === 'chatbot' && <ChatbotDemo />}
          {active === 'quotation-ai' && <QuotationRecommendation />}
          {active === 'predictive-maintenance' && <PredictiveMaintenance />}
          {active === 'material-forecast' && <ForecastList title="Predicted Shortfall (Next 30 Days)" items={[
            { name: 'Servo Motor', value: '38 units short' },
            { name: 'Ball Screw Assembly', value: '22 units short' },
            { name: 'PLC Control Module', value: '14 units short' },
          ]} />}
          {active === 'sales-forecast' && <ForecastList title="Q3 Revenue Projection by Region" items={[
            { name: 'West India', value: '₹1.82 Cr (+12%)' },
            { name: 'South India', value: '₹1.34 Cr (+8%)' },
            { name: 'Middle East', value: '₹68 L (+21%)' },
          ]} />}
          {active === 'inventory-optimization' && <ForecastList title="Reorder Point Recommendations" items={[
            { name: 'Servo Drive Board', value: 'Increase ROP from 15 to 22' },
            { name: 'Cutting Oil (20L)', value: 'Reduce safety stock by 10%' },
            { name: 'Limit Switch Kit', value: 'Increase ROP from 8 to 12' },
          ]} />}
          {active === 'doc-gen' && <DocGenDemo />}
          {active === 'scheduling' && <ForecastList title="Suggested Engineer Route — Tomorrow" items={[
            { name: '9:00 AM — Continental Fabricators (Ahmedabad)', value: 'AMC Visit' },
            { name: '11:30 AM — Zenith Auto Parts (Ahmedabad)', value: 'Installation' },
            { name: '2:30 PM — Coastal Sheet Metal (Gandhinagar)', value: 'Service Ticket' },
          ]} />}
        </CardContent>
      </Card>
    </div>
  )
}

function ChatbotDemo() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm the Hisen ERP assistant. Ask me about orders, inventory, or customer accounts." },
    { role: 'user', text: 'Which sales orders are delayed this week?' },
    { role: 'assistant', text: '3 sales orders are at risk: SO-3341 (electrical stage delay), SO-3358 (awaiting servo motor from vendor), and SO-3362 (customer payment pending). Want me to notify the owners?' },
  ])
  const [draft, setDraft] = useState('')

  function send() {
    if (!draft.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: draft }, { role: 'assistant', text: 'This is a preview build — live responses will be available once connected to a model.' }])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto rounded-lg border p-4">
        {messages.map((m, i) => (
          <div key={i} className={cn('flex gap-2', m.role === 'user' && 'flex-row-reverse')}>
            <Avatar className="size-7 shrink-0">
              <AvatarFallback>{m.role === 'user' ? <User className="size-3.5" /> : <Bot className="size-3.5" />}</AvatarFallback>
            </Avatar>
            <div className={cn('max-w-md rounded-lg px-3 py-2 text-sm', m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask about orders, inventory, customers..." onKeyDown={(e) => e.key === 'Enter' && send()} />
        <Button onClick={send}><Send /></Button>
      </div>
    </div>
  )
}

function QuotationRecommendation() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {[
        { title: 'HM CNC Router Pro 1325', confidence: 92, reason: 'Matches 5 similar won deals in Sheet Metal industry' },
        { title: '+ Auto Tool Changer', confidence: 78, reason: '68% of similar customers added this module' },
        { title: '2-Year Extended Warranty', confidence: 65, reason: 'Improves win rate by 14% for export customers' },
      ].map((r) => (
        <div key={r.title} className="rounded-lg border p-3">
          <p className="text-sm font-medium">{r.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{r.reason}</p>
          <div className="mt-3 flex items-center gap-2">
            <Progress value={r.confidence} className="flex-1" />
            <span className="text-xs font-medium text-muted-foreground">{r.confidence}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function PredictiveMaintenance() {
  const rows = [
    { machine: 'HM CNC Router Pro 1325 · Continental Fabricators', risk: 'High', probability: 82 },
    { machine: 'HM Laser Cutter X2 · Zenith Auto Parts', risk: 'Medium', probability: 54 },
    { machine: 'HM VMC 2030 · Coastal Sheet Metal', risk: 'Low', probability: 18 },
  ]
  const riskVariant = { High: 'destructive', Medium: 'warning', Low: 'success' } as const
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.machine} className="flex items-center justify-between gap-4 rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">{r.machine}</p>
            <p className="text-xs text-muted-foreground">Predicted failure window: next 30–45 days</p>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={r.probability} className="w-24" />
            <Badge variant={riskVariant[r.risk as keyof typeof riskVariant]}>{r.risk} Risk</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

function DocGenDemo() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4">
      <div>
        <p className="text-sm font-medium">Generate Installation Completion Report</p>
        <p className="text-xs text-muted-foreground">Auto-drafts from checklist, photos, and customer sign-off data.</p>
      </div>
      <Button size="sm"><Sparkles /> Generate Draft</Button>
    </div>
  )
}

function ForecastList({ title, items }: { title: string; items: { name: string; value: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium">{title}</p>
      <div className="flex flex-col divide-y rounded-lg border">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between px-3 py-2.5 text-sm">
            <span>{item.name}</span>
            <span className="font-medium text-muted-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
