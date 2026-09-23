import { useEffect, useState } from 'react'
import { Clock, CheckCircle2 } from 'lucide-react'
import type { LeadActivity } from '@/features/crm/api'

const RESPONSE_TYPES = new Set(['call', 'meeting', 'email', 'whatsapp'])

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}

/** Time-to-first-response indicator: ticks live while unresponded, freezes once a response-type activity lands. */
export function ResponseSlaBadge({ createdAt, activities }: { createdAt: string; activities: LeadActivity[] }) {
  const firstResponse = activities
    .filter((a) => RESPONSE_TYPES.has(a.type))
    .reduce<LeadActivity | null>((earliest, a) => (!earliest || new Date(a.occurredAt) < new Date(earliest.occurredAt) ? a : earliest), null)

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (firstResponse) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [firstResponse])

  if (firstResponse) {
    const ms = new Date(firstResponse.occurredAt).getTime() - new Date(createdAt).getTime()
    return (
      <div className="flex items-center gap-2 rounded-lg bg-success/15 px-3 py-2 text-sm text-success">
        <CheckCircle2 className="size-4 shrink-0" />
        <span>Responded within <strong>{formatDuration(ms)}</strong></span>
      </div>
    )
  }

  const elapsed = now - new Date(createdAt).getTime()
  return (
    <div className="flex items-center gap-2 rounded-lg bg-warning/20 px-3 py-2 text-sm text-warning-foreground">
      <Clock className="size-4 shrink-0" />
      <span>Awaiting first response · <strong>{formatDuration(elapsed)}</strong></span>
    </div>
  )
}
