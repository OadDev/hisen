import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  icon?: LucideIcon
  trend?: { value: number; label?: string }
  accent?: 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5' | 'chart-6'
  className?: string
}

export function KpiCard({ label, value, icon: Icon, trend, accent = 'chart-1', className }: KpiCardProps) {
  const positive = (trend?.value ?? 0) >= 0
  return (
    <Card className={cn('gap-3 py-5', className)}>
      <CardContent className="px-5">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {Icon && (
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `color-mix(in oklch, var(--${accent}) 16%, transparent)` }}
            >
              <Icon className="size-4" style={{ color: `var(--${accent})` }} />
            </span>
          )}
        </div>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        {trend && (
          <div className={cn('mt-2 inline-flex items-center gap-1 text-xs font-medium', positive ? 'text-success' : 'text-destructive')}>
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            <span>{Math.abs(trend.value)}%</span>
            {trend.label && <span className="text-muted-foreground font-normal">{trend.label}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
