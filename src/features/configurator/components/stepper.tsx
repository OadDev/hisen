import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Step {
  id: string
  label: string
}

export function Stepper({ steps, current, onStepClick }: { steps: Step[]; current: number; onStepClick?: (index: number) => void }) {
  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, index) => {
        const isDone = index < current
        const isCurrent = index === current
        return (
          <button
            key={step.id}
            onClick={() => onStepClick?.(index)}
            disabled={index > current}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
              isCurrent && 'bg-accent',
              index > current && 'cursor-not-allowed opacity-50',
              index <= current && 'hover:bg-accent/60',
            )}
          >
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                isDone ? 'bg-success text-success-foreground' : isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
              )}
            >
              {isDone ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span className={cn('text-sm font-medium', isCurrent ? 'text-foreground' : 'text-muted-foreground')}>{step.label}</span>
          </button>
        )
      })}
    </div>
  )
}
