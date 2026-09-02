import { Badge, type badgeVariants } from '@/components/ui/badge'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

type Variant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

const STATUS_MAP: Record<string, Variant> = {
  active: 'success',
  operational: 'success',
  completed: 'success',
  approved: 'success',
  paid: 'success',
  won: 'success',
  delivered: 'success',
  closed: 'success',
  passed: 'success',
  in_stock: 'success',

  pending: 'warning',
  draft: 'muted',
  'under-service': 'warning',
  'in-progress': 'info',
  in_progress: 'info',
  processing: 'info',
  scheduled: 'info',
  open: 'info',
  review: 'warning',
  'partially-paid': 'warning',
  low_stock: 'warning',
  overdue: 'destructive',

  rejected: 'destructive',
  cancelled: 'destructive',
  lost: 'destructive',
  failed: 'destructive',
  decommissioned: 'destructive',
  out_of_stock: 'destructive',
  critical: 'destructive',

  inactive: 'muted',
  prospect: 'info',
  new: 'info',
}

export function statusVariant(status: string): Variant {
  return STATUS_MAP[status.toLowerCase().replace(/\s+/g, '_')] ?? 'secondary'
}

export function StatusBadge({ status, className, label }: { status: string; className?: string; label?: string }) {
  return (
    <Badge variant={statusVariant(status)} className={cn('capitalize', className)}>
      {(label ?? status).replace(/[-_]/g, ' ')}
    </Badge>
  )
}
