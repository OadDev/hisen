import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WORK_ORDERS } from '@/mock/production'
import { cn } from '@/lib/utils'

export function ProductionCalendarPage() {
  const [monthOffset, setMonthOffset] = useState(0)
  const today = new Date()
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const eventsByDay = useMemo(() => {
    const map = new Map<number, typeof WORK_ORDERS>()
    WORK_ORDERS.forEach((wo, i) => {
      const day = ((i * 7) % 27) + 1
      const d = new Date(wo.dueDate)
      if (d.getMonth() === month && d.getFullYear() === year) {
        const arr = map.get(d.getDate()) ?? []
        arr.push(wo)
        map.set(d.getDate(), arr)
      } else if (monthOffset === 0) {
        const arr = map.get(day) ?? []
        arr.push(wo)
        map.set(day, arr)
      }
    })
    return map
  }, [month, year, monthOffset])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div>
      <PageHeader
        title="Production Calendar"
        description="Scheduled work order milestones and due dates."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" onClick={() => setMonthOffset((m) => m - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-32 text-center text-sm font-medium">{viewDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
            <Button variant="outline" size="icon-sm" onClick={() => setMonthOffset((m) => m + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="bg-muted px-2 py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
        ))}
        {cells.map((day, i) => {
          const events = day ? eventsByDay.get(day) ?? [] : []
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          return (
            <div key={i} className={cn('min-h-28 bg-background p-1.5', !day && 'bg-muted/30')}>
              {day && (
                <>
                  <span className={cn('mb-1 inline-flex size-6 items-center justify-center rounded-full text-xs', isToday && 'bg-primary text-primary-foreground font-semibold')}>
                    {day}
                  </span>
                  <div className="flex flex-col gap-1">
                    {events.slice(0, 2).map((e) => (
                      <Badge key={e.id} variant="outline" className="block truncate text-[10px]">
                        {e.id} · {e.stage}
                      </Badge>
                    ))}
                    {events.length > 2 && <span className="text-[10px] text-muted-foreground">+{events.length - 2} more</span>}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
