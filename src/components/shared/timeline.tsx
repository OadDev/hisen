import type { LucideIcon } from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  timestamp: string
  icon?: LucideIcon
  actor?: string
  tone?: 'default' | 'success' | 'warning' | 'destructive'
}

const toneClass: Record<NonNullable<TimelineEvent['tone']>, string> = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/20 text-warning-foreground',
  destructive: 'bg-destructive/10 text-destructive',
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative flex flex-col gap-6 pl-1">
      {events.map((event, idx) => {
        const Icon = event.icon
        return (
          <li key={event.id} className="relative flex gap-3">
            {idx !== events.length - 1 && <span className="absolute top-7 left-[15px] h-[calc(100%+8px)] w-px bg-border" />}
            <span className={cn('relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full', toneClass[event.tone ?? 'default'])}>
              {Icon ? <Icon className="size-4" /> : <span className="size-2 rounded-full bg-current" />}
            </span>
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
              </div>
              {event.description && <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>}
              {event.actor && <p className="mt-1 text-xs text-muted-foreground">by {event.actor}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
