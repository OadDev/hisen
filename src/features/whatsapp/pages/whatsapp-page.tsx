import { useState } from 'react'
import { CheckCircle2, MessageCircle, Phone, KeyRound, Webhook } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const FLOWS = [
  { id: 'inquiry', name: 'Customer Inquiry Capture', description: 'Auto-create a CRM lead from an inbound WhatsApp message.', enabled: true },
  { id: 'auto-reply', name: 'Auto Reply', description: 'Send an instant acknowledgement outside business hours.', enabled: true },
  { id: 'assignment', name: 'Sales Assignment Notification', description: 'Notify the assigned sales executive of a new lead.', enabled: true },
  { id: 'quotation', name: 'Quotation Sharing', description: 'Share quotation PDF directly on WhatsApp after approval.', enabled: true },
  { id: 'payment', name: 'Payment Reminder', description: 'Remind customers of upcoming or overdue invoice payments.', enabled: false },
  { id: 'production', name: 'Production Update', description: 'Notify customer when their order enters a new production stage.', enabled: true },
  { id: 'dispatch', name: 'Dispatch Update', description: 'Send tracking details once the shipment is dispatched.', enabled: true },
  { id: 'installation', name: 'Installation Reminder', description: 'Remind customer 24 hours ahead of scheduled installation.', enabled: false },
  { id: 'amc', name: 'AMC Renewal Reminder', description: 'Notify customers 30/15/7 days before AMC expiry.', enabled: true },
  { id: 'service', name: 'Service Reminder', description: 'Follow up on open service tickets nearing SLA breach.', enabled: false },
]

export function WhatsAppPage() {
  const [flows, setFlows] = useState(FLOWS)

  return (
    <div>
      <PageHeader title="WhatsApp Automation" description="Connect WhatsApp Business API and configure automated customer communication." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><MessageCircle className="size-4" /> Connection Status</CardTitle>
            <CardDescription>WhatsApp Business API configuration</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Status</span>
              <Badge variant="success"><CheckCircle2 className="size-3" /> Connected</Badge>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="size-3.5" /> Business Phone Number</Label>
              <Input readOnly value="+91 98765 00110" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><KeyRound className="size-3.5" /> API Access Token</Label>
              <Input readOnly value="••••••••••••••••••••wX9k" type="password" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><Webhook className="size-3.5" /> Webhook URL</Label>
              <Input readOnly value="https://api.hisenmachinery.com/webhooks/whatsapp" />
            </div>
            <Separator />
            <Button variant="outline" size="sm">Reconnect / Rotate Token</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Automation Flows</CardTitle>
            <CardDescription>Enable or disable message automations across the customer lifecycle.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {flows.map((flow) => (
              <div key={flow.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{flow.name}</p>
                  <p className="text-xs text-muted-foreground">{flow.description}</p>
                </div>
                <Switch
                  checked={flow.enabled}
                  onCheckedChange={(v) => setFlows((prev) => prev.map((f) => (f.id === flow.id ? { ...f, enabled: v } : f)))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Message Template Preview</CardTitle>
          <CardDescription>Pre-approved WhatsApp Business template for AMC renewal reminder.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm rounded-2xl rounded-tl-none bg-[#dcf8c6] p-4 text-sm text-neutral-800 dark:bg-[#0b4d3a] dark:text-neutral-100">
            <p>Hi {'{{customer_name}}'}, your AMC for {'{{machine_name}}'} (Serial: {'{{serial_no}}'}) expires on {'{{expiry_date}}'}. Renew now to continue uninterrupted preventive maintenance coverage. Reply YES to renew.</p>
            <p className="mt-2 text-right text-[10px] text-neutral-500">10:24 AM ✓✓</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
