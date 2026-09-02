import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface AlertItem {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  icon: LucideIcon
}

const severityClass: Record<AlertItem['severity'], string> = {
  critical: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/20 text-warning-foreground',
  info: 'bg-info/15 text-info',
}

export function AlertsPanel({ alerts, title = 'Alerts' }: { alerts: AlertItem[]; title?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 rounded-lg border p-3">
            <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-md', severityClass[alert.severity])}>
              <alert.icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{alert.title}</p>
              <p className="text-xs text-muted-foreground">{alert.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
